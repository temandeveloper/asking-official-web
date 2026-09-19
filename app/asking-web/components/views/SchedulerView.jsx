"use client";

import React, { useState, useMemo } from "react";
import { useAsking } from "../../data/AskingContext";
import { useTranslation } from "../../data/TranslationContext";
import { WhatsAppLogo, TelegramLogo, EmailLogo } from "../shared/ChannelBadge";
import { SchedulerCardsSkeleton } from "../common/daisySkeletons";
import {
  CalendarClock,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Trash2,
  Repeat,
  Calendar,
  ShieldCheck,
  Loader2,
  Search,
  X,
  Pencil,
  ArrowRight,
} from "lucide-react";

export default function SchedulerView() {
  const {
    schedules,
    filterScheduleStatus,
    setFilterScheduleStatus,
    setIsNewScheduleModalOpen,
    setEditingSchedule,
    deleteScheduledMessage,
    dispatchScheduledItem,
    isRemoteLoading,
    addToast,
  } = useAsking();
  const { t, language } = useTranslation();

  const [searchQuery, setSearchQuery] = useState("");

  const pendingCount = useMemo(
    () => (schedules || []).filter((m) => m.status === "pending").length,
    [schedules]
  );
  const sendingCount = useMemo(
    () => (schedules || []).filter((m) => m.status === "sending").length,
    [schedules]
  );
  const sentCount = useMemo(
    () => (schedules || []).filter((m) => m.status === "sent").length,
    [schedules]
  );
  const failedCount = useMemo(
    () => (schedules || []).filter((m) => m.status === "failed").length,
    [schedules]
  );

  // Filter and search messages
  const filteredItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (schedules || []).filter((item) => {
      // Status filter
      if (filterScheduleStatus !== "all" && item.status !== filterScheduleStatus) {
        return false;
      }
      // Search query filter
      if (!q) return true;

      const matchName = (item.contactName || "").toLowerCase().includes(q);
      const matchSubject = (item.subject || item.title || "").toLowerCase().includes(q);
      const matchText = (item.text || item.message || "").toLowerCase().includes(q);
      const matchTarget = (item.target || item.jid || "").toLowerCase().includes(q);

      return matchName || matchSubject || matchText || matchTarget;
    });
  }, [schedules, filterScheduleStatus, searchQuery]);

  const handleCreateNew = () => {
    setEditingSchedule(null);
    setIsNewScheduleModalOpen(true);
  };

  const handleEditItem = (item) => {
    setEditingSchedule(item);
    setIsNewScheduleModalOpen(true);
  };

  const handleDeleteItem = (id) => {
    if (confirm(t("scheduler.delete_confirm"))) {
      deleteScheduledMessage(id);
    }
  };

  const formatScheduleDate = (timestamp) => {
    if (!timestamp) return "";
    const d = new Date(typeof timestamp === "number" ? timestamp : String(timestamp));
    return d.toLocaleString(language === "en" ? "en-US" : "id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="flex-1 h-full bg-[#F8FAF7] dark:bg-[#0C1712] text-[#11231B] dark:text-[#F2F7F4] flex flex-col min-w-0 select-none overflow-hidden transition-colors duration-200">
      {/* Header */}
      <div className="px-4 sm:px-6 py-3.5 sm:py-4.5 border-b border-[#DEE7DF] dark:border-[#1F382B] bg-white dark:bg-[#12241C] flex items-center justify-between gap-3 shrink-0">
        <div className="min-w-0">
          <h2 className="text-sm sm:text-base font-bold text-[#11231B] dark:text-[#F2F7F4] flex items-center gap-2 truncate">
            <Calendar className="w-4 h-4 text-[#184530] dark:text-[#B8F55C] shrink-0" />
            <span className="truncate">{t("scheduler.page_title")}</span>
          </h2>
          <p className="text-[11px] text-[#556A60] dark:text-[#A5B8AD] mt-0.5 max-w-2xl hidden sm:block">
            {t("scheduler.page_subtitle")}
          </p>
        </div>

        <button
          type="button"
          onClick={handleCreateNew}
          className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer border border-[#234235] shrink-0"
        >
          <Plus className="w-4 h-4 text-[#B8F55C]" />
          <span>{t("scheduler.btn_new_schedule")}</span>
        </button>
      </div>

      {/* 1. Mobile 4-Column Compact Metric Strip (lg:hidden) */}
      <div className="lg:hidden px-4 py-2 bg-white dark:bg-[#12241C] border-b border-[#DEE7DF] dark:border-[#1F382B] grid grid-cols-4 gap-2 shrink-0">
        <div className="p-2 rounded-xl bg-[#F8FAF7] dark:bg-[#0C1712] border border-[#DEE7DF]/60 dark:border-[#1F382B] text-center shadow-2xs">
          <p className="text-[9.5px] font-semibold text-[#6B8075] dark:text-[#8EA096]">{t("common.all")}</p>
          <p className="text-sm font-bold text-[#11231B] dark:text-[#F2F7F4] font-mono">{(schedules || []).length}</p>
        </div>
        <div className="p-2 rounded-xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-900/40 text-center shadow-2xs">
          <p className="text-[9.5px] font-semibold text-amber-700 dark:text-amber-400">{t("scheduler.stat_pending")}</p>
          <p className="text-sm font-bold text-amber-600 dark:text-amber-400 font-mono">{pendingCount}</p>
        </div>
        <div className="p-2 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200/50 dark:border-emerald-900/40 text-center shadow-2xs">
          <p className="text-[9.5px] font-semibold text-emerald-700 dark:text-emerald-400">{t("scheduler.stat_sent")}</p>
          <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">{sentCount}</p>
        </div>
        <div className="p-2 rounded-xl bg-rose-50/50 dark:bg-rose-950/20 border border-rose-200/50 dark:border-rose-900/40 text-center shadow-2xs">
          <p className="text-[9.5px] font-semibold text-rose-700 dark:text-rose-400">{t("scheduler.stat_failed")}</p>
          <p className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono">{failedCount}</p>
        </div>
      </div>

      {/* 2. Desktop Spacious Stat Cards (hidden on mobile) */}
      <div className="hidden lg:grid grid-cols-4 gap-4 p-6 border-b border-[#DEE7DF] dark:border-[#1F382B] bg-[#F8FAF7]/80 dark:bg-[#0C1712]/80 shrink-0">
        {/* Total Terjadwal */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-[#6B8075] dark:text-[#8EA096]">
              {t("scheduler.stat_total")}
            </p>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-[#11231B] dark:text-[#F2F7F4]">
              {(schedules || []).length}
            </p>
            <p className="text-[10px] text-[#8EA096] dark:text-[#6E8578]">
              {t("scheduler.stat_total_sub")}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] border border-[#CFE2D3] dark:border-[#234235] flex items-center justify-center shadow-2xs shrink-0">
            <CalendarClock className="w-5 h-5" />
          </div>
        </div>

        {/* Menunggu Kirim (Pending) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400">
              {t("scheduler.stat_pending")}
            </p>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-amber-600 dark:text-amber-400">
              {pendingCount}
            </p>
            <p className="text-[10px] text-amber-600/80 dark:text-amber-400/70">
              {t("scheduler.stat_pending_sub")}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center shadow-2xs shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Berhasil Terkirim (Sent) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
              {t("scheduler.stat_sent")}
            </p>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400">
              {sentCount}
            </p>
            <p className="text-[10px] text-emerald-600/80 dark:text-emerald-400/70">
              {t("scheduler.stat_sent_sub")}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center shadow-2xs shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>

        {/* Gagal Kirim (Failed) */}
        <div className="p-4 rounded-2xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-2xs hover:shadow-xs transition-all flex items-center justify-between">
          <div className="space-y-0.5">
            <p className="text-[11px] font-semibold text-rose-700 dark:text-rose-400">
              {t("scheduler.stat_failed")}
            </p>
            <p className="text-xl sm:text-2xl font-bold tracking-tight text-rose-600 dark:text-rose-400">
              {failedCount}
            </p>
            <p className="text-[10px] text-rose-600/80 dark:text-rose-400/70">
              {t("scheduler.stat_failed_sub")}
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center shadow-2xs shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Status Filter */}
      <div className="px-4 sm:px-6 py-2.5 sm:py-3 border-b border-[#DEE7DF] dark:border-[#1F382B] bg-white dark:bg-[#12241C] flex flex-wrap items-center justify-between gap-2.5 sm:gap-3 shrink-0">
        {/* Search Input */}
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-3.5 h-3.5 text-[#8EA096] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t("scheduler.search_placeholder")}
            className="w-full pl-8 pr-8 py-1.5 rounded-xl text-xs bg-[#F8FAF7] dark:bg-[#0C1712] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none focus:border-[#184530] dark:focus:border-[#B8F55C] transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-[#8EA096] hover:text-[#11231B] dark:hover:text-[#F2F7F4] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none w-full sm:w-auto">
          {[
            { key: "all", label: t("common.all"), count: (schedules || []).length },
            { key: "pending", label: t("scheduler.stat_pending"), count: pendingCount },
            { key: "sending", label: t("scheduler.filter_sending").replace(/^Status:\s*/i, ""), count: sendingCount },
            { key: "sent", label: t("scheduler.stat_sent"), count: sentCount },
            { key: "failed", label: t("scheduler.stat_failed"), count: failedCount },
          ].map((tab) => {
            const isActive = filterScheduleStatus === tab.key;
            return (
              <button
                key={tab.key}
                type="button"
                onClick={() => setFilterScheduleStatus(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                  isActive
                    ? "bg-[#12281F] text-[#B8F55C] dark:bg-[#18362B] dark:text-[#B8F55C] shadow-2xs font-bold"
                    : "text-[#556A60] dark:text-[#A5B8AD] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B]/60 hover:text-[#11231B] dark:hover:text-[#F2F7F4] border border-[#DEE7DF] dark:border-[#1F382B]"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${
                    isActive
                      ? "bg-[#18362B] text-[#B8F55C] dark:bg-[#234A38] dark:text-[#B8F55C]"
                      : "bg-[#EBF1EB] dark:bg-[#18362B] text-[#6B8075] dark:text-[#8EA096]"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2-Column Cards Grid Stream */}
      <div className="flex-1 p-3.5 sm:p-6 overflow-y-auto pb-24 lg:pb-6 scrollbar-thin-subtle">
        {isRemoteLoading ? (
          <SchedulerCardsSkeleton />
        ) : filteredItems.length === 0 ? (
          <div className="h-64 flex flex-col items-center justify-center text-center text-[#8EA096] dark:text-[#6E8578] space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-[#EBF1EB] dark:bg-[#18362B] border border-[#DEE7DF] dark:border-[#1F382B] flex items-center justify-center shadow-xs">
              <CalendarClock className="w-7 h-7 text-[#184530] dark:text-[#B8F55C]" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#2D3E35] dark:text-[#D1DDD6]">
                {searchQuery ? t("scheduler.empty_search_title") : t("scheduler.empty_title")}
              </p>
              <p className="text-xs text-[#6B8075] dark:text-[#8EA096] mt-1 max-w-sm mx-auto">
                {searchQuery
                  ? t("scheduler.empty_search_desc", { query: searchQuery })
                  : t("scheduler.empty_desc")}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 lg:gap-5">
            {filteredItems.map((item) => {
              const isPending = item.status === "pending";
              const isSending = item.status === "sending";
              const isSent = item.status === "sent";
              const isFailed = item.status === "failed";
              const targetsCount = item.recipientsCount || 1;

              const isTg = item.channel === "telegram";
              const isEmail = item.channel === "email";

              return (
                <div
                  key={item.id}
                  className="p-5 sm:p-6 rounded-2xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-2xs hover:shadow-md hover:border-[#184530]/30 dark:hover:border-[#B8F55C]/30 transition-all duration-200 flex flex-col justify-between gap-3.5 group relative"
                >
                  {/* 1. TOP ROW: Category / Status Pills & Delete Button */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Channel Pill */}
                      {isEmail ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400 text-xs font-semibold tracking-wide border border-blue-200/60 dark:border-blue-800/40">
                          <EmailLogo className="w-3.5 h-3.5" />
                          <span>Email</span>
                        </span>
                      ) : isTg ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 text-sky-700 dark:bg-sky-950/50 dark:text-sky-400 text-xs font-semibold tracking-wide border border-sky-200/60 dark:border-sky-800/40">
                          <TelegramLogo className="w-3.5 h-3.5" />
                          <span>Telegram</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 text-xs font-semibold tracking-wide border border-emerald-200/60 dark:border-emerald-800/40">
                          <WhatsAppLogo className="w-3.5 h-3.5" />
                          <span>WhatsApp</span>
                        </span>
                      )}

                      {/* Status Pill */}
                      {isPending && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 text-[11px] font-semibold border border-amber-200/60 dark:border-amber-800/40">
                          <Clock className="w-3 h-3" />
                          <span>{t("scheduler.stat_pending")}</span>
                        </span>
                      )}
                      {isSending && (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-300 animate-pulse">
                          <Loader2 className="w-3 h-3 animate-spin text-emerald-600" />
                          <span>{t("scheduler.sending_progress", { count: targetsCount })}</span>
                        </span>
                      )}
                      {isSent && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-200/60 dark:border-emerald-800/40">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                          <span>{t("scheduler.stat_sent")}</span>
                        </span>
                      )}
                      {isFailed && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 text-[11px] font-semibold border border-rose-200/60 dark:border-rose-800/40">
                          <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400" />
                          <span>{t("scheduler.stat_failed")}</span>
                        </span>
                      )}

                      {/* Anti-Ban / Smart-Mimicry Badge */}
                      {!isEmail && (
                        <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] text-[10px] font-semibold border border-[#CFE2D3] dark:border-[#234235]">
                          <ShieldCheck className="w-3 h-3 text-[#22C55E]" />
                          <span>{t("scheduler.antiban_title")}</span>
                        </span>
                      )}
                    </div>

                    {/* Quick Delete Button */}
                    <button
                      type="button"
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-1.5 rounded-xl text-[#8EA096] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-all cursor-pointer opacity-70 group-hover:opacity-100"
                      title={t("scheduler.delete_schedule")}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* 2. MIDDLE ROW: Title & Description */}
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-[#11231B] dark:text-[#F2F7F4] tracking-tight line-clamp-1">
                      {item.subject || item.title || t("scheduler.new_schedule_title")}
                    </h3>

                    <div className="flex items-center gap-1.5 text-xs font-semibold text-[#184530] dark:text-[#B8F55C]">
                      <span className="truncate">{item.contactName || t("scheduler.target_recipients")}</span>
                      <span className="text-[#8EA096]">•</span>
                      <span className="text-[#6B8075] dark:text-[#8EA096] font-normal">
                        {t("scheduler.recipient_count", { count: targetsCount })}
                      </span>
                    </div>

                    {/* Message Preview */}
                    <p className="text-xs sm:text-[13px] text-[#556A60] dark:text-[#A5B8AD] leading-relaxed line-clamp-2 select-text font-normal pt-0.5">
                      {item.text || item.message}
                    </p>
                  </div>

                  {/* 3. BOTTOM ROW: Metadata on Left + CTA Action on Right */}
                  <div className="pt-3 border-t border-[#EEF3EF] dark:border-[#1F382B] flex items-center justify-between gap-3">
                    {/* Left metadata tags */}
                    <div className="flex items-center gap-3 text-xs text-[#6B8075] dark:text-[#8EA096] flex-wrap min-w-0">
                      <span className="inline-flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-[#8EA096]" />
                        <span className="font-medium text-[#2D3E35] dark:text-[#D1DDD6]">
                          {formatScheduleDate(item.scheduledTime)}
                        </span>
                      </span>

                      {item.recurrence && item.recurrence !== "once" && (
                        <span className="hidden sm:inline-flex items-center gap-1">
                          <Repeat className="w-3.5 h-3.5 text-[#8EA096]" />
                          <span className="capitalize">
                            {item.recurrence === "daily"
                              ? t("scheduler.recurrence_daily")
                              : item.recurrence === "weekly"
                                ? t("scheduler.recurrence_weekly")
                                : item.recurrence}
                          </span>
                        </span>
                      )}

                      {item.sentAt && (
                        <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                          <span>{t("scheduler.sent_at_label", { date: formatScheduleDate(item.sentAt) })}</span>
                        </span>
                      )}

                      {item.error && (
                        <span
                          className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 font-medium line-clamp-1 max-w-[200px]"
                          title={item.error}
                        >
                          <AlertTriangle className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                          <span className="truncate">{item.error}</span>
                        </span>
                      )}
                    </div>

                    {/* Right CTA Action buttons */}
                    <div className="flex items-center gap-2.5 shrink-0 ml-auto">
                      {isPending ? (
                        <>
                          <button
                            type="button"
                            onClick={() => handleEditItem(item)}
                            className="text-xs font-semibold text-[#556A60] dark:text-[#A5B8AD] hover:text-[#184530] dark:hover:text-[#B8F55C] flex items-center gap-1 cursor-pointer transition-colors p-1"
                            title={t("common.edit")}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                            <span>{t("common.edit")}</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => dispatchScheduledItem(item)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#184530] dark:text-[#B8F55C] hover:text-[#0c1b14] dark:hover:text-[#dbff98] cursor-pointer transition-colors group/btn"
                          >
                            <span>{t("scheduler.btn_send_now")}</span>
                            <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleEditItem(item)}
                          className="inline-flex items-center gap-1 text-xs font-semibold text-[#184530] dark:text-[#B8F55C] hover:underline cursor-pointer transition-colors group/btn"
                        >
                          <span>{t("scheduler.reschedule")}</span>
                          <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      )}
                    </div>
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
