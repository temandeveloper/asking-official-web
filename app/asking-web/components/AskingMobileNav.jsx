"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useAsking } from "../data/AskingContext";
import { useTranslation } from "../data/TranslationContext";
import { NAV_ITEMS } from "./AskingSidebar";
import {
  LayoutDashboard,
  MessageSquare,
  Tickets,
  Calendar,
  User,
  Sun,
  Moon,
  Languages,
} from "lucide-react";

export function AskingMobileHeader() {
  const { activeTab, theme, toggleTheme } = useAsking();
  const { language, toggleLanguage, t } = useTranslation();

  const activeNav = NAV_ITEMS.find((n) => n.id === activeTab) || NAV_ITEMS[0];

  return (
    <header className="lg:hidden h-14 bg-white dark:bg-[#0C1712] border-b border-[#DEE7DF] dark:border-[#1F382B] px-4 flex items-center justify-between shrink-0 select-none z-30 transition-colors duration-200">
      {/* Brand & Active Page Title */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-xl bg-transparent flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
          <img
            src="/logo.png"
            alt="AsKing Logo"
            className="w-full h-full object-contain"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-black text-[#11231B] dark:text-[#F2F7F4] tracking-tight">
            AsKing
          </span>
          <span className="text-[#8EA096] text-xs">/</span>
          <span className="text-xs font-bold text-[#184530] dark:text-[#B8F55C]">
            {t(`sidebar.nav_${activeNav.id}`) || activeNav.label}
          </span>
        </div>
      </div>

      {/* Right Controls: Language Toggle & Theme Toggle Side-by-Side */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={toggleLanguage}
          className="h-8 px-2.5 rounded-xl flex items-center justify-center gap-1 text-[11px] font-bold font-mono text-[#556A60] dark:text-[#A5B8AD] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] hover:text-[#11231B] dark:hover:text-[#F2F7F4] transition-all cursor-pointer border border-[#DEE7DF] dark:border-[#1F382B]"
          title={t("sidebar.toggle_language") || "Ganti Bahasa (ID/EN)"}
          aria-label={t("sidebar.toggle_language") || "Ganti Bahasa (ID/EN)"}
        >
          <Languages className="w-3.5 h-3.5 text-[#6B8075] dark:text-[#8EA096]" />
          <span>{language === "id" ? "ID" : "EN"}</span>
        </button>

        <button
          type="button"
          onClick={toggleTheme}
          className="w-8 h-8 rounded-xl flex items-center justify-center text-[#556A60] dark:text-[#A5B8AD] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] hover:text-[#11231B] dark:hover:text-[#F2F7F4] transition-all cursor-pointer border border-transparent hover:border-[#DEE7DF] dark:hover:border-[#1F382B]"
          title={theme === "light" ? t("sidebar.theme_dark") : t("sidebar.theme_light")}
          aria-label={t("sidebar.toggle_theme")}
        >
          {theme === "light" ? (
            <Sun className="w-4 h-4 text-amber-500" />
          ) : (
            <Moon className="w-4 h-4 text-[#B8F55C]" />
          )}
        </button>
      </div>
    </header>
  );
}

export function AskingMobileBottomNav() {
  const {
    activeTab,
    setActiveTab,
    conversations,
    tickets,
  } = useAsking();
  const { t } = useTranslation();

  const totalUnreadCount = useMemo(() => {
    return (conversations || []).reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  const activeTicketsCount = useMemo(() => {
    return (tickets || []).filter(
      (tkt) => tkt.status !== "Completed" && tkt.status !== "Cancelled"
    ).length;
  }, [tickets]);

  return (
    <nav className="dock dock-md lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-[#0C1712] border-t border-[#DEE7DF] dark:border-[#1F382B] shadow-lg pb-[env(safe-area-inset-bottom)] select-none">
      {/* 1. Dashboard */}
      <button
        type="button"
        onClick={() => setActiveTab("home")}
        className={`cursor-pointer transition-colors ${activeTab === "home"
            ? "dock-active text-[#184530] dark:text-[#B8F55C] font-bold"
            : "text-[#556A60] dark:text-[#A5B8AD] hover:text-[#11231B] dark:hover:text-[#F2F7F4]"
          }`}
      >
        <LayoutDashboard className="w-5 h-5" />
        <span className="dock-label text-[10px]">{t("mobile_nav.dashboard") || "Dashboard"}</span>
      </button>

      {/* 2. Messages */}
      <button
        type="button"
        onClick={() => setActiveTab("chat")}
        className={`cursor-pointer transition-colors relative ${activeTab === "chat"
            ? "dock-active text-[#184530] dark:text-[#B8F55C] font-bold"
            : "text-[#556A60] dark:text-[#A5B8AD] hover:text-[#11231B] dark:hover:text-[#F2F7F4]"
          }`}
      >
        <div className="relative">
          <MessageSquare className="w-5 h-5" />
        </div>
        <span className="dock-label text-[10px]">{t("mobile_nav.messages") || "Messages"}</span>
      </button>

      {/* 3. Tickets */}
      <button
        type="button"
        onClick={() => setActiveTab("tickets")}
        className={`cursor-pointer transition-colors relative ${activeTab === "tickets"
            ? "dock-active text-[#184530] dark:text-[#B8F55C] font-bold"
            : "text-[#556A60] dark:text-[#A5B8AD] hover:text-[#11231B] dark:hover:text-[#F2F7F4]"
          }`}
      >
        <div className="relative">
          <Tickets className="w-5 h-5" />
        </div>
        <span className="dock-label text-[10px]">{t("mobile_nav.tickets") || "Tickets"}</span>
      </button>

      {/* 4. Scheduler */}
      <button
        type="button"
        onClick={() => setActiveTab("scheduler")}
        className={`cursor-pointer transition-colors ${activeTab === "scheduler"
            ? "dock-active text-[#184530] dark:text-[#B8F55C] font-bold"
            : "text-[#556A60] dark:text-[#A5B8AD] hover:text-[#11231B] dark:hover:text-[#F2F7F4]"
          }`}
      >
        <Calendar className="w-5 h-5" />
        <span className="dock-label text-[10px]">{t("mobile_nav.scheduler") || "Scheduler"}</span>
      </button>

      {/* 5. Kembali ke Profile */}
      <Link
        href="/profile"
        className="flex flex-col items-center justify-center cursor-pointer transition-colors text-[#556A60] dark:text-[#A5B8AD] hover:text-[#184530] dark:hover:text-[#B8F55C]"
        title={t("mobile_nav.profile") || "Kembali ke Profile"}
      >
        <User className="w-5 h-5" />
        <span className="dock-label text-[10px]">{t("mobile_nav.profile") || "Profile"}</span>
      </Link>
    </nav>
  );
}

export function AskingMobileDrawerMenu() {
  return null;
}
