"use client";

import React from "react";
import { useAsking } from "../../data/AskingContext";
import { useTranslation } from "../../data/TranslationContext";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, removeToast } = useAsking();
  const { t } = useTranslation();

  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast toast-end toast-bottom z-50 p-4 space-y-2 pointer-events-none">
      {toasts.map((toast) => {
        const isSuccess = toast.type === "success";
        const isWarning = toast.type === "warning";
        const alertClass = isSuccess
          ? "alert-success"
          : isWarning
            ? "alert-warning"
            : "alert-info";

        return (
          <div
            key={toast.id}
            className={`alert ${alertClass} shadow-xl border border-white/20 text-xs font-semibold flex items-center justify-between gap-3 pointer-events-auto transition-all animate-in fade-in slide-in-from-bottom-3 duration-200`}
          >
            <div className="flex items-center gap-2 min-w-0">
              {isSuccess && <CheckCircle2 className="w-4 h-4 shrink-0" />}
              {isWarning && <AlertCircle className="w-4 h-4 shrink-0" />}
              {!isSuccess && !isWarning && <Info className="w-4 h-4 shrink-0" />}
              <span className="truncate">{toast.message}</span>
            </div>
            <button
              type="button"
              onClick={() => removeToast(toast.id)}
              className="btn btn-ghost btn-xs btn-circle shrink-0"
              title={t("common.close")}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
