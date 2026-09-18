"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { useAsking } from "../data/AskingContext";
import { useTranslation } from "../data/TranslationContext";
import ContactAvatar from "./shared/ContactAvatar";
import {
  Home,
  MessageSquare,
  Tickets,
  Calendar,
  FileText,
  Users,
  Radio,
  BrainCircuit,
  Globe,
  DatabaseBackup,
  Settings,
  Sun,
  Moon,
  ExternalLink,
  ChevronRight,
  User,
  Languages,
} from "lucide-react";

export const NAV_ITEMS = [
  { id: "home", label: "Dashboard", icon: Home, badge: null },
  { id: "chat", label: "Messages", icon: MessageSquare, badge: "unread" },
  { id: "tickets", label: "Tickets", icon: Tickets, badge: "tickets" },
  { id: "scheduler", label: "Scheduler", icon: Calendar, badge: null },
];

export default function AskingSidebar() {
  const {
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    conversations,
    tickets,
    userProfile,
    handleOpenReadOnlyTicket,
  } = useAsking();
  const { language, toggleLanguage, t } = useTranslation();

  // Calculate live counts
  const totalUnreadCount = useMemo(() => {
    return (conversations || []).reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  const activeTicketsCount = useMemo(() => {
    return (tickets || []).filter(
      (tkt) => tkt.status !== "Completed" && tkt.status !== "Cancelled"
    ).length;
  }, [tickets]);

  // Due Today and Due Tomorrow tickets for the sidebar tracker
  const { dueTodayTickets, dueTomorrowTickets } = useMemo(() => {
    const todayStr = new Date().toISOString().split("T")[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split("T")[0];

    const active = (tickets || []).filter(
      (tkt) => tkt.status !== "Completed" && tkt.status !== "Cancelled" && tkt.deadline
    );

    return {
      dueTodayTickets: active.filter((tkt) => tkt.deadline.startsWith(todayStr)),
      dueTomorrowTickets: active.filter((tkt) => tkt.deadline.startsWith(tomorrowStr)),
    };
  }, [tickets]);

  return (
    <aside className="w-64 h-full bg-white dark:bg-[#0C1712] border-r border-[#DEE7DF] dark:border-[#1F382B] flex flex-col justify-between shrink-0 select-none transition-colors duration-200">
      {/* Top Header: Brand & App Name with Theme Toggle */}
      <div className="p-4 space-y-4 overflow-y-auto flex-1 scrollbar-thin-subtle">
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-transparent flex items-center justify-center shrink-0 overflow-hidden shadow-2xs">
              <img
                src="/logo.png"
                alt="AsKing Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <div>
              <h1 className="text-sm font-black text-[#11231B] dark:text-[#F2F7F4] leading-none tracking-tight">
                AsKing
              </h1>
              <p className="text-[11px] text-[#556A60] dark:text-[#A5B8AD] mt-0.5 font-medium">
                Customer Manager
              </p>
            </div>
          </div>

          {/* Theme Toggle Button next to Brand Logo */}
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

        {/* Navigation Items */}
        <nav className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            let badgeValue = null;
            if (item.badge === "unread" && totalUnreadCount > 0) {
              badgeValue = totalUnreadCount;
            } else if (item.badge === "tickets" && activeTicketsCount > 0) {
              badgeValue = activeTicketsCount;
            }

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all text-left cursor-pointer group ${isActive
                  ? "bg-[#12281F] text-[#B8F55C] shadow-xs dark:bg-[#18362B] dark:text-[#B8F55C]"
                  : "text-[#2D3E35] dark:text-[#D1DDD6] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] hover:text-[#11231B] dark:hover:text-[#F2F7F4]"
                  }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-transform ${isActive
                      ? "text-[#B8F55C]"
                      : "text-[#6B8075] dark:text-[#8EA096] group-hover:text-[#11231B] dark:group-hover:text-[#F2F7F4]"
                      }`}
                  />
                  <span className="truncate">{t(`sidebar.nav_${item.id}`) || item.label}</span>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Dynamic Deadline Due Today / Tomorrow Section */}
        <div className="pt-3 border-t border-[#DEE7DF] dark:border-[#1F382B] space-y-3">
          {/* Due Today */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B8075] dark:text-[#8EA096]">
                {t("sidebar.due_today") || "Deadline Hari Ini"}
              </span>
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full font-mono ${dueTodayTickets.length > 0
                  ? "bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-400"
                  : "bg-[#EBF1EB] dark:bg-[#18362B] text-[#556A60] dark:text-[#A5B8AD]"
                  }`}
              >
                {dueTodayTickets.length}
              </span>
            </div>

            {dueTodayTickets.length === 0 ? (
              <p className="text-[11px] text-[#8EA096] dark:text-[#6B8075] italic px-2">
                {t("sidebar.no_tickets_today") || "Tidak ada tiket jatuh tempo hari ini"}
              </p>
            ) : (
              <div className="space-y-1">
                {dueTodayTickets.slice(0, 3).map((tkt) => (
                  <button
                    key={tkt.id}
                    type="button"
                    onClick={() => handleOpenReadOnlyTicket(tkt)}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-[#F8FAF7] dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] hover:border-[#12281F] dark:hover:border-[#B8F55C] transition-all text-left group cursor-pointer shadow-2xs"
                  >
                    <span className="text-xs font-semibold text-[#11231B] dark:text-[#F2F7F4] truncate group-hover:text-[#184530] dark:group-hover:text-[#B8F55C]">
                      {tkt.title}
                    </span>
                    <ChevronRight className="w-3 h-3 text-[#8EA096] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Due Tomorrow */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B8075] dark:text-[#8EA096]">
                {t("sidebar.due_tomorrow") || "Deadline Besok"}
              </span>
              <span
                className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-full font-mono ${dueTomorrowTickets.length > 0
                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300"
                  : "bg-[#EBF1EB] dark:bg-[#18362B] text-[#556A60] dark:text-[#A5B8AD]"
                  }`}
              >
                {dueTomorrowTickets.length}
              </span>
            </div>

            {dueTomorrowTickets.length === 0 ? (
              <p className="text-[11px] text-[#8EA096] dark:text-[#6B8075] italic px-2">
                {t("sidebar.no_tickets_tomorrow") || "Tidak ada tiket jatuh tempo besok"}
              </p>
            ) : (
              <div className="space-y-1">
                {dueTomorrowTickets.slice(0, 3).map((tkt) => (
                  <button
                    key={tkt.id}
                    type="button"
                    onClick={() => handleOpenReadOnlyTicket(tkt)}
                    className="w-full flex items-center justify-between p-2 rounded-xl bg-[#F8FAF7] dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] hover:border-[#12281F] dark:hover:border-[#B8F55C] transition-all text-left group cursor-pointer shadow-2xs"
                  >
                    <span className="text-xs font-semibold text-[#11231B] dark:text-[#F2F7F4] truncate group-hover:text-[#184530] dark:group-hover:text-[#B8F55C]">
                      {tkt.title}
                    </span>
                    <ChevronRight className="w-3 h-3 text-[#8EA096] shrink-0" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Section: Kembali ke Profile & Switch Language Side-by-Side */}
      <div className="p-3 border-t border-[#DEE7DF] dark:border-[#1F382B] bg-[#F8FAF7]/50 dark:bg-[#0C1712]/50 flex items-center gap-2">
        <Link
          href="/profile"
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-[#DEE7DF] dark:border-[#1F382B] bg-white dark:bg-[#12241C] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] text-xs font-semibold text-[#184530] dark:text-[#B8F55C] hover:text-[#11231B] dark:hover:text-[#F2F7F4] transition-all shadow-2xs group cursor-pointer"
          title={t("sidebar.back_to_profile") || "Kembali ke Profile"}
        >
          <User className="w-4 h-4 text-[#6B8075] dark:text-[#8EA096] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors shrink-0" />
          <span className="truncate">{t("sidebar.back_to_profile") || "Kembali ke Profile"}</span>
        </Link>
        <button
          type="button"
          onClick={toggleLanguage}
          className="px-3 py-2.5 rounded-xl border border-[#DEE7DF] dark:border-[#1F382B] bg-white dark:bg-[#12241C] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] text-xs font-bold font-mono text-[#184530] dark:text-[#B8F55C] hover:text-[#11231B] dark:hover:text-[#F2F7F4] transition-all shadow-2xs cursor-pointer shrink-0 flex items-center gap-1.5"
          title={t("sidebar.toggle_language") || "Ganti Bahasa (ID/EN)"}
          aria-label={t("sidebar.toggle_language") || "Ganti Bahasa (ID/EN)"}
        >
          <Languages className="w-4 h-4 text-[#6B8075] dark:text-[#8EA096]" />
          <span>{language === "id" ? "ID" : "EN"}</span>
        </button>
      </div>
    </aside>
  );
}
