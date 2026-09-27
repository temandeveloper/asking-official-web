"use client";

import React, { useState, useEffect, useRef } from "react";
import {
  Wifi,
  WifiOff,
  RefreshCw,
  Loader2,
  ShieldAlert,
  Info,
  ChevronDown,
  X,
} from "lucide-react";
import { remotePeerClient } from "../services/remotePeerClient";
import { useTranslation } from "../data/TranslationContext";

export default function NetworkStatusIndicator() {
  const { t } = useTranslation();
  const [networkInfo, setNetworkInfo] = useState({
    status: remotePeerClient.status,
    message: remotePeerClient.statusMessage,
    latency: remotePeerClient.latency,
    attempt: remotePeerClient.reconnectAttempt,
  });

  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popoverRef = useRef(null);

  useEffect(() => {
    const unsub = remotePeerClient.onStatusChange((info) => {
      setNetworkInfo(info);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsPopoverOpen(false);
      }
    }
    if (isPopoverOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isPopoverOpen]);

  const { status, latency, attempt, message } = networkInfo;

  // Render Pill according to status
  let badgeClasses = "";
  let icon = null;
  let text = "";

  switch (status) {
    case "CONNECTED":
      badgeClasses =
        "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-[#B8F55C] border border-emerald-200 dark:border-emerald-800/40";
      icon = (
        <span className="flex h-2 w-2 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
        </span>
      );
      text = latency > 0 ? (t("network.connected_latency", { latency }) || `P2P ${latency}ms`) : (t("network.connected") || "P2P Terhubung");
      break;

    case "CONNECTING":
      badgeClasses =
        "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800/40";
      icon = <Loader2 className="w-3 h-3 animate-spin text-amber-600 dark:text-amber-400" />;
      text = t("network.connecting") || "Menghubungkan...";
      break;

    case "RECONNECTING":
      badgeClasses =
        "bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 border border-orange-200 dark:border-orange-800/40";
      icon = <RefreshCw className="w-3 h-3 animate-spin text-orange-600 dark:text-orange-400" />;
      text = attempt > 0 ? (t("network.reconnecting", { attempt }) || `Menyambung Ulang (${attempt}/5)`) : (t("network.reconnecting_default") || "Menyambung Ulang...");
      break;

    case "UNAUTHORIZED":
      badgeClasses =
        "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40";
      icon = <ShieldAlert className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      text = t("network.unauthorized") || "Akses Ditolak";
      break;

    case "OFFLINE":
    default:
      badgeClasses =
        "bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800/40";
      icon = <WifiOff className="w-3.5 h-3.5 text-rose-600 dark:text-rose-400" />;
      text = t("network.offline") || "Desktop Offline";
      break;
  }

  return (
    <div className="relative inline-block text-left" ref={popoverRef}>
      <button
        type="button"
        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
        className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-all cursor-pointer select-none shadow-2xs ${badgeClasses}`}
        title="WebRTC P2P Status"
      >
        {icon}
        <span className="font-mono">{text}</span>
        <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
      </button>

      {/* Popover Card */}
      {isPopoverOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] rounded-2xl shadow-xl p-4 z-50 text-xs space-y-3 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between pb-2 border-b border-[#DEE7DF] dark:border-[#1F382B]">
            <div className="flex items-center gap-2">
              <Wifi className="w-4 h-4 text-[#184530] dark:text-[#B8F55C]" />
              <span className="font-bold text-[#11231B] dark:text-[#F2F7F4]">
                {t("network.p2p_title") || "Status Konektivitas P2P"}
              </span>
            </div>
            <button
              type="button"
              onClick={() => setIsPopoverOpen(false)}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#6B8075] dark:text-[#8EA096]">{t("network.status_label") || "Status:"}</span>
              <span className="font-semibold text-[#11231B] dark:text-[#F2F7F4]">
                {status}
              </span>
            </div>

            {status === "CONNECTED" && (
              <div className="flex justify-between items-center text-[11px]">
                <span className="text-[#6B8075] dark:text-[#8EA096]">{t("network.latency_label") || "Latensi RTT:"}</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-[#B8F55C]">
                  {latency} ms
                </span>
              </div>
            )}

            <div className="flex justify-between items-center text-[11px]">
              <span className="text-[#6B8075] dark:text-[#8EA096]">{t("network.target_host") || "Target Host:"}</span>
              <span className="font-mono text-[10px] text-[#11231B] dark:text-[#F2F7F4] truncate max-w-[140px]">
                {remotePeerClient.desktopPeerId || "-"}
              </span>
            </div>

            {message && (
              <p className="text-[11px] text-[#556A60] dark:text-[#A5B8AD] bg-[#F8FAF7] dark:bg-[#0C1712] p-2 rounded-xl border border-[#DEE7DF] dark:border-[#1F382B]">
                {message}
              </p>
            )}
          </div>

          {/* Professional Network Note */}
          <div className="pt-2 border-t border-[#DEE7DF] dark:border-[#1F382B] flex items-start gap-2 text-[10px] text-[#6B8075] dark:text-[#8EA096] leading-relaxed">
            <Info className="w-3.5 h-3.5 shrink-0 mt-0.5" />
            <span>
              {t("network.disclaimer") || "Koneksi ini terenkripsi langsung (P2P). Jika sambungan terhambat, pastikan firewall jaringan Anda mengizinkan sambungan WebRTC atau beralih ke jaringan lain."}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
