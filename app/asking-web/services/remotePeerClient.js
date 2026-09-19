import { Peer } from "peerjs";

export const DEFAULT_PEER_SERVER_URL = "signal.godiscus.com";
export const DEFAULT_PEER_SERVER_PATH = "/peer";
export const DEFAULT_PEER_SERVER_PORT = 443;
export const DEFAULT_PEER_SERVER_KEY = "56781a4e2df9496c9f6c6a13077c308f";

const RECONNECT_DELAYS = [1000, 2000, 4000, 8000, 15000];

class RemotePeerClient {
  constructor() {
    this.peer = null;
    this.conn = null;
    this.desktopPeerId = "";
    this.userEmail = "";
    this.authToken = "";

    this.status = "DISCONNECTED"; // "CONNECTING" | "CONNECTED" | "RECONNECTING" | "OFFLINE" | "UNAUTHORIZED"
    this.statusMessage = "";
    this.latency = 0;
    this.reconnectAttempt = 0;
    this.maxReconnectAttempts = 5;

    this.pendingRequests = new Map(); // id -> { resolve, reject, timer }
    this.statusListeners = new Set();
    this.signalListeners = new Set();
    this.reconnectListeners = new Set();

    this.heartbeatTimer = null;
    this.lastPongTime = 0;
    this.reconnectTimer = null;
    this.isExplicitlyClosed = false;
  }

  // Subscribe to status updates (for indicator badge & UI)
  onStatusChange(listener) {
    this.statusListeners.add(listener);
    // Initial callback
    listener({
      status: this.status,
      message: this.statusMessage,
      latency: this.latency,
      attempt: this.reconnectAttempt,
    });
    return () => this.statusListeners.delete(listener);
  }

  // Subscribe to invalidation signals from Desktop
  onSignal(listener) {
    this.signalListeners.add(listener);
    return () => this.signalListeners.delete(listener);
  }

  // Subscribe to successful reconnections (for silent data refetch)
  onReconnectSuccess(listener) {
    this.reconnectListeners.add(listener);
    return () => this.reconnectListeners.delete(listener);
  }

  notifyStatus(status, message = "") {
    this.status = status;
    this.statusMessage = message;
    for (const listener of this.statusListeners) {
      listener({
        status: this.status,
        message: this.statusMessage,
        latency: this.latency,
        attempt: this.reconnectAttempt,
      });
    }
  }

  /**
   * Connect to AsKing Desktop host
   */
  async connect(desktopPeerId, userEmail, authToken = "") {
    if (!desktopPeerId) {
      this.notifyStatus("OFFLINE", "Kode sharing AsKing Desktop tidak valid.");
      return;
    }

    this.desktopPeerId = desktopPeerId;
    this.userEmail = userEmail;
    this.authToken = authToken;
    this.isExplicitlyClosed = false;

    this.notifyStatus("CONNECTING", "Menghubungkan ke AsKing Desktop...");
    await this.initPeerAndConnection();
  }

  async initPeerAndConnection() {
    this.cleanupPeer();

    const clientId = `web-${Math.random().toString(36).substring(2, 10)}`;

    try {
      this.peer = new Peer(clientId, {
        host: DEFAULT_PEER_SERVER_URL,
        port: DEFAULT_PEER_SERVER_PORT,
        path: DEFAULT_PEER_SERVER_PATH,
        secure: true,
        key: DEFAULT_PEER_SERVER_KEY,
        config: {
          iceServers: [
            { urls: "stun:stun.l.google.com:19302" },
            { urls: "stun:global.stun.twilio.com:3478" },
          ],
        },
      });

      this.peer.on("open", (id) => {
        console.log("[RemotePeerClient] Web client peer opened:", id);
        this.establishDataConnection();
      });

      this.peer.on("disconnected", () => {
        console.warn("[RemotePeerClient] Disconnected from signaling server");
        if (!this.isExplicitlyClosed && this.status !== "UNAUTHORIZED") {
          this.triggerReconnect();
        }
      });

      this.peer.on("error", (err) => {
        console.error("[RemotePeerClient] Peer error:", err);
        if (err.type === "peer-unavailable") {
          this.notifyStatus("OFFLINE", "AsKing Desktop sedang offline. Pastikan aplikasi desktop terbuka.");
        } else if (this.status !== "UNAUTHORIZED") {
          this.triggerReconnect();
        }
      });
    } catch (err) {
      console.error("[RemotePeerClient] Failed to initialize peer:", err);
      this.triggerReconnect();
    }
  }

  establishDataConnection() {
    if (!this.peer || this.peer.destroyed) return;

    try {
      this.conn = this.peer.connect(this.desktopPeerId, {
        reliable: true,
        metadata: {
          userEmail: this.userEmail,
          authToken: this.authToken,
          clientType: "web",
          timestamp: Date.now(),
        },
      });

      this.conn.on("open", () => {
        console.log("[RemotePeerClient] Data connection opened with Desktop:", this.desktopPeerId);
        const wasReconnecting = this.reconnectAttempt > 0;
        this.reconnectAttempt = 0;
        this.lastPongTime = Date.now();
        this.notifyStatus("CONNECTED", "Terhubung langsung ke AsKing Desktop via P2P.");

        this.startHeartbeat();

        if (wasReconnecting) {
          for (const listener of this.reconnectListeners) {
            listener();
          }
        }
      });

      this.conn.on("data", (data) => {
        this.handleIncomingData(data);
      });

      this.conn.on("close", () => {
        console.warn("[RemotePeerClient] Data connection closed");
        this.stopHeartbeat();
        if (!this.isExplicitlyClosed && this.status !== "UNAUTHORIZED") {
          this.triggerReconnect();
        }
      });

      this.conn.on("error", (err) => {
        console.error("[RemotePeerClient] Data connection error:", err);
        this.stopHeartbeat();
        if (!this.isExplicitlyClosed && this.status !== "UNAUTHORIZED") {
          this.triggerReconnect();
        }
      });
    } catch (err) {
      console.error("[RemotePeerClient] Connect error:", err);
      this.triggerReconnect();
    }
  }

  handleIncomingData(data) {
    if (!data || typeof data !== "object") return;

    // Heartbeat pong
    if (data.type === "pong") {
      this.lastPongTime = Date.now();
      if (data.clientTime) {
        this.latency = Math.max(0, Math.round((Date.now() - data.clientTime) / 2));
      }
      return;
    }

    // Auth error
    if (data.type === "auth_error") {
      this.stopHeartbeat();
      this.notifyStatus("UNAUTHORIZED", data.message || "Akses ditolak oleh AsKing Desktop.");
      this.disconnect();
      return;
    }

    // RPC Response
    if (data.type === "response" && data.replyTo) {
      const pending = this.pendingRequests.get(data.replyTo);
      if (pending) {
        clearTimeout(pending.timer);
        this.pendingRequests.delete(data.replyTo);
        if (data.success) {
          pending.resolve(data.data);
        } else {
          pending.reject(new Error(data.error?.message || "Kesalahan eksekusi RPC di Desktop."));
        }
      }
      return;
    }

    // Invalidation Signal from Desktop
    if (data.type === "signal") {
      for (const listener of this.signalListeners) {
        listener(data);
      }
      return;
    }
  }

  startHeartbeat() {
    this.stopHeartbeat();
    this.lastPongTime = Date.now();

    this.heartbeatTimer = setInterval(() => {
      if (!this.conn || !this.conn.open) {
        this.triggerReconnect();
        return;
      }

      // Check for silent drop (15 seconds without pong)
      if (Date.now() - this.lastPongTime > 15000) {
        console.warn("[RemotePeerClient] Heartbeat timeout. Dead connection detected.");
        this.triggerReconnect();
        return;
      }

      try {
        this.conn.send({
          type: "ping",
          clientTime: Date.now(),
        });
      } catch (err) {
        console.warn("[RemotePeerClient] Failed to send ping:", err);
        this.triggerReconnect();
      }
    }, 5000);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  triggerReconnect() {
    this.stopHeartbeat();
    if (this.isExplicitlyClosed || this.status === "UNAUTHORIZED") return;

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }

    this.reconnectAttempt++;
    const delay = RECONNECT_DELAYS[Math.min(this.reconnectAttempt - 1, RECONNECT_DELAYS.length - 1)];

    this.notifyStatus(
      "RECONNECTING",
      `Koneksi terputus. Mencoba menyambung ulang (${this.reconnectAttempt}/${this.maxReconnectAttempts})...`
    );

    this.reconnectTimer = setTimeout(async () => {
      console.log(`[RemotePeerClient] Reconnecting attempt ${this.reconnectAttempt}...`);
      await this.initPeerAndConnection();
    }, delay);
  }

  manualReconnect() {
    this.reconnectAttempt = 0;
    this.triggerReconnect();
  }

  /**
   * Send RPC request to Desktop and await response Promise
   */
  async sendRequest(domain, action, payload = {}, timeoutMs = 12000) {
    if (!this.conn || !this.conn.open) {
      throw new Error("Tidak terhubung ke AsKing Desktop. Silakan tunggu koneksi pulih.");
    }

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const packet = {
      id: requestId,
      type: "request",
      domain,
      action,
      payload,
    };

    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`Batas waktu permintaan (${domain}:${action}) habis setelah ${timeoutMs}ms.`));
      }, timeoutMs);

      this.pendingRequests.set(requestId, { resolve, reject, timer });

      try {
        this.conn.send(packet);
      } catch (err) {
        clearTimeout(timer);
        this.pendingRequests.delete(requestId);
        reject(err);
      }
    });
  }

  cleanupPeer() {
    for (const [id, req] of this.pendingRequests.entries()) {
      clearTimeout(req.timer);
      req.reject(new Error("Koneksi P2P ditutup."));
    }
    this.pendingRequests.clear();

    if (this.conn) {
      try {
        this.conn.close();
      } catch (e) {}
      this.conn = null;
    }
    if (this.peer) {
      try {
        this.peer.destroy();
      } catch (e) {}
      this.peer = null;
    }
  }

  disconnect() {
    this.isExplicitlyClosed = true;
    this.stopHeartbeat();
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    this.cleanupPeer();
    this.notifyStatus("DISCONNECTED", "Koneksi diputus.");
  }
}

export const remotePeerClient = new RemotePeerClient();
