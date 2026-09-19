"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "./TranslationContext";
import { remotePeerClient } from "../services/remotePeerClient";

const AskingContext = createContext(null);

export function AskingProvider({ children, shareCode = "", userSession = null }) {
  const { t } = useTranslation();

  // 1. Navigation & Theme
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'chat' | 'tickets' | ...
  const [theme, setTheme] = useState("light");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Sync theme to root element for daisyUI and Tailwind v4 dark variant
  const applyThemeToDOM = (themeMode) => {
    if (typeof document === "undefined") return;
    const isDark = themeMode === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  };

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("asking_web_theme") : null;
    const initialTheme = saved === "dark" || saved === "light" ? saved : "light";
    setTheme(initialTheme);
    applyThemeToDOM(initialTheme);
  }, []);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("asking_web_theme", next);
      }
      return next;
    });
  }, []);

  // 2. User Profile & System State
  const [userProfile, setUserProfile] = useState({
    name: userSession?.user?.user_metadata?.full_name || userSession?.user?.email?.split("@")[0] || "Operator",
    email: userSession?.user?.email || "",
    role: "Support Specialist",
    avatar: userSession?.user?.user_metadata?.avatar_url || null,
    plan: "Pro Business (Remote)",
  });

  const [connectionStatus, setConnectionStatus] = useState("CONNECTING");
  const [connectionMessage, setConnectionMessage] = useState("");
  const [reconnectAttempt, setReconnectAttempt] = useState(0);
  const [hasInitialDataLoaded, setHasInitialDataLoaded] = useState(false);
  const [isRemoteLoading, setIsRemoteLoading] = useState(true);

  const [dashboardStats, setDashboardStats] = useState({
    totalTickets: 0,
    activeTickets: 0,
    totalConversations: 0,
    unreadMessages: 0,
    pendingSchedules: 0,
    recentTickets: [],
  });

  const [dueTodayList, setDueTodayList] = useState([]);
  const [dueTomorrowList, setDueTomorrowList] = useState([]);

  const [schedules, setSchedules] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [filterScheduleStatus, setFilterScheduleStatus] = useState("all");
  const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // 3. Toasts Notification
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // 4. Remote Fetching Functions
  const fetchDashboardOverview = useCallback(async () => {
    try {
      const data = await remotePeerClient.sendRequest("dashboard", "get-overview");
      if (data) setDashboardStats(data);
    } catch (err) {
      console.warn("[AskingContext] fetchDashboardOverview warning:", err.message);
    }
  }, []);

  const fetchDueTickets = useCallback(async () => {
    try {
      const data = await remotePeerClient.sendRequest("sidebar", "get-due-tickets");
      if (data) {
        setDueTodayList(data.dueTodayList || []);
        setDueTomorrowList(data.dueTomorrowList || []);
      }
    } catch (err) {
      console.warn("[AskingContext] fetchDueTickets warning:", err.message);
    }
  }, []);

  const [conversations, setConversations] = useState([]);
  const [activeJid, setActiveJidState] = useState("");
  const [searchConversationQuery, setSearchConversationQuery] = useState("");
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [isMobileChatActive, setIsMobileChatActive] = useState(false);

  const activeJidRef = React.useRef(activeJid);
  useEffect(() => {
    activeJidRef.current = activeJid;
  }, [activeJid]);

  const fetchConversations = useCallback(async () => {
    try {
      const list = await remotePeerClient.sendRequest("messages", "list-conversations");
      if (Array.isArray(list)) {
        // Ensure conversation list order strictly matches Desktop: most recent first
        const sortedList = [...list].sort((a, b) => {
          const timeA = typeof a.timestamp === "number" ? a.timestamp : new Date(a.timestamp || a.lastMessageTime || 0).getTime();
          const timeB = typeof b.timestamp === "number" ? b.timestamp : new Date(b.timestamp || b.lastMessageTime || 0).getTime();
          return timeB - timeA;
        });

        setConversations((prev) => {
          const prevMsgMap = new Map();
          for (const c of prev) {
            if (c.messages && c.messages.length > 0) {
              prevMsgMap.set(c.jid, c.messages);
            }
          }
          return sortedList.map((c) => ({
            ...c,
            messages: prevMsgMap.get(c.jid) || c.messages || [],
          }));
        });
        setActiveJidState((prev) => {
          if (!prev && sortedList.length > 0) {
            return sortedList[0].jid;
          }
          return prev;
        });
      }
    } catch (err) {
      console.warn("[AskingContext] fetchConversations warning:", err.message);
    }
  }, []);

  const fetchChatHistory = useCallback(async (jid) => {
    if (!jid) return;
    try {
      const msgs = await remotePeerClient.sendRequest("messages", "get-chat-history", { jid });
      if (Array.isArray(msgs)) {
        // Ensure messages stream strictly matches Desktop: chronological order (oldest at top, newest at bottom)
        const sortedMsgs = [...msgs].sort((a, b) => {
          const timeA = typeof a.timestamp === "number" ? a.timestamp : new Date(a.timestamp || 0).getTime();
          const timeB = typeof b.timestamp === "number" ? b.timestamp : new Date(b.timestamp || 0).getTime();
          return timeA - timeB;
        });

        setConversations((prev) =>
          prev.map((c) => (c.jid === jid ? { ...c, messages: sortedMsgs } : c))
        );
      }
    } catch (err) {
      console.warn("[AskingContext] fetchChatHistory warning:", err.message);
    }
  }, []);

  // Fetch chat history whenever activeJid changes
  useEffect(() => {
    if (activeJid && remotePeerClient.status === "CONNECTED") {
      fetchChatHistory(activeJid);
    }
  }, [activeJid, fetchChatHistory]);

  const [tickets, setTickets] = useState([]);
  const fetchTickets = useCallback(async () => {
    try {
      const list = await remotePeerClient.sendRequest("tickets", "list");
      if (Array.isArray(list)) setTickets(list);
    } catch (err) {
      console.warn("[AskingContext] fetchTickets warning:", err.message);
    }
  }, []);

  const fetchSchedules = useCallback(async () => {
    try {
      const list = await remotePeerClient.sendRequest("scheduler", "list");
      if (Array.isArray(list)) setSchedules(list);
    } catch (err) {
      console.warn("[AskingContext] fetchSchedules warning:", err.message);
    }
  }, []);

  const fetchTemplates = useCallback(async () => {
    try {
      const list = await remotePeerClient.sendRequest("templates", "list");
      if (Array.isArray(list)) setTemplates(list);
    } catch (err) {
      console.warn("[AskingContext] fetchTemplates warning:", err.message);
    }
  }, []);

  const [contacts, setContacts] = useState([]);
  const fetchContacts = useCallback(async () => {
    try {
      const list = await remotePeerClient.sendRequest("contacts", "list");
      if (Array.isArray(list)) setContacts(list);
    } catch (err) {
      console.warn("[AskingContext] fetchContacts warning:", err.message);
    }
  }, []);

  // 5. Connect Remote Peer & Lifecycle Listeners
  // Note: Only reconnects when credentials change; tab switching and active conversation changes NEVER tear down connection!
  useEffect(() => {
    if (!shareCode || !userSession?.user?.email) return;

    remotePeerClient.connect(shareCode, userSession.user.email, userSession.access_token);

    const unsubStatus = remotePeerClient.onStatusChange(async (info) => {
      setConnectionStatus(info.status);
      setConnectionMessage(info.message || "");
      setReconnectAttempt(info.attempt || 0);

      if (info.status === "CONNECTED") {
        setIsRemoteLoading(true);
        try {
          await Promise.allSettled([
            fetchDashboardOverview(),
            fetchDueTickets(),
            fetchConversations(),
            fetchTickets(),
            fetchSchedules(),
            fetchTemplates(),
            fetchContacts(),
          ]);
          setHasInitialDataLoaded(true);
        } finally {
          setIsRemoteLoading(false);
        }
      } else if (info.status === "OFFLINE" || info.status === "UNAUTHORIZED") {
        setIsRemoteLoading(false);
      }
    });

    const unsubSignal = remotePeerClient.onSignal(async (signal) => {
      console.log("[AskingContext] Received invalidation signal from Desktop:", signal);
      if (signal.scope === "messages") {
        await fetchConversations();
        if (activeJidRef.current) {
          await fetchChatHistory(activeJidRef.current);
        }
        await fetchDashboardOverview();
      } else if (signal.scope === "tickets") {
        await fetchTickets();
        await fetchDueTickets();
        await fetchDashboardOverview();
      } else if (signal.scope === "scheduler") {
        await fetchSchedules();
        await fetchDashboardOverview();
      } else if (signal.scope === "contacts") {
        await fetchContacts();
      }
    });

    const unsubReconnect = remotePeerClient.onReconnectSuccess(() => {
      fetchDashboardOverview();
      fetchDueTickets();
      fetchConversations();
      fetchTickets();
      fetchSchedules();
      fetchTemplates();
      fetchContacts();
    });

    return () => {
      unsubStatus();
      unsubSignal();
      unsubReconnect();
      remotePeerClient.disconnect();
    };
  }, [
    shareCode,
    userSession?.user?.email,
    userSession?.access_token,
    fetchDashboardOverview,
    fetchDueTickets,
    fetchConversations,
    fetchChatHistory,
    fetchTickets,
    fetchSchedules,
    fetchTemplates,
    fetchContacts,
  ]);

  // Refetch when switching tabs (silent update without disconnecting or showing full overlay)
  useEffect(() => {
    if (remotePeerClient.status !== "CONNECTED") return;

    if (activeTab === "home") {
      fetchDashboardOverview();
      fetchDueTickets();
      fetchTickets();
      fetchSchedules();
      fetchConversations();
    } else if (activeTab === "chat") {
      fetchConversations();
    } else if (activeTab === "tickets") {
      fetchTickets();
      fetchDueTickets();
    } else if (activeTab === "scheduler") {
      fetchSchedules();
    } else if (activeTab === "templates") {
      fetchTemplates();
    }
  }, [activeTab, fetchDashboardOverview, fetchDueTickets, fetchConversations, fetchTickets, fetchSchedules, fetchTemplates]);

  // Set active JID and clear unread count
  const setActiveJid = useCallback((jid) => {
    setActiveJidState(jid);
    if (jid) {
      fetchChatHistory(jid);
      remotePeerClient.sendRequest("messages", "mark-as-read", { jid }).catch(() => {});
    }
  }, [fetchChatHistory]);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.jid === activeJid) || conversations[0];
  }, [conversations, activeJid]);

  // Send message through Desktop
  const sendMessage = useCallback(
    async (text, attachments = [], replyTo = null, extra = {}) => {
      if (!text?.trim() && attachments.length === 0) return;

      const targetJid = activeJid;
      const optimisticMsg = {
        id: "msg_out_" + Date.now(),
        text: text.trim(),
        timestamp: Date.now(),
        fromMe: true,
        status: "sending",
        attach: attachments[0] || null,
        replyTo: replyTo || undefined,
        ...extra,
      };

      setConversations((prev) =>
        prev.map((c) => {
          if (c.jid !== targetJid) return c;
          return {
            ...c,
            lastMessage: text.trim() || (attachments[0]?.name ? `Lampiran: ${attachments[0].name}` : "Pesan dikirim"),
            lastMessageTime: new Date().toISOString(),
            lastMessageFromMe: true,
            messages: [...(c.messages || []), optimisticMsg],
          };
        })
      );

      setReplyingToMessage(null);

      try {
        await remotePeerClient.sendRequest("messages", "send-message", {
          jid: targetJid,
          text: text.trim(),
          attach: attachments[0] || null,
          quotedMsgId: replyTo?.id,
          quotedMsgText: replyTo?.text,
          channel: extra.channel || "whatsapp",
        });
        await fetchChatHistory(targetJid);
      } catch (err) {
        addToast(err.message || "Gagal mengirim pesan melalui AsKing Desktop.", "error");
      }
    },
    [activeJid, addToast, fetchChatHistory]
  );

  const toggleConversationHumanSupport = useCallback((jid) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.jid !== jid) return c;
        const next = !c.isHumanSupport;
        addToast(
          next
            ? t("common.toast_human_support_active")
            : t("common.toast_ai_agent_active"),
          "info"
        );
        return { ...c, isHumanSupport: next };
      })
    );
  }, [addToast, t]);

  const deleteConversation = useCallback(
    async (jid) => {
      try {
        await remotePeerClient.sendRequest("messages", "delete-conversation", { jid });
        setConversations((prev) => {
          const next = prev.filter((c) => c.jid !== jid);
          if (activeJid === jid) {
            setActiveJidState(next[0]?.jid || "");
          }
          return next;
        });
        addToast(t("common.toast_chat_deleted"), "warning");
      } catch (err) {
        addToast(err.message || "Gagal menghapus percakapan.", "error");
      }
    },
    [activeJid, addToast, t]
  );

  // New Chat Modal State & Action
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const startNewChat = useCallback(
    async ({ phone, email, name, channel = "whatsapp", jid }) => {
      try {
        const res = await remotePeerClient.sendRequest("messages", "start-new-chat", {
          phone,
          email,
          name,
          channel,
          jid,
        });
        const targetJid = res?.jid || jid || (channel === "email" ? `email:${email || phone}` : phone);
        await fetchConversations();
        setActiveJid(targetJid);
        setIsNewChatModalOpen(false);
        setActiveTab("chat");
        addToast(t("common.toast_chat_created", { name: name || targetJid }), "success");
      } catch (err) {
        console.error("[AskingContext] startNewChat error:", err);
        addToast(err.message || "Gagal memulai obrolan baru.", "error");
      }
    },
    [fetchConversations, setActiveJid, setActiveTab, addToast, t]
  );

  // 6. Scheduler Automation Handlers (routed through Desktop)
  const addScheduledMessage = useCallback(
    async (newSchedule) => {
      try {
        await remotePeerClient.sendRequest("scheduler", "create", newSchedule);
        addToast(t("common.toast_schedule_created"), "success");
        await fetchSchedules();
      } catch (err) {
        addToast(err.message || "Gagal membuat pesan terjadwal.", "error");
      } finally {
        setIsNewScheduleModalOpen(false);
        setEditingSchedule(null);
      }
    },
    [addToast, fetchSchedules, t]
  );

  const updateScheduledMessage = useCallback(
    async (id, updates) => {
      try {
        await remotePeerClient.sendRequest("scheduler", "update", { id, updates });
        addToast(t("common.toast_schedule_updated"), "success");
        await fetchSchedules();
      } catch (err) {
        addToast(err.message || "Gagal memperbarui jadwal.", "error");
      } finally {
        setIsNewScheduleModalOpen(false);
        setEditingSchedule(null);
      }
    },
    [addToast, fetchSchedules, t]
  );

  const deleteScheduledMessage = useCallback(
    async (id) => {
      try {
        await remotePeerClient.sendRequest("scheduler", "delete", { id });
        addToast(t("common.toast_schedule_deleted"), "info");
        await fetchSchedules();
      } catch (err) {
        addToast(err.message || "Gagal menghapus jadwal.", "error");
      }
    },
    [addToast, fetchSchedules, t]
  );

  const dispatchScheduledItem = useCallback(
    (item) => {
      addToast(t("common.toast_schedule_sending"), "info");
      // Simulated trigger
    },
    [addToast, t]
  );

  // 7. CRM Tickets Management (routed through Desktop)
  const [ticketSearchQuery, setTicketSearchQuery] = useState("");
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState("all");
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState("all");
  const [ticketStatusFilter, setTicketStatusFilter] = useState("all");
  const [ticketDateFilter, setTicketDateFilter] = useState("all");
  const [ticketDeadlineFilter, setTicketDeadlineFilter] = useState("all");
  const [ticketViewMode, setTicketViewMode] = useState("table");

  // Modals & Drawer State
  const [isTicketDrawerOpen, setIsTicketDrawerOpen] = useState(false);
  const [ticketDrawerMode, setTicketDrawerMode] = useState("create");
  const [editingTicket, setEditingTicket] = useState(null);
  const [isQuickTicketModalOpen, setIsQuickTicketModalOpen] = useState(false);
  const [quickTicketInitialData, setQuickTicketInitialData] = useState(null);

  const updateTicketStatus = useCallback(
    async (ticketId, newStatus) => {
      try {
        await remotePeerClient.sendRequest("tickets", "update", {
          id: ticketId,
          updates: { status: newStatus },
        });
        addToast(t("common.toast_ticket_status_updated", { ticketId, newStatus }), "success");
        await fetchTickets();
        await fetchDueTickets();
      } catch (err) {
        addToast(err.message || "Gagal memperbarui status tiket.", "error");
      }
    },
    [addToast, fetchTickets, fetchDueTickets, t]
  );

  const getNextTicketId = useCallback(async () => {
    try {
      return await remotePeerClient.sendRequest("tickets", "get-next-id");
    } catch (err) {
      console.warn("[AskingContext] getNextTicketId warning:", err.message);
      return null;
    }
  }, []);

  const saveTicket = useCallback(
    async (ticketData, isEditing = false) => {
      try {
        if (isEditing && ticketData.id) {
          await remotePeerClient.sendRequest("tickets", "update", {
            id: ticketData.id,
            updates: ticketData,
          });
          addToast(t("common.toast_ticket_updated", { id: ticketData.id }), "success");
        } else {
          const res = await remotePeerClient.sendRequest("tickets", "create", ticketData);
          addToast(t("common.toast_ticket_created", { id: res?.id || ticketData.id || "Baru" }), "success");
        }
        await fetchTickets();
        await fetchDueTickets();
      } catch (err) {
        addToast(err.message || "Gagal menyimpan tiket di desktop.", "error");
      } finally {
        setIsTicketDrawerOpen(false);
        setEditingTicket(null);
      }
    },
    [addToast, fetchTickets, fetchDueTickets, t]
  );

  const appendTicketNote = useCallback(
    async (ticketId, noteText) => {
      if (!noteText.trim()) return;
      try {
        const current = tickets.find((t) => t.id === ticketId);
        const existingActivity = current?.activity || [];
        const updatedActivity = [
          ...existingActivity,
          {
            type: "note",
            description: noteText.trim(),
            timestamp: Date.now(),
          },
        ];
        await remotePeerClient.sendRequest("tickets", "update", {
          id: ticketId,
          updates: { activity: updatedActivity },
        });
        addToast(t("common.toast_ticket_note_added"), "success");
        await fetchTickets();
      } catch (err) {
        addToast(err.message || "Gagal menambahkan catatan.", "error");
      }
    },
    [tickets, addToast, fetchTickets, t]
  );

  const deleteTicket = useCallback(
    async (ticketId) => {
      try {
        await remotePeerClient.sendRequest("tickets", "delete", { id: ticketId });
        addToast(t("common.toast_ticket_deleted", { id: ticketId }), "warning");
        await fetchTickets();
        await fetchDueTickets();
      } catch (err) {
        addToast(err.message || "Gagal menghapus tiket.", "error");
      } finally {
        setIsTicketDrawerOpen(false);
        setEditingTicket(null);
      }
    },
    [addToast, fetchTickets, fetchDueTickets, t]
  );

  const handleOpenCreateTicket = useCallback((initialProps = {}) => {
    setEditingTicket(null);
    setTicketDrawerMode("create");
    setQuickTicketInitialData(initialProps);
    setIsTicketDrawerOpen(true);
  }, []);

  const handleOpenEditTicket = useCallback((ticket) => {
    setEditingTicket(ticket);
    setTicketDrawerMode("edit");
    setIsTicketDrawerOpen(true);
  }, []);

  const handleOpenReadOnlyTicket = useCallback((ticket) => {
    setEditingTicket(ticket);
    setTicketDrawerMode("readonly");
    setIsTicketDrawerOpen(true);
  }, []);

  const handleQuickCreateTicketFromChat = useCallback((chatContact, lastMsgText) => {
    handleOpenCreateTicket({
      title: `Follow up: ${lastMsgText ? lastMsgText.substring(0, 50) + "..." : "Kendala Pelanggan"}`,
      contactName: chatContact.name,
      contactPhone: chatContact.phone,
      contactEmail: chatContact.email,
      channel: chatContact.channel,
      description: lastMsgText || "Dibuat langsung dari percakapan pelanggan.",
      priority: "high",
      status: "New",
      category: "support",
      deadline: new Date().toISOString().split("T")[0],
    });
  }, [handleOpenCreateTicket]);

  const value = {
    // Nav & Theme
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    mobileNavOpen,
    setMobileNavOpen,
    userProfile,
    setUserProfile,

    // Remote Connection & Loading State
    connectionStatus,
    connectionMessage,
    reconnectAttempt,
    hasInitialDataLoaded,
    isRemoteLoading,
    dashboardStats,
    dueTodayList,
    dueTomorrowList,
    fetchTickets,
    fetchConversations,
    fetchChatHistory,
    fetchDueTickets,
    fetchDashboardOverview,
    fetchSchedules,
    fetchTemplates,
    fetchContacts,
    contacts,
    setContacts,

    // Schedules
    schedules,
    setSchedules,
    filterScheduleStatus,
    setFilterScheduleStatus,
    isNewScheduleModalOpen,
    setIsNewScheduleModalOpen,
    editingSchedule,
    setEditingSchedule,
    addScheduledMessage,
    updateScheduledMessage,
    deleteScheduledMessage,
    dispatchScheduledItem,
    templates,

    // Toasts
    toasts,
    addToast,
    removeToast,

    // Conversations & Messages
    conversations,
    activeJid,
    setActiveJid,
    activeConversation,
    searchConversationQuery,
    setSearchConversationQuery,
    filterUnreadOnly,
    setFilterUnreadOnly,
    sendMessage,
    replyingToMessage,
    setReplyingToMessage,
    toggleConversationHumanSupport,
    deleteConversation,
    isNewChatModalOpen,
    setIsNewChatModalOpen,
    startNewChat,
    isMobileChatActive,
    setIsMobileChatActive,

    // Tickets
    tickets,
    ticketFilters: {
      search: ticketSearchQuery,
      category: ticketCategoryFilter,
      priority: ticketPriorityFilter,
      status: ticketStatusFilter,
      date: ticketDateFilter,
      deadline: ticketDeadlineFilter,
    },
    setTicketSearchQuery,
    setTicketCategoryFilter,
    setTicketPriorityFilter,
    setTicketStatusFilter,
    setTicketDateFilter,
    setTicketDeadlineFilter,
    ticketViewMode,
    setTicketViewMode,
    updateTicketStatus,
    saveTicket,
    deleteTicket,
    isTicketDrawerOpen,
    setIsTicketDrawerOpen,
    ticketDrawerMode,
    setTicketDrawerMode,
    editingTicket,
    handleOpenCreateTicket,
    handleOpenEditTicket,
    handleOpenReadOnlyTicket,
    appendTicketNote,
    getNextTicketId,
    handleQuickCreateTicketFromChat,
    quickTicketInitialData,
  };

  return <AskingContext.Provider value={value}>{children}</AskingContext.Provider>;
}

export function useAsking() {
  const context = useContext(AskingContext);
  if (!context) {
    throw new Error("useAsking must be used within an AskingProvider");
  }
  return context;
}
