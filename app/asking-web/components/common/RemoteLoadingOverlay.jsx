"use client";

import React from "react";
import Link from "next/link";
import { useAsking } from "../../data/AskingContext";
import { useTranslation } from "../../data/TranslationContext";
import { Loader2, RefreshCw, WifiOff, ShieldAlert, RotateCcw } from "lucide-react";

export default function RemoteLoadingOverlay() {
  const {
    connectionStatus,
    connectionMessage,
    reconnectAttempt,
    hasInitialDataLoaded,
  } = useAsking();
  const { t } = useTranslation();

  // If initial data is fully loaded and we are currently connected, hide overlay completely
  if (hasInitialDataLoaded && connectionStatus === "CONNECTED") {
    return null;
  }

  // Determine state configuration
  let icon = null;
  let title = "";
  let subtitle = "";
  let actionBtn = null;
  let badgeColor = "border-emerald-500/20";

  switch (connectionStatus) {
    case "RECONNECTING":
      badgeColor = "border-amber-500/30";
      icon = <RefreshCw className="w-8 h-8 animate-spin text-amber-500" />;
      title = t("network.reconnecting_title") || "Koneksi Terputus, Menyambung Ulang...";
      subtitle =
        reconnectAttempt > 0
          ? `Mencoba menghubungkan kembali ke AsKing Desktop (Percobaan ${reconnectAttempt}/5)...`
          : "Sedang mencoba menyambung kembali ke AsKing Desktop...";
      break;

    case "OFFLINE":
      badgeColor = "border-rose-500/30";
      icon = <WifiOff className="w-8 h-8 text-rose-500" />;
      title = t("network.offline_title") || "AsKing Desktop Sedang Offline";
      subtitle =
        connectionMessage ||
        "Tidak dapat terhubung ke desktop. Pastikan aplikasi AsKing Desktop sedang terbuka dan fitur AsKing Collaboration dalam keadaan aktif.";
      actionBtn = (
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#12281F] text-[#B8F55C] dark:bg-[#18362B] dark:text-[#B8F55C] text-xs font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Muat Ulang Halaman</span>
        </button>
      );
      break;

    case "UNAUTHORIZED":
      badgeColor = "border-rose-500/30";
      icon = <ShieldAlert className="w-8 h-8 text-rose-500" />;
      title = t("network.unauthorized_title") || "Akses Kolaborasi Ditolak";
      subtitle =
        connectionMessage ||
        "Email akun Anda belum terdaftar dalam Whitelist AsKing Collaboration di AsKing Desktop. Silakan hubungi host untuk mendaftarkan email Anda.";
      actionBtn = (
        <Link
          href="/profile"
          className="flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-xl bg-[#12281F] text-[#B8F55C] dark:bg-[#18362B] dark:text-[#B8F55C] text-xs font-bold hover:opacity-90 active:scale-95 transition-all cursor-pointer shadow-xs"
        >
          <span>Kembali ke Profil</span>
        </Link>
      );
      break;

    case "CONNECTING":
    case "CONNECTED":
    default:
      badgeColor = "border-[#184530]/30 dark:border-[#B8F55C]/30";
      icon = (
        <div className="relative flex items-center justify-center">
          <span className="animate-ping absolute inline-flex h-10 w-10 rounded-full bg-[#B8F55C] opacity-40"></span>
          <Loader2 className="w-8 h-8 animate-spin text-[#184530] dark:text-[#B8F55C] relative" />
        </div>
      );
      title = t("network.connecting_overlay_title") || "Menghubungkan ke AsKing Desktop...";
      subtitle =
        t("network.connecting_overlay_sub") ||
        "Membuka saluran P2P WebRTC terenkripsi dan menyinkronkan data...";
      break;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md p-4 animate-in fade-in duration-200 select-none">
      <div
        className={`bg-white dark:bg-[#12241C] border ${badgeColor} rounded-3xl p-8 max-w-sm w-full mx-auto text-center space-y-4 shadow-2xl relative overflow-hidden`}
      >
        {/* Top Logo / Brand Header */}
        <div className="flex items-center justify-center gap-2 pb-2 border-b border-[#EEF3EF] dark:border-[#1F382B]">
          <div className="w-6 h-6 rounded-lg overflow-hidden shrink-0">
            <img src="/logo.png" alt="AsKing" className="w-full h-full object-contain" />
          </div>
          <span className="text-xs font-black tracking-tight text-[#11231B] dark:text-[#F2F7F4]">
            AsKing Web
          </span>
          <span className="text-[10px] text-[#6B8075] dark:text-[#8EA096] bg-[#EBF1EB] dark:bg-[#18362B] px-1.5 py-0.5 rounded font-mono">
            P2P
          </span>
        </div>

        {/* Center Animated Icon */}
        <div className="flex justify-center py-2">{icon}</div>

        {/* Text Details */}
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-[#11231B] dark:text-[#F2F7F4] leading-snug">
            {title}
          </h3>
          <p className="text-xs text-[#556A60] dark:text-[#A5B8AD] leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Optional Action Button */}
        {actionBtn && <div className="pt-2">{actionBtn}</div>}
      </div>
    </div>
  );
}
