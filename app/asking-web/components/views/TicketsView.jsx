"use client";

import React, { useState, useMemo, useEffect } from "react";
import { useAsking } from "../../data/AskingContext";
import { useTranslation } from "../../data/TranslationContext";
import { WhatsAppLogo, TelegramLogo, EmailLogo } from "../shared/ChannelBadge";
import { TicketsTableSkeleton } from "../common/daisySkeletons";
import {
  Search,
  Plus,
  ChevronDown,
  Trash2,
  SquarePen,
  MessageSquare,
  Calendar,
  Tag,
  SlidersHorizontal,
  X,
  RotateCcw,
} from "lucide-react";
import {
  CATEGORY_OPTIONS,
  STATUS_OPTIONS,
  STATUS_COLUMNS,
  PRIORITY_OPTIONS,
} from "../../constants/ticketConstants";

export { CATEGORY_OPTIONS, STATUS_OPTIONS, STATUS_COLUMNS, PRIORITY_OPTIONS };

export default function TicketsView() {
  const { t } = useTranslation();
  const {
    tickets,
    fetchTickets,
    ticketFilters,
    setTicketSearchQuery,
    setTicketCategoryFilter,
    setTicketPriorityFilter,
    setTicketStatusFilter,
    setTicketDateFilter,
    setTicketDeadlineFilter,
    handleOpenCreateTicket,
    handleOpenEditTicket,
    handleOpenReadOnlyTicket,
    deleteTicket,
    setActiveJid,
    setActiveTab,
    isRemoteLoading,
    addToast,
  } = useAsking();

  useEffect(() => {
    fetchTickets?.();
  }, [fetchTickets]);

  const normalizePriority = (p) => {
    if (!p) return "medium";
    const lower = p.toLowerCase();
    if (lower === "sangat_tinggi") return "urgent";
    if (lower === "tinggi") return "high";
    if (lower === "sedang") return "medium";
    if (lower === "rendah") return "low";
    if (lower === "sangat_rendah") return "lowest";
    return lower;
  };

  const normalizeStatus = (s) => {
    if (!s) return "New";
    if (s === "Baru") return "New";
    if (s === "Dalam Proses") return "In Progress";
    if (s === "Menunggu Client" || s === "Menunggu Review" || s === "Waiting on Client")
      return "Under Review";
    if (s === "Terselesaikan" || s === "Resolved" || s === "Selesai") return "Completed";
    if (s === "Dibatalkan") return "Cancelled";
    return s;
  };

  const isOverdue = (deadlineStr, status) => {
    const statusVal = normalizeStatus(status);
    if (!deadlineStr || statusVal === "Completed" || statusVal === "Cancelled")
      return false;
    const deadline = new Date(deadlineStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return deadline < today;
  };

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const activeSecondaryFilterCount = useMemo(() => {
    let count = 0;
    if (ticketFilters.category && ticketFilters.category !== "all") count++;
    if (ticketFilters.priority && ticketFilters.priority !== "all") count++;
    if (ticketFilters.date && ticketFilters.date !== "all") count++;
    if (ticketFilters.deadline && ticketFilters.deadline !== "all") count++;
    return count;
  }, [ticketFilters]);

  const statusCounts = useMemo(() => {
    const counts = { all: (tickets || []).length };
    STATUS_OPTIONS.forEach((st) => {
      counts[st.value] = (tickets || []).filter(
        (ticket) => normalizeStatus(ticket.status) === st.value
      ).length;
    });
    return counts;
  }, [tickets]);

  const handleResetSecondaryFilters = () => {
    setTicketCategoryFilter("all");
    setTicketPriorityFilter("all");
    setTicketDateFilter("all");
    setTicketDeadlineFilter("all");
  };

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return (tickets || []).filter((ticket) => {
      const ticketPriorityVal = normalizePriority(ticket.priority);
      const ticketStatusVal = normalizeStatus(ticket.status);
      const ticketCat = (ticket.category || "support").toLowerCase();

      // 1. Search Query
      const q = (ticketFilters.search || "").trim().toLowerCase();
      const matchesSearch =
        !q ||
        (ticket.title && ticket.title.toLowerCase().includes(q)) ||
        (ticket.id && String(ticket.id).toLowerCase().includes(q)) ||
        (ticket.contactName && ticket.contactName.toLowerCase().includes(q)) ||
        (ticket.description && ticket.description.toLowerCase().includes(q));

      // 2. Category Filter
      const matchesCategory =
        ticketFilters.category === "all" ||
        ticketCat === ticketFilters.category.toLowerCase();

      // 3. Priority Filter
      const matchesPriority =
        ticketFilters.priority === "all" ||
        ticketPriorityVal === ticketFilters.priority;

      // 4. Status Filter
      const matchesStatus =
        ticketFilters.status === "all" ||
        ticketStatusVal === ticketFilters.status;

      // 5. Create Date Filter
      let matchesDate = true;
      if (ticketFilters.date && ticketFilters.date !== "all" && ticket.createdAt) {
        const tDate = new Date(ticket.createdAt);
        const targetDate = new Date();
        if (ticketFilters.date === "today") {
          matchesDate = tDate.toDateString() === targetDate.toDateString();
        } else if (ticketFilters.date === "last7days") {
          targetDate.setDate(targetDate.getDate() - 7);
          matchesDate = tDate >= targetDate;
        } else if (ticketFilters.date === "last30days") {
          targetDate.setDate(targetDate.getDate() - 30);
          matchesDate = tDate >= targetDate;
        }
      }

      // 6. Deadline Filter
      let matchesDeadline = true;
      if (ticketFilters.deadline !== "all") {
        if (!ticket.deadline) {
          matchesDeadline = ticketFilters.deadline === "none";
        } else {
          const dDate = new Date(ticket.deadline);
          const today = new Date();
          today.setHours(0, 0, 0, 0);

          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          if (ticketFilters.deadline === "today") {
            matchesDeadline = dDate.toDateString() === today.toDateString();
          } else if (ticketFilters.deadline === "tomorrow") {
            matchesDeadline = dDate.toDateString() === tomorrow.toDateString();
          } else if (ticketFilters.deadline === "thisWeek") {
            const nextWeek = new Date(today);
            nextWeek.setDate(nextWeek.getDate() + 7);
            matchesDeadline = dDate >= today && dDate <= nextWeek;
          } else if (ticketFilters.deadline === "overdue") {
            matchesDeadline =
              dDate < today &&
              ticketStatusVal !== "Completed" &&
              ticketStatusVal !== "Cancelled";
          } else if (ticketFilters.deadline === "none") {
            matchesDeadline = false;
          }
        }
      }

      return (
        matchesSearch &&
        matchesCategory &&
        matchesPriority &&
        matchesStatus &&
        matchesDate &&
        matchesDeadline
      );
    });
  }, [tickets, ticketFilters]);

  // Jump to Chat from Ticket
  const handleJumpToChat = (ticket) => {
    let jid = ticket.contactJid || ticket.contactPhone;
    if (!jid) return;
    setActiveJid(jid);
    setActiveTab("chat");
  };

  const getCategoryBadge = (cat) => {
    const key = (cat || "support").toLowerCase();
    const opt =
      CATEGORY_OPTIONS.find((c) => c.id === key) || CATEGORY_OPTIONS[3];
    let colorClass =
      "bg-[#E5EFE7] text-[#184530] dark:bg-[#18362B] dark:text-[#B8F55C] border-[#CFE2D3] dark:border-[#234235]";
    if (opt.id === "technical")
      colorClass =
        "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/60";
    if (opt.id === "issue")
      colorClass =
        "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300 border-rose-200/60";
    if (opt.id === "marketing")
      colorClass =
        "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/60";
    if (opt.id === "general")
      colorClass =
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/60";

    return (
      <span
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-bold border ${colorClass} capitalize`}
      >
        <Tag className="w-2.5 h-2.5" />
        <span>{opt.label}</span>
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const priorityVal = normalizePriority(priority);
    let badgeBg =
      "bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300";
    let dotColor = "bg-slate-400";
    let title = "Lowest";

    if (priorityVal === "low") {
      badgeBg =
        "bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C]";
      dotColor = "bg-[#184530] dark:bg-[#B8F55C]";
      title = "Low";
    } else if (priorityVal === "medium") {
      badgeBg =
        "bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300";
      dotColor = "bg-amber-500";
      title = "Medium";
    } else if (priorityVal === "high") {
      badgeBg =
        "bg-orange-50 dark:bg-orange-950/40 text-orange-700 dark:text-orange-300";
      dotColor = "bg-orange-500";
      title = "High";
    } else if (priorityVal === "urgent") {
      badgeBg =
        "bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300";
      dotColor = "bg-rose-500";
      title = "Urgent";
    }

    return (
      <span
        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold text-[10px] ${badgeBg}`}
      >
        <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
        <span>{title}</span>
      </span>
    );
  };

  const getStatusBadge = (status) => {
    const statusVal = normalizeStatus(status);
    const statusObj =
      STATUS_OPTIONS.find((s) => s.value === statusVal) || STATUS_OPTIONS[1];

    let colorClass =
      "bg-[#E5EFE7] text-[#184530] dark:bg-[#18362B] dark:text-[#B8F55C]";
    if (statusObj.color === "rose") {
      colorClass =
        "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300";
    } else if (statusObj.color === "purple") {
      colorClass =
        "bg-[#12281F] text-white dark:bg-[#18362B] dark:text-[#B8F55C]";
    } else if (statusObj.color === "amber") {
      colorClass =
        "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300";
    } else if (statusObj.color === "emerald") {
      colorClass =
        "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300";
    }

    return (
      <span
        className={`inline-block px-2.5 py-0.5 rounded-full font-bold text-[10px] ${colorClass}`}
      >
        {statusVal}
      </span>
    );
  };

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 bg-[#F8FAF7] dark:bg-[#0C1712] transition-colors duration-200 overflow-hidden">
      {/* Top Header */}
      <div className="h-14 sm:h-16 px-4 sm:px-6 bg-white dark:bg-[#12241C] border-b border-[#DEE7DF] dark:border-[#1F382B] flex items-center justify-between shrink-0 select-none">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base font-bold text-[#11231B] dark:text-[#F2F7F4]">
              {t("tickets.page_title")}
            </h1>
          </div>
          <p className="text-[11px] text-[#6B8075] dark:text-[#8EA096] mt-0.5 hidden sm:block">
            {t("tickets.page_subtitle")}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Create Ticket Button */}
          <button
            type="button"
            onClick={handleOpenCreateTicket}
            className="flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-[#12281F] dark:bg-[#18362B] hover:bg-[#1C3B2E] dark:hover:bg-[#234A38] text-[#B8F55C] text-xs font-semibold shadow-xs transition-all active:scale-95 cursor-pointer border border-[#234235]"
          >
            <Plus className="w-4 h-4 text-[#B8F55C]" />
            <span>{t("tickets.btn_create")}</span>
          </button>
        </div>
      </div>

      {/* 1. Desktop Control Bar: Search & Status Filter (hidden on mobile) */}
      <div className="hidden lg:flex px-6 py-3 border-b border-[#DEE7DF] dark:border-[#1F382B] bg-[#F8FAF7]/80 dark:bg-[#0C1712]/80 items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-2 flex-wrap flex-1">
          {/* Filter 1: Category */}
          <div className="relative">
            <select
              value={ticketFilters.category}
              onChange={(e) => setTicketCategoryFilter(e.target.value)}
              className="pl-3 pr-7 py-1.5 text-xs font-bold rounded-xl bg-[#EBF1EB] dark:bg-[#18362B] border border-[#DEE7DF] dark:border-[#1F382B] text-[#184530] dark:text-[#B8F55C] appearance-none focus:outline-none focus:border-[#12281F] cursor-pointer shadow-2xs"
            >
              <option value="all">{t("tickets.filter_category_all")}</option>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-[#6B8075] pointer-events-none" />
          </div>

          {/* Filter 2: Status */}
          <div className="relative">
            <select
              value={ticketFilters.status}
              onChange={(e) => setTicketStatusFilter(e.target.value)}
              className="pl-3 pr-7 py-1.5 text-xs font-bold rounded-xl bg-[#EBF1EB] dark:bg-[#18362B] border border-[#DEE7DF] dark:border-[#1F382B] text-[#184530] dark:text-[#B8F55C] appearance-none focus:outline-none focus:border-[#12281F] cursor-pointer shadow-2xs"
            >
              <option value="all">{t("tickets.filter_status_all")}</option>
              {STATUS_OPTIONS.map((st) => (
                <option key={st.value} value={st.value}>
                  {st.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-[#6B8075] pointer-events-none" />
          </div>

          {/* Filter 3: Priority */}
          <div className="relative">
            <select
              value={ticketFilters.priority}
              onChange={(e) => setTicketPriorityFilter(e.target.value)}
              className="pl-3 pr-7 py-1.5 text-xs font-bold rounded-xl bg-[#EBF1EB] dark:bg-[#18362B] border border-[#DEE7DF] dark:border-[#1F382B] text-[#184530] dark:text-[#B8F55C] appearance-none focus:outline-none focus:border-[#12281F] cursor-pointer shadow-2xs"
            >
              <option value="all">{t("tickets.filter_priority_all")}</option>
              {PRIORITY_OPTIONS.map((pri) => (
                <option key={pri.id} value={pri.id}>
                  {pri.title}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-[#6B8075] pointer-events-none" />
          </div>

          {/* Filter 4: Created Date */}
          <div className="relative">
            <select
              value={ticketFilters.date || "all"}
              onChange={(e) => setTicketDateFilter(e.target.value)}
              className="pl-3 pr-7 py-1.5 text-xs font-bold rounded-xl bg-[#EBF1EB] dark:bg-[#18362B] border border-[#DEE7DF] dark:border-[#1F382B] text-[#184530] dark:text-[#B8F55C] appearance-none focus:outline-none focus:border-[#12281F] cursor-pointer shadow-2xs"
            >
              <option value="all">{t("tickets.filter_date_all")}</option>
              <option value="today">{t("tickets.filter_date_today")}</option>
              <option value="last7days">{t("tickets.filter_date_7days")}</option>
              <option value="last30days">{t("tickets.filter_date_30days")}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-[#6B8075] pointer-events-none" />
          </div>

          {/* Filter 5: Deadline */}
          <div className="relative">
            <select
              value={ticketFilters.deadline}
              onChange={(e) => setTicketDeadlineFilter(e.target.value)}
              className="pl-3 pr-7 py-1.5 text-xs font-bold rounded-xl bg-[#EBF1EB] dark:bg-[#18362B] border border-[#DEE7DF] dark:border-[#1F382B] text-[#184530] dark:text-[#B8F55C] appearance-none focus:outline-none focus:border-[#12281F] cursor-pointer shadow-2xs"
            >
              <option value="all">{t("tickets.filter_deadline_all")}</option>
              <option value="today">{t("tickets.filter_deadline_today")}</option>
              <option value="tomorrow">{t("tickets.filter_deadline_tomorrow")}</option>
              <option value="thisWeek">{t("tickets.filter_deadline_week")}</option>
              <option value="overdue">{t("tickets.filter_deadline_overdue")}</option>
              <option value="none">{t("tickets.filter_deadline_none")}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 absolute right-2 top-2 text-[#6B8075] pointer-events-none" />
          </div>
        </div>

        {/* Desktop Search Input Box */}
        <div className="relative w-64 max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B8075] dark:text-[#8EA096] pointer-events-none" />
          <input
            type="text"
            placeholder={t("tickets.search_placeholder")}
            value={ticketFilters.search || ""}
            onChange={(e) => setTicketSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F8FAF7] dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] text-xs text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F] dark:focus:border-[#B8F55C] transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* 2. Mobile Clean Filter & Search Bar (lg:hidden) */}
      <div className="lg:hidden px-4 py-2.5 bg-white dark:bg-[#12241C] border-b border-[#DEE7DF] dark:border-[#1F382B] space-y-2 shrink-0">
        {/* Search input + Advanced Filter Toggle */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#6B8075] dark:text-[#8EA096] pointer-events-none" />
            <input
              type="text"
              placeholder={t("tickets.search_placeholder")}
              value={ticketFilters.search || ""}
              onChange={(e) => setTicketSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[#F8FAF7] dark:bg-[#0C1712] border border-[#DEE7DF] dark:border-[#1F382B] text-xs text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none focus:border-[#184530] dark:focus:border-[#B8F55C] transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${activeSecondaryFilterCount > 0 || isMobileFilterOpen
                ? "bg-[#12281F] text-[#B8F55C] border-[#234235] dark:bg-[#18362B] dark:text-[#B8F55C]"
                : "bg-[#F8FAF7] dark:bg-[#0C1712] border-[#DEE7DF] dark:border-[#1F382B] text-[#556A60] dark:text-[#A5B8AD]"
              }`}
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{t("common.filter") || "Filter"}</span>
            {activeSecondaryFilterCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-[#B8F55C] text-[#12281F] text-[10px] font-bold flex items-center justify-center">
                {activeSecondaryFilterCount}
              </span>
            )}
          </button>
        </div>

        {/* Horizontal Status Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { value: "all", label: t("common.all"), count: statusCounts.all },
            { value: "New", label: "New", count: statusCounts["New"] || 0 },
            { value: "In Progress", label: "In Progress", count: statusCounts["In Progress"] || 0 },
            { value: "Under Review", label: "Under Review", count: statusCounts["Under Review"] || 0 },
            { value: "Completed", label: "Completed", count: statusCounts["Completed"] || 0 },
            { value: "Cancelled", label: "Cancelled", count: statusCounts["Cancelled"] || 0 },
          ].map((st) => {
            const isSelected = ticketFilters.status === st.value;
            return (
              <button
                key={st.value}
                type="button"
                onClick={() => setTicketStatusFilter(st.value)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${isSelected
                    ? "bg-[#12281F] text-[#B8F55C] dark:bg-[#18362B] dark:text-[#B8F55C] shadow-2xs font-bold"
                    : "bg-[#F8FAF7] dark:bg-[#0C1712] text-[#556A60] dark:text-[#A5B8AD] border border-[#DEE7DF] dark:border-[#1F382B]"
                  }`}
              >
                <span>{st.label}</span>
                <span
                  className={`text-[9.5px] px-1.5 py-0.2 rounded-full font-mono ${isSelected
                      ? "bg-[#18362B] text-[#B8F55C] dark:bg-[#234A38]"
                      : "bg-[#EBF1EB] dark:bg-[#18362B] text-[#6B8075] dark:text-[#8EA096]"
                    }`}
                >
                  {st.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Collapsible Mobile Secondary Filters Tray */}
        {isMobileFilterOpen && (
          <div className="p-3 rounded-2xl bg-[#F8FAF7] dark:bg-[#0C1712] border border-[#DEE7DF] dark:border-[#1F382B] space-y-2.5 animate-in slide-in-from-top-2">
            <div className="grid grid-cols-2 gap-2">
              {/* Category */}
              <select
                value={ticketFilters.category}
                onChange={(e) => setTicketCategoryFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4]"
              >
                <option value="all">{t("tickets.filter_category_all")}</option>
                {CATEGORY_OPTIONS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>

              {/* Priority */}
              <select
                value={ticketFilters.priority}
                onChange={(e) => setTicketPriorityFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4]"
              >
                <option value="all">{t("tickets.filter_priority_all")}</option>
                {PRIORITY_OPTIONS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
              </select>

              {/* Date */}
              <select
                value={ticketFilters.date || "all"}
                onChange={(e) => setTicketDateFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4]"
              >
                <option value="all">{t("tickets.filter_date_all")}</option>
                <option value="today">{t("tickets.filter_date_today")}</option>
                <option value="last7days">{t("tickets.filter_date_7days")}</option>
                <option value="last30days">{t("tickets.filter_date_30days")}</option>
              </select>

              {/* Deadline */}
              <select
                value={ticketFilters.deadline}
                onChange={(e) => setTicketDeadlineFilter(e.target.value)}
                className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4]"
              >
                <option value="all">{t("tickets.filter_deadline_all")}</option>
                <option value="today">{t("tickets.filter_deadline_today")}</option>
                <option value="tomorrow">{t("tickets.filter_deadline_tomorrow")}</option>
                <option value="thisWeek">{t("tickets.filter_deadline_week")}</option>
                <option value="overdue">{t("tickets.filter_deadline_overdue")}</option>
                <option value="none">{t("tickets.filter_deadline_none")}</option>
              </select>
            </div>

            {activeSecondaryFilterCount > 0 && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={handleResetSecondaryFilters}
                  className="flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400 hover:underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t("common.reset") || "Reset"}</span>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile Responsive Cards Stream (lg:hidden) */}
      <div className="lg:hidden flex-1 overflow-y-auto p-4 space-y-3 pb-24 scrollbar-thin-subtle">
        {isRemoteLoading ? (
          <TicketsTableSkeleton />
        ) : filteredTickets.length === 0 ? (
          <div className="h-48 flex flex-col items-center justify-center text-center text-[#8EA096] dark:text-[#6E8578] space-y-2">
            <Tag className="w-8 h-8 text-[#184530] dark:text-[#B8F55C]" />
            <p className="text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6]">
              {t("tickets.empty_title")}
            </p>
            <p className="text-[11px] text-[#6B8075] dark:text-[#8EA096]">
              {t("tickets.empty_desc")}
            </p>
          </div>
        ) : (
          filteredTickets.map((ticket) => {
            const ticketIsOverdue = isOverdue(ticket.deadline, ticket.status);
            const isTg =
              ticket.channel === "telegram" || ticket.contactJid?.startsWith("tg_");
            const isEmail =
              ticket.channel === "email" || ticket.contactJid?.startsWith("email:");

            return (
              <div
                key={ticket.id}
                onClick={() => handleOpenReadOnlyTicket(ticket)}
                className="p-4 rounded-2xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-2xs hover:shadow-xs transition-all cursor-pointer space-y-2.5"
              >
                {/* Top Row: Ticket ID + Channel + Category + Status */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-xs text-[#184530] dark:text-[#B8F55C]">
                      #{ticket.id}
                    </span>
                    <div className="w-5 h-5 rounded-md bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] flex items-center justify-center shrink-0">
                      {isTg ? (
                        <TelegramLogo className="w-3.5 h-3.5" />
                      ) : isEmail ? (
                        <EmailLogo className="w-3.5 h-3.5" />
                      ) : (
                        <WhatsAppLogo className="w-3.5 h-3.5" />
                      )}
                    </div>
                    {getCategoryBadge(ticket.category)}
                  </div>
                  <div>{getStatusBadge(ticket.status)}</div>
                </div>

                {/* Middle Row: Title & Customer Contact */}
                <div className="space-y-0.5">
                  <h3 className="text-xs sm:text-sm font-bold text-[#11231B] dark:text-[#F2F7F4] line-clamp-2 leading-snug">
                    {ticket.title}
                  </h3>
                  <p className="text-[11px] text-[#556A60] dark:text-[#A5B8AD] truncate">
                    {ticket.contactName}{" "}
                    {ticket.contactPhone || ticket.contactEmail
                      ? `• ${ticket.contactPhone || ticket.contactEmail}`
                      : ""}
                  </p>
                </div>

                {/* Bottom Row: Priority & Deadline on Left, Actions on Right */}
                <div className="pt-2 border-t border-[#EEF3EF] dark:border-[#1F382B] flex items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2 flex-wrap min-w-0">
                    {getPriorityBadge(ticket.priority)}

                    {ticket.deadline && (
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md font-semibold text-[10px] ${ticketIsOverdue
                            ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-900/60"
                            : "bg-[#EBF1EB] dark:bg-[#18362B] text-[#4A5F54] dark:text-[#A5B8AD]"
                          }`}
                      >
                        <Calendar className="w-3 h-3" />
                        {ticketIsOverdue && <span>{t("dashboard.overdue", { deadline: "" })} </span>}
                        <span>{ticket.deadline}</span>
                      </span>
                    )}
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-1 shrink-0 ml-auto">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEditTicket(ticket);
                      }}
                      className="p-1.5 rounded-lg text-[#556A60] dark:text-[#A5B8AD] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer"
                      title={t("tickets.edit_ticket")}
                    >
                      <SquarePen className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(t("tickets.delete_confirm", { id: ticket.id, title: ticket.title }))) {
                          deleteTicket(ticket.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-[#8EA096] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                      title={t("tickets.delete_ticket")}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Desktop Main Container: Dedicated Table View (hidden on mobile) */}
      <div className="hidden lg:flex flex-1 p-6 overflow-hidden flex-col min-w-0">
        <div className="flex-1 bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] rounded-2xl shadow-xs overflow-hidden flex flex-col min-h-0">
          <div className="flex-1 overflow-auto scrollbar-thin-subtle">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#DEE7DF] dark:border-[#1F382B] bg-[#F8FAF7] dark:bg-[#162B21] text-[11px] font-bold text-[#556A60] dark:text-[#A5B8AD] uppercase tracking-wider sticky top-0 z-10 backdrop-blur-xs">
                  <th className="py-3 px-4">{t("tickets.col_id")}</th>
                  <th className="py-3 px-4">{t("tickets.col_title")}</th>
                  <th className="py-3 px-4">{t("tickets.col_category")}</th>
                  <th className="py-3 px-4">{t("tickets.col_priority")}</th>
                  <th className="py-3 px-4">{t("tickets.col_deadline")}</th>
                  <th className="py-3 px-4">{t("tickets.col_client")}</th>
                  <th className="py-3 px-4">{t("tickets.col_status")}</th>
                  <th className="py-3 px-4 text-right">{t("tickets.col_actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF3EF] dark:divide-[#1F382B] text-[#11231B] dark:text-[#F2F7F4]">
                {isRemoteLoading ? (
                  <tr>
                    <td colSpan={8} className="py-6 px-4">
                      <TicketsTableSkeleton />
                    </td>
                  </tr>
                ) : filteredTickets.length === 0 ? (
                  <tr>
                    <td
                      colSpan={8}
                      className="py-16 text-center text-[#8EA096] text-xs space-y-1"
                    >
                      <p className="font-semibold text-sm text-[#2D3E35] dark:text-[#D1DDD6]">
                        {t("tickets.empty_title")}
                      </p>
                      <p className="text-[11px]">
                        {t("tickets.empty_desc")}
                      </p>
                    </td>
                  </tr>
                ) : (
                  filteredTickets.map((ticket) => {
                    const ticketIsOverdue = isOverdue(ticket.deadline, ticket.status);
                    const isTg =
                      ticket.channel === "telegram" ||
                      ticket.contactJid?.startsWith("tg_");
                    const isEmail =
                      ticket.channel === "email" ||
                      ticket.contactJid?.startsWith("email:");

                    return (
                      <tr
                        key={ticket.id}
                        className="hover:bg-[#F8FAF7] dark:hover:bg-[#162B21] transition-colors"
                      >
                        {/* ID + Channel */}
                        <td className="py-3 px-4 font-mono font-bold text-[#6B8075] dark:text-[#8EA096] text-[11px] whitespace-nowrap">
                          <div className="flex items-center gap-1.5">
                            <span>#{ticket.id}</span>
                            {isTg ? (
                              <TelegramLogo className="w-3.5 h-3.5" />
                            ) : isEmail ? (
                              <EmailLogo className="w-3.5 h-3.5" />
                            ) : (
                              <WhatsAppLogo className="w-3.5 h-3.5" />
                            )}
                          </div>
                        </td>

                        {/* Title & Description */}
                        <td className="py-3 px-4 max-w-sm">
                          <div
                            onClick={() => handleOpenReadOnlyTicket(ticket)}
                            className="cursor-pointer group"
                          >
                            <p className="font-bold text-xs text-[#11231B] dark:text-[#F2F7F4] group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors line-clamp-1">
                              {ticket.title}
                            </p>
                            {ticket.description && (
                              <p className="text-[10.5px] text-[#6B8075] dark:text-[#8EA096] line-clamp-1 mt-0.5">
                                {ticket.description}
                              </p>
                            )}
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getCategoryBadge(ticket.category)}
                        </td>

                        {/* Priority */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getPriorityBadge(ticket.priority)}
                        </td>

                        {/* Deadline */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {ticket.deadline ? (
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md font-semibold text-[11px] ${ticketIsOverdue
                                ? "bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-400 font-bold border border-rose-200 dark:border-rose-900/60"
                                : "bg-[#EBF1EB] dark:bg-[#18362B] text-[#4A5F54] dark:text-[#A5B8AD]"
                                }`}
                            >
                              <Calendar className="w-3 h-3" />
                              {ticketIsOverdue && <span>{t("dashboard.overdue", { deadline: "" })} </span>}
                              <span>{ticket.deadline}</span>
                            </span>
                          ) : (
                            <span className="text-[#8EA096] text-[11px] italic">
                              {t("tickets.filter_deadline_none")}
                            </span>
                          )}
                        </td>

                        {/* Client Info */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          <div className="flex flex-col">
                            <span className="font-semibold text-[#11231B] dark:text-[#F2F7F4]">
                              {ticket.contactName || t("tickets.col_client")}
                            </span>
                            {(ticket.contactPhone || ticket.contactEmail) && (
                              <span className="text-[10px] text-[#6B8075] dark:text-[#8EA096]">
                                {ticket.contactPhone || ticket.contactEmail}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3 px-4 whitespace-nowrap">
                          {getStatusBadge(ticket.status)}
                        </td>

                        {/* Actions */}
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1">
                            {/* Edit Drawer */}
                            <button
                              type="button"
                              onClick={() => handleOpenEditTicket(ticket)}
                              className="p-1.5 rounded-lg text-[#6B8075] dark:text-[#8EA096] hover:text-[#11231B] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer"
                              title={t("tickets.edit_ticket")}
                            >
                              <SquarePen className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              type="button"
                              onClick={() => {
                                if (
                                  confirm(
                                    t("tickets.delete_confirm", {
                                      id: ticket.id,
                                      title: ticket.title,
                                    })
                                  )
                                ) {
                                  deleteTicket(ticket.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-500 hover:text-rose-700 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                              title={t("tickets.delete_ticket")}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
