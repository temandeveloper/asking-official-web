"use client";

import React, { useMemo } from "react";
import { useAsking } from "../../data/AskingContext";
import { useTranslation } from "../../data/TranslationContext";
import { WhatsAppLogo, TelegramLogo, EmailLogo } from "../shared/ChannelBadge";
import { DashboardMetricsSkeleton } from "../common/daisySkeletons";
import {
  Layers,
  MessageSquare,
  Tickets,
  CalendarClock,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Clock,
  Wand2,
  Sparkles,
} from "lucide-react";

export default function DashboardView() {
  const {
    userProfile,
    conversations,
    tickets,
    schedules,
    setActiveTab,
    handleOpenReadOnlyTicket,
    isRemoteLoading,
  } = useAsking();
  const { language, t } = useTranslation();

  // Localized today date
  const todayFormatted = useMemo(() => {
    return new Date().toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }, [language]);

  // Derived upcoming active schedules
  const upcomingSchedules = useMemo(() => {
    const list = (schedules || []).filter((s) => s.status === "pending");
    return list
      .sort((a, b) => Number(a.scheduledTime) - Number(b.scheduledTime))
      .slice(0, 3);
  }, [schedules]);

  // 1. Quick Brief Stats
  const totalUnreadCount = useMemo(() => {
    return (conversations || []).reduce((acc, c) => acc + (Number(c.unreadCount) || 0), 0);
  }, [conversations]);

  const priorityTicketsCount = useMemo(() => {
    return (tickets || []).filter((tkt) => {
      const p = (tkt.priority || "").toLowerCase();
      const s = (tkt.status || "").toLowerCase();
      const isPriority =
        p === "urgent" ||
        p === "high" ||
        p === "medium" ||
        p === "sangat_tinggi" ||
        p === "tinggi" ||
        p === "sedang";
      const isActive =
        s !== "completed" && s !== "cancelled" && s !== "resolved";
      return isPriority && isActive;
    }).length;
  }, [tickets]);

  const activeSchedulesCount = useMemo(() => {
    return (schedules || []).filter((s) => s.status === "pending").length;
  }, [schedules]);

  // 2. Top 5 Prioritize Tickets approaching deadline
  const topPrioritizedTickets = useMemo(() => {
    const active = (tickets || []).filter((t) => {
      const s = (t.status || "").toLowerCase();
      return s !== "completed" && s !== "cancelled" && s !== "resolved";
    });

    return active
      .sort((a, b) => {
        if (a.deadline && !b.deadline) return -1;
        if (!a.deadline && b.deadline) return 1;
        if (a.deadline && b.deadline) {
          return a.deadline.localeCompare(b.deadline);
        }
        const weight = { urgent: 4, high: 3, medium: 2, low: 1, lowest: 0 };
        return (weight[b.priority] || 0) - (weight[a.priority] || 0);
      })
      .slice(0, 5);
  }, [tickets]);

  const isOverdue = (deadlineStr) => {
    if (!deadlineStr) return false;
    const deadline = new Date(deadlineStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadline < today;
  };

  const getPriorityBadgeStyle = (priority) => {
    const p = (priority || "").toLowerCase();
    if (p === "urgent" || p === "sangat_tinggi") {
      return {
        badge: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/50",
        dot: "bg-rose-500",
        label: t("tickets.priority_urgent") || "Urgent",
      };
    }
    if (p === "high" || p === "tinggi") {
      return {
        badge: "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800/50",
        dot: "bg-orange-500",
        label: t("tickets.priority_high") || "High",
      };
    }
    if (p === "medium" || p === "sedang") {
      return {
        badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/50",
        dot: "bg-amber-500",
        label: t("tickets.priority_medium") || "Medium",
      };
    }
    if (p === "low" || p === "rendah") {
      return {
        badge: "bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] border-[#CFE2D3] dark:border-[#234235]",
        dot: "bg-[#184530] dark:bg-[#B8F55C]",
        label: t("tickets.priority_low") || "Low",
      };
    }
    return {
      badge: "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
      dot: "bg-slate-400",
      label: "Lowest",
    };
  };

  const formatScheduleDate = (timestamp) => {
    if (!timestamp) return "-";
    const d = new Date(Number(timestamp));
    return d.toLocaleString(language === "en" ? "en-US" : "id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F8FAF7] dark:bg-[#0C1712] p-4 sm:p-8 pb-24 sm:pb-8 space-y-6 select-none transition-colors duration-200 scrollbar-thin-subtle">
      {/* Top Header Greeting Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-[#DEE7DF] dark:border-[#1F382B]">
        <div>
          <div className="inline-block">
            <span className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight px-4 py-1.5 rounded-full bg-[#E5EFE7] text-[#184530] dark:bg-[#18362B] dark:text-[#B8F55C] border border-[#CFE2D3] dark:border-[#234235] shadow-2xs">
              {t("dashboard.welcome", { name: userProfile?.name ? `, ${userProfile.name}` : "" }) || `Selamat Datang${userProfile?.name ? `, ${userProfile.name}` : ""} 👋`}
            </span>
          </div>
        </div>
      </div>

      {isRemoteLoading ? (
        <DashboardMetricsSkeleton />
      ) : (
        <div className="space-y-6">
          {/* Top Grid: Quick Brief & Upcoming Schedules */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* CARD 1: Quick Brief */}
            <div className="rounded-3xl p-6 bg-[#EBF1EB] dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-xs relative overflow-hidden flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#184530] dark:text-[#B8F55C]">
                    <Layers className="w-4 h-4 text-[#184530] dark:text-[#B8F55C]" />
                    <span>{t("dashboard.quick_brief") || "QUICK BRIEF"}</span>
                  </div>
                </div>

                {/* 3 Metric Rows */}
                <div className="space-y-2.5">
                  {/* Metric 1: Unread Messages */}
                  <div
                    onClick={() => setActiveTab("chat")}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] hover:border-[#12281F] dark:hover:border-[#B8F55C] transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] flex items-center justify-center shrink-0">
                        <MessageSquare className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors">
                          {t("dashboard.unread_messages") || "Pesan Belum Dibaca"}
                        </p>
                        <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096]">
                          {t("messages.unread_badge", { count: totalUnreadCount }) || `${totalUnreadCount} Belum Dibaca`}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      <span className="text-sm font-extrabold font-mono text-[#184530] dark:text-[#B8F55C] bg-[#E5EFE7] dark:bg-[#18362B] px-2.5 py-0.5 rounded-lg">
                        {totalUnreadCount}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#6B8075] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors" />
                    </div>
                  </div>

                  {/* Metric 2: Priority Tickets */}
                  <div
                    onClick={() => setActiveTab("tickets")}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] hover:border-[#12281F] dark:hover:border-[#B8F55C] transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                        <Tickets className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                          {t("dashboard.priority_tickets") || "Tiket Prioritas"}
                        </p>
                        <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096]">
                          Urgent, High & Medium
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      <span className="text-sm font-extrabold font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-lg">
                        {priorityTicketsCount}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#6B8075] group-hover:text-rose-500 transition-colors" />
                    </div>
                  </div>

                  {/* Metric 3: Active Schedules */}
                  <div
                    onClick={() => setActiveTab("scheduler")}
                    className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] hover:border-[#12281F] dark:hover:border-[#B8F55C] transition-all cursor-pointer group shadow-2xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-xl bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] flex items-center justify-center shrink-0">
                        <CalendarClock className="w-4 h-4" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors">
                          {t("dashboard.active_schedules") || "Jadwal Pesan Aktif"}
                        </p>
                        <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096]">
                          {t("scheduler.filter_pending") || "Status: Pending"}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0 pl-2">
                      <span className="text-sm font-extrabold font-mono text-[#184530] dark:text-[#B8F55C] bg-[#E5EFE7] dark:bg-[#18362B] px-2.5 py-0.5 rounded-lg">
                        {activeSchedulesCount}
                      </span>
                      <ExternalLink className="w-3.5 h-3.5 text-[#6B8075] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* CARD 2: Upcoming Active Schedules */}
            <div className="rounded-3xl p-6 bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-xs flex flex-col justify-between space-y-4">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#11231B] dark:text-[#F2F7F4]">
                    <CalendarClock className="w-4 h-4 text-[#184530] dark:text-[#B8F55C]" />
                    <span>{t("dashboard.upcoming_deadlines") || "Jadwal Pengingat Mendatang"}</span>
                  </div>
                </div>

                {upcomingSchedules.length === 0 ? (
                  <div className="py-8 text-center space-y-2 border border-dashed border-[#DEE7DF] dark:border-[#1F382B] rounded-2xl">
                    <Calendar className="w-6 h-6 mx-auto text-[#8EA096] dark:text-[#6E8578]" />
                    <p className="text-xs font-semibold text-[#4A5F54] dark:text-[#A5B8AD]">
                      {t("dashboard.no_schedules") || "Belum ada jadwal pesan dalam waktu dekat"}
                    </p>
                    <button
                      type="button"
                      onClick={() => setActiveTab("scheduler")}
                      className="text-[11px] font-bold text-[#184530] dark:text-[#B8F55C] hover:underline cursor-pointer"
                    >
                      + {t("scheduler.create_schedule") || "Jadwalkan Pesan"}
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {upcomingSchedules.map((item) => {
                      const isTg = item.channel === "telegram";
                      const isEmail = item.channel === "email";

                      return (
                        <div
                          key={item.id}
                          className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B]"
                        >
                          <div className="w-8 h-8 rounded-xl bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] flex items-center justify-center font-mono font-bold text-xs shrink-0">
                            {isTg ? (
                              <TelegramLogo className="w-4 h-4" />
                            ) : isEmail ? (
                              <EmailLogo className="w-4 h-4" />
                            ) : (
                              <WhatsAppLogo className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h4 className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] truncate">
                                {formatScheduleDate(item.scheduledTime)}
                              </h4>
                            </div>
                            <p className="text-[11px] text-[#4A5F54] dark:text-[#A5B8AD] truncate mt-0.5">
                              {item.text || item.message || "Template message"}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Middle Grid: 2 Suggested AI / Quick Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div
              onClick={() => setActiveTab("chat")}
              className="rounded-3xl p-6 bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-xs hover:border-[#12281F] dark:hover:border-[#B8F55C] transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#184530] dark:text-[#B8F55C]">
                  <Sparkles className="w-4 h-4 text-[#184530] dark:text-[#B8F55C]" />
                  <span>{t("dashboard.quick_action_unread") || "Lihat Chat Belum Terbalas"}</span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-[#11231B] dark:text-[#F2F7F4] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors">
                {t("dashboard.unread_messages") || "Pesan Belum Dibaca"}
              </h3>
              <p className="text-xs text-[#4A5F54] dark:text-[#A5B8AD] leading-relaxed">
                {t("dashboard.subtitle") || "Kelola percakapan pelanggan, pantau status tiket, dan maksimalkan produktivitas tim Anda."}
              </p>
            </div>

            <div
              onClick={() => setActiveTab("tickets")}
              className="rounded-3xl p-6 bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-xs hover:border-[#12281F] dark:hover:border-[#B8F55C] transition-all cursor-pointer group space-y-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-[#184530] dark:text-[#B8F55C]">
                  <Sparkles className="w-4 h-4 text-[#184530] dark:text-[#B8F55C]" />
                  <span>{t("dashboard.quick_action_tickets") || "Tinjau Tiket Prioritas"}</span>
                </div>
              </div>
              <h3 className="text-sm font-bold text-[#11231B] dark:text-[#F2F7F4] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors">
                {t("dashboard.prioritize_tickets") || "Tiket Prioritas"}
              </h3>
              <p className="text-xs text-[#4A5F54] dark:text-[#A5B8AD] leading-relaxed">
                {t("tickets.page_subtitle") || "Pantau alur keluhan, permintaan layanan, dan progres penyelesaian tiket pelanggan."}
              </p>
            </div>
          </div>

          {/* Bottom Card: Prioritize Tickets (Top 5 Approaching Deadline) */}
          <div className="rounded-3xl p-6 bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-2 border-b border-[#EEF3EF] dark:border-[#1F382B]">
              <div className="flex items-center gap-2">
                <Tickets className="w-4 h-4 text-[#184530] dark:text-[#B8F55C]" />
                <h2 className="text-sm font-bold text-[#11231B] dark:text-[#F2F7F4]">
                  {t("dashboard.prioritize_tickets") || "Tiket Prioritas"}
                </h2>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C]">
                  {t("dashboard.tickets_count", {
                    count: topPrioritizedTickets.length,
                  }) || `${topPrioritizedTickets.length} Tiket`}
                </span>
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("tickets")}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-bold transition-all shrink-0 active:scale-95 cursor-pointer shadow-2xs"
              >
                <Wand2 className="w-3.5 h-3.5 text-[#B8F55C]" />
                <span>{t("dashboard.quick_action_overview") || "Ringkasan Tiket Prioritas"}</span>
              </button>
            </div>

            {topPrioritizedTickets.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 mx-auto text-[#22C55E]" />
                <p className="text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6]">
                  {t("dashboard.no_priority_tickets") || "Semua tiket prioritas telah terselesaikan dengan baik"}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#EEF3EF] dark:divide-[#1F382B] space-y-1">
                {topPrioritizedTickets.map((ticket) => {
                  const badge = getPriorityBadgeStyle(ticket.priority);
                  const overdue = isOverdue(ticket.deadline);

                  return (
                    <div
                      key={ticket.id}
                      onClick={() => handleOpenReadOnlyTicket(ticket)}
                      className="py-3 px-2 rounded-2xl flex items-center justify-between gap-4 hover:bg-[#F8FAF7] dark:hover:bg-[#162B21] transition-colors cursor-pointer group"
                    >
                      <div className="flex items-center gap-3 min-w-0 flex-1">
                        <span className="font-mono text-[10px] font-bold text-[#6B8075] dark:text-[#8EA096] bg-[#EBF1EB] dark:bg-[#18362B] px-2 py-1 rounded-lg shrink-0 flex items-center gap-1.5">
                          <span>#{ticket.id}</span>
                          {ticket.channel === "telegram" || ticket.contactJid?.startsWith("tg_") ? (
                            <TelegramLogo className="w-3.5 h-3.5 text-[#229ED9] shrink-0" />
                          ) : ticket.channel === "email" || ticket.contactJid?.startsWith("email:") ? (
                            <EmailLogo className="w-3.5 h-3.5 text-[#EA4335] shrink-0" />
                          ) : (
                            <WhatsAppLogo className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
                          )}
                        </span>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors truncate">
                            {ticket.title}
                          </h4>
                          <p className="text-[11px] text-[#6B8075] dark:text-[#8EA096] truncate mt-0.5">
                            {ticket.contactName || "Direct Client"}
                            {ticket.contactPhone
                              ? ` (${ticket.contactPhone})`
                              : ticket.contactEmail
                                ? ` (${ticket.contactEmail})`
                                : ""}
                          </p>
                        </div>
                      </div>

                      {/* Badges: Deadline & Priority */}
                      <div className="flex items-center gap-2 shrink-0">
                        {ticket.deadline ? (
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${overdue
                                ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800/60"
                                : "bg-[#EBF1EB] dark:bg-[#18362B] text-[#2D3E35] dark:text-[#D1DDD6] border-[#DEE7DF] dark:border-[#1F382B]"
                              }`}
                          >
                            <Clock className="w-3 h-3" />
                            <span>{ticket.deadline}</span>
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-[#8EA096]">
                            Deadline: Belum Diatur
                          </span>
                        )}

                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${badge.badge}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          <span>{badge.label}</span>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
