"use client";

import React, { useMemo } from "react";
import { useAsking } from "../../data/AskingContext";
import { useTranslation } from "../../data/TranslationContext";
import { WhatsAppLogo, TelegramLogo, EmailLogo } from "../shared/ChannelBadge";
import {
  Layers,
  MessageSquare,
  Tickets,
  CalendarClock,
  ExternalLink,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

export default function DashboardView() {
  const {
    userProfile,
    conversations,
    tickets,
    schedules,
    setActiveTab,
    handleOpenEditTicket,
    handleOpenReadOnlyTicket,
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

  // Computed Metrics
  const totalUnreadCount = useMemo(() => {
    return (conversations || []).reduce((acc, c) => acc + (c.unreadCount || 0), 0);
  }, [conversations]);

  const priorityTicketsCount = useMemo(() => {
    return (tickets || []).filter((tkt) => {
      const p = (tkt.priority || "").toLowerCase();
      const s = (tkt.status || "").toLowerCase();
      const isPriority =
        p === "urgent" || p === "high" || p === "sangat_tinggi" || p === "tinggi";
      const isActive = s !== "completed" && s !== "cancelled";
      return isPriority && isActive;
    }).length;
  }, [tickets]);

  const activeSchedulesCount = useMemo(() => {
    return (schedules || []).filter((s) => s.status === "pending").length;
  }, [schedules]);

  // Top 5 tickets approaching deadline or overdue
  const topPrioritizedTickets = useMemo(() => {
    const active = (tickets || []).filter(
      (tkt) => tkt.status !== "Completed" && tkt.status !== "Cancelled"
    );

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

  const isTomorrow = (deadlineStr) => {
    if (!deadlineStr) return false;
    const deadline = new Date(deadlineStr);
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return deadline.toDateString() === tomorrow.toDateString();
  };

  const getPriorityBadgeStyle = (priority) => {
    const p = (priority || "").toLowerCase();
    if (p === "urgent" || p === "sangat_tinggi") {
      return {
        dot: "bg-rose-500",
        badge: "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300",
        label: t("tickets.priority_urgent") || "Urgent",
      };
    }
    if (p === "high" || p === "tinggi") {
      return {
        dot: "bg-orange-500",
        badge: "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300",
        label: t("tickets.priority_high") || "High",
      };
    }
    if (p === "medium" || p === "sedang") {
      return {
        dot: "bg-amber-500",
        badge: "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300",
        label: t("tickets.priority_medium") || "Medium",
      };
    }
    return {
      dot: "bg-[#184530] dark:bg-[#B8F55C]",
      badge: "bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C]",
      label: t("tickets.priority_low") || "Low",
    };
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F8FAF7] dark:bg-[#0C1712] p-4 sm:p-8 pb-24 sm:pb-8 space-y-6 select-none transition-colors duration-200 scrollbar-thin-subtle">
      {/* Header Greeting Banner */}
      <div className="space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-[#11231B] dark:text-[#F2F7F4] tracking-tight">
          {t("dashboard.welcome_greeting", { name: userProfile.name }) || `Selamat datang, ${userProfile.name}`}
        </h1>
        <span className="text-xs text-[#6B8075] dark:text-[#8EA096]">
          {todayFormatted}
        </span>
      </div>

      {/* Top 2 Cards Grid: Card 1 (Ringkasan Cepat) & Card 2 (Jadwal Mendatang Terdekat) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* CARD 1: Ringkasan Cepat */}
        <div className="rounded-3xl p-6 bg-[#EBF1EB] dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-xs relative overflow-hidden flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#184530] dark:text-[#B8F55C]">
                <Layers className="w-4 h-4 text-[#184530] dark:text-[#B8F55C]" />
                <span>{t("dashboard.quick_brief") || "Quick Brief"}</span>
              </div>
            </div>

            {/* 3 Metric Rows */}
            <div className="space-y-2.5">
              {/* Metric 1: Pesan Belum Dibaca */}
              <div
                onClick={() => setActiveTab("chat")}
                className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] hover:border-[#12281F] dark:hover:border-[#B8F55C] transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] flex items-center justify-center shrink-0">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors">
                      {t("dashboard.metric_unread") || "Pesan Belum Dibaca"}
                    </p>
                    <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096]">
                      WhatsApp, Telegram, dan Email
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 pl-2">
                  <span className="text-sm font-extrabold font-mono text-[#184530] dark:text-[#B8F55C] bg-[#E5EFE7] dark:bg-[#18362B] px-2.5 py-0.5 rounded-lg">
                    {totalUnreadCount}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#6B8075] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors" />
                </div>
              </div>

              {/* Metric 2: Tiket Prioritas Mendesak */}
              <div
                onClick={() => setActiveTab("tickets")}
                className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] hover:border-[#12281F] dark:hover:border-[#B8F55C] transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
                    <Tickets className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
                      {t("dashboard.prioritized_tickets_title") || "Tiket Prioritas Mendesak"}
                    </p>
                    <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096]">
                      Urgent & High butuh tindakan
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 pl-2">
                  <span className="text-sm font-extrabold font-mono text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 px-2.5 py-0.5 rounded-lg">
                    {priorityTicketsCount}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#6B8075] group-hover:text-rose-500 transition-colors" />
                </div>
              </div>

              {/* Metric 3: Jadwal Pesan Aktif */}
              <div
                onClick={() => setActiveTab("scheduler")}
                className="flex items-center justify-between p-3 rounded-2xl bg-white dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] hover:border-[#12281F] dark:hover:border-[#B8F55C] transition-all cursor-pointer group shadow-2xs"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-xl bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] flex items-center justify-center shrink-0">
                    <CalendarClock className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors">
                      {t("dashboard.metric_pending_schedules") || "Jadwal Pesan Aktif"}
                    </p>
                    <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096]">
                      Broadcast & follow-up otomatis
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 pl-2">
                  <span className="text-sm font-extrabold font-mono text-[#184530] dark:text-[#B8F55C] bg-[#E5EFE7] dark:bg-[#18362B] px-2.5 py-0.5 rounded-lg">
                    {activeSchedulesCount}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#6B8075] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CARD 2: Jadwal Mendatang Terdekat */}
        <div className="rounded-3xl p-6 bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-xs font-extrabold tracking-wider text-[#184530] dark:text-[#B8F55C]">
                <CalendarClock className="w-4 h-4 text-[#184530] dark:text-[#B8F55C]" />
                <span>{t("dashboard.upcoming_schedules_title") || "Jadwal Mendatang Terdekat"}</span>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab("scheduler")}
                className="text-xs font-bold text-[#184530] dark:text-[#B8F55C] hover:underline cursor-pointer"
              >
                {t("common.all") || "Lihat Semua"}
              </button>
            </div>

            {/* List of 3 schedules */}
            <div className="space-y-2.5">
              {(schedules || []).slice(0, 3).map((item) => {
                const isTg = item.channel === "telegram";
                const isEmail = item.channel === "email";

                return (
                  <div
                    key={item.id}
                    className="flex items-center justify-between p-3 rounded-2xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B]"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] flex items-center justify-center shrink-0">
                        {isTg ? (
                          <TelegramLogo className="w-4 h-4" />
                        ) : isEmail ? (
                          <EmailLogo className="w-4 h-4" />
                        ) : (
                          <WhatsAppLogo className="w-4 h-4" />
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] truncate">
                          {item.title}
                        </p>
                        <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096] truncate mt-0.5">
                          {item.message || item.content}
                        </p>
                      </div>
                    </div>
                    <div className="shrink-0 pl-2 text-right">
                      <span className="px-2 py-0.5 rounded-full bg-[#EBF1EB] dark:bg-[#18362B] text-[10px] font-mono font-bold text-[#184530] dark:text-[#B8F55C]">
                        {t("dashboard.recipients_count", { count: item.recipientsCount || item.targetCount || 10 })}
                      </span>
                      <p suppressHydrationWarning className="text-[9.5px] text-[#8EA096] mt-1 font-mono">
                        {new Date(typeof item.scheduledTime === "number" ? item.scheduledTime : String(item.scheduledTime)).toLocaleString(language === "en" ? "en-US" : "id-ID", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Full-width CARD 3: Tiket Mendekati Deadline */}
      <div className="rounded-3xl p-6 bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#EEF3EF] dark:border-[#1F382B]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#11231B] dark:text-[#F2F7F4]">
                {t("dashboard.prioritized_tickets_title") || "Tiket Memerlukan Perhatian"}
              </h3>
              <p className="text-[11px] text-[#6B8075] dark:text-[#8EA096]">
                {t("dashboard.tickets_sub") || "Tiket yang sudah melewati SLA deadline atau jatuh tempo besok"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("tickets")}
            className="flex items-center gap-1 text-xs font-bold text-[#184530] dark:text-[#B8F55C] hover:underline cursor-pointer"
          >
            <span>{t("dashboard.open_all_tickets") || "Buka Semua Tiket"}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {topPrioritizedTickets.length === 0 ? (
          <div className="py-8 text-center text-[#8EA096] text-xs">
            {t("dashboard.no_prioritized_tickets") || "Tidak ada tiket berstatus urgent atau melewati deadline saat ini."}
          </div>
        ) : (
          <div className="divide-y divide-[#EEF3EF] dark:divide-[#1F382B]">
            {topPrioritizedTickets.map((ticket) => {
              const overdue = isOverdue(ticket.deadline);
              const tomorrow = isTomorrow(ticket.deadline);
              const pStyle = getPriorityBadgeStyle(ticket.priority);

              return (
                <div
                  key={ticket.id}
                  onClick={() => handleOpenReadOnlyTicket(ticket)}
                  className="py-3 px-2 rounded-2xl flex items-center justify-between gap-4 hover:bg-[#F8FAF7] dark:hover:bg-[#162B21] transition-colors cursor-pointer group"
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <span className="font-mono text-[10px] font-bold text-[#6B8075] dark:text-[#8EA096] bg-[#EBF1EB] dark:bg-[#18362B] px-2 py-1 rounded-lg shrink-0">
                      #{ticket.id}
                    </span>

                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors truncate">
                        {ticket.title}
                      </h4>
                      <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096] truncate mt-0.5">
                        {ticket.contactName} ({ticket.contactPhone || ticket.contactEmail})
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2.5 shrink-0">
                    {ticket.deadline && (
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${overdue
                          ? "bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900/60"
                          : tomorrow
                            ? "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200"
                            : "bg-[#EBF1EB] dark:bg-[#18362B] text-[#556A60] dark:text-[#A5B8AD]"
                          }`}
                      >
                        <Calendar className="w-3 h-3" />
                        {overdue ? t("dashboard.overdue", { deadline: ticket.deadline }) : tomorrow ? (t("dashboard.tomorrow") || "Besok") : ticket.deadline}
                      </span>
                    )}

                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${pStyle.badge}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${pStyle.dot}`} />
                      <span>{pStyle.label}</span>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
