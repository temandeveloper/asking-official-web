"use client";

import React from "react";
import { Clock, AlertTriangle } from "lucide-react";
import { useTranslation } from "../../data/TranslationContext";

export function PriorityBadge({ priority = "medium", className = "" }) {
  const { t } = useTranslation();
  const p = (priority || "medium").toLowerCase();

  switch (p) {
    case "urgent":
    case "sangat_tinggi":
      return (
        <span className={`badge badge-error badge-soft font-bold text-[10px] gap-1 shrink-0 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
          <span>{t("tickets.priority_urgent")}</span>
        </span>
      );
    case "high":
    case "tinggi":
      return (
        <span className={`badge badge-warning badge-soft font-bold text-[10px] gap-1 shrink-0 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
          <span>{t("tickets.priority_high")}</span>
        </span>
      );
    case "medium":
    case "sedang":
      return (
        <span className={`badge badge-warning badge-outline font-bold text-[10px] gap-1 shrink-0 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span>{t("tickets.priority_medium")}</span>
        </span>
      );
    case "low":
    case "rendah":
      return (
        <span className={`badge badge-success badge-soft font-bold text-[10px] gap-1 shrink-0 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{t("tickets.priority_low")}</span>
        </span>
      );
    default:
      return (
        <span className={`badge badge-ghost font-bold text-[10px] gap-1 shrink-0 ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
          <span>{t("tickets.priority_lowest")}</span>
        </span>
      );
  }
}

export function StatusBadge({ status = "New", className = "" }) {
  const { t } = useTranslation();
  const s = status || "New";

  switch (s) {
    case "New":
    case "Baru":
      return (
        <span className={`badge badge-info badge-soft font-bold text-[10px] shrink-0 ${className}`}>
          {t("tickets.status_new")}
        </span>
      );
    case "In Progress":
    case "Dalam Proses":
      return (
        <span className={`badge badge-warning badge-soft font-bold text-[10px] shrink-0 ${className}`}>
          {t("tickets.status_in_progress")}
        </span>
      );
    case "Under Review":
    case "Menunggu Klien":
    case "Menunggu Review":
      return (
        <span className={`badge badge-secondary badge-soft font-bold text-[10px] shrink-0 ${className}`}>
          {t("tickets.status_under_review")}
        </span>
      );
    case "Completed":
    case "Terselesaikan":
    case "Selesai":
      return (
        <span className={`badge badge-success badge-soft font-bold text-[10px] shrink-0 ${className}`}>
          {t("tickets.status_completed")}
        </span>
      );
    case "Cancelled":
    case "Dibatalkan":
      return (
        <span className={`badge badge-error badge-soft font-bold text-[10px] shrink-0 ${className}`}>
          {t("tickets.status_cancelled")}
        </span>
      );
    default:
      return (
        <span className={`badge badge-ghost font-bold text-[10px] shrink-0 ${className}`}>
          {s}
        </span>
      );
  }
}

export function CategoryBadge({ category = "support", className = "" }) {
  const { t } = useTranslation();
  const cat = (category || "support").toLowerCase();
  const label =
    cat === "technical"
      ? t("tickets.cat_technical")
      : cat === "issue"
        ? t("tickets.cat_issue")
        : cat === "marketing"
          ? t("tickets.cat_marketing")
          : cat === "billing"
            ? t("tickets.cat_billing")
            : cat === "support"
              ? t("tickets.cat_support")
              : t("tickets.cat_general");

  return (
    <span className={`badge badge-neutral badge-soft text-[10px] font-semibold uppercase tracking-wider shrink-0 ${className}`}>
      {label}
    </span>
  );
}

export function DeadlineBadge({ deadline, status, className = "" }) {
  const { t } = useTranslation();
  if (!deadline) {
    return (
      <span className={`text-[10px] text-base-content/50 font-medium italic ${className}`}>
        {t("tickets.no_deadline")}
      </span>
    );
  }

  const todayStr = new Date().toISOString().split("T")[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split("T")[0];

  const isOverdue =
    new Date(deadline) < new Date().setHours(0, 0, 0, 0) &&
    status !== "Completed" &&
    status !== "Cancelled";

  const isToday = deadline.startsWith(todayStr);
  const isTomorrow = deadline.startsWith(tomorrowStr);

  if (isOverdue) {
    return (
      <span className={`badge badge-error badge-soft font-mono font-bold text-[10px] gap-1 shrink-0 ${className}`}>
        <AlertTriangle className="w-3 h-3 text-rose-600 dark:text-rose-400 shrink-0" />
        <span>{t("tickets.overdue_badge", { deadline })}</span>
      </span>
    );
  }

  if (isToday) {
    return (
      <span className={`badge badge-warning badge-soft font-mono font-bold text-[10px] gap-1 shrink-0 ${className}`}>
        <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>{t("tickets.deadline_today")}</span>
      </span>
    );
  }

  if (isTomorrow) {
    return (
      <span className={`badge badge-warning badge-outline font-mono font-bold text-[10px] gap-1 shrink-0 ${className}`}>
        <Clock className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0" />
        <span>{t("tickets.deadline_tomorrow")}</span>
      </span>
    );
  }

  return (
    <span className={`badge badge-neutral badge-outline font-mono text-[10px] font-medium gap-1 shrink-0 ${className}`}>
      <Clock className="w-3 h-3 text-base-content/60 shrink-0" />
      <span>{deadline}</span>
    </span>
  );
}
