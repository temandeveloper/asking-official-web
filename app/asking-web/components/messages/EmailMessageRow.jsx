"use client";

import React, { useState } from "react";
import { useTranslation } from "../../data/TranslationContext";
import {
  ChevronDown,
  ChevronRight,
  Paperclip,
  Reply,
  ArrowUpRight,
  ArrowDownLeft,
  Download,
  FileText,
} from "lucide-react";

export default function EmailMessageRow({ message, onReply }) {
  const { t, language } = useTranslation();
  const [isExpanded, setIsExpanded] = useState(false);

  const isMe = Boolean(message.isMe || message.fromMe);
  const subject = message.subject || t("email.no_subject");
  const senderDisplay = isMe
    ? t("email.you")
    : message.senderName || message.senderEmail || t("email.sender");
  const recipientDisplay =
    message.recipientEmail || (isMe ? message.jid?.replace(/^email:/, "") : t("email.you"));

  const formattedDate = message.timestamp
    ? new Date(message.timestamp).toLocaleString(language === "en" ? "en-US" : "id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  const hasAttachments =
    Array.isArray(message.attachments) && message.attachments.length > 0;
  const attachment = hasAttachments ? message.attachments[0] : null;

  const handleDownloadAttachment = (att) => {
    if (!att) return;
    if (att.previewUrl) {
      const a = document.createElement("a");
      a.href = att.previewUrl;
      a.download = att.name || att.filename || "attachment";
      a.click();
    } else {
      alert(`${t("common.download")} ${att.name || att.filename || "file"}`);
    }
  };

  return (
    <div
      className={`rounded-2xl border transition-all duration-150 overflow-hidden shadow-2xs ${
        isExpanded
          ? "bg-white dark:bg-[#12241C] border-[#184530]/40 dark:border-[#B8F55C]/40 ring-1 ring-[#184530]/10"
          : "bg-white/90 dark:bg-[#12241C]/90 hover:bg-white dark:hover:bg-[#12241C] border-[#DEE7DF] dark:border-[#1F382B]"
      }`}
    >
      {/* Header Row Bar */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-4 sm:px-5 py-3.5 flex items-center justify-between gap-3 sm:gap-4 cursor-pointer select-none"
      >
        {/* Left: Direction Icon + Expand Arrow + Sender + Subject Preview */}
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
          <div className="shrink-0 text-[#6B8075] dark:text-[#8EA096]">
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </div>

          <div
            className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold ${
              isMe
                ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300"
                : "bg-sky-100 text-sky-800 dark:bg-sky-950/60 dark:text-sky-300"
            }`}
            title={isMe ? t("email.sent_email") : t("email.received_email")}
          >
            {isMe ? (
              <ArrowUpRight className="w-3.5 h-3.5" />
            ) : (
              <ArrowDownLeft className="w-3.5 h-3.5" />
            )}
          </div>

          <div className="min-w-0 flex-1 flex items-center gap-2 sm:gap-3">
            <span
              className={`text-xs font-bold truncate max-w-[120px] sm:max-w-[180px] ${
                isMe
                  ? "text-[#184530] dark:text-[#B8F55C]"
                  : "text-[#11231B] dark:text-[#F2F7F4]"
              }`}
            >
              {senderDisplay}
            </span>

            <span className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] truncate">
              {subject}
            </span>

            {!isExpanded && (
              <span className="text-[11px] text-[#6B8075] dark:text-[#8EA096] truncate hidden md:inline">
                - {message.text?.slice(0, 65) || ""}
              </span>
            )}
          </div>
        </div>

        {/* Right: Attachment indicator + Date */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {hasAttachments && (
            <span
              className="p-1 rounded-md bg-[#EBF1EB] dark:bg-[#18362B] text-[#556A60] dark:text-[#A5B8AD]"
              title={t("email.attachments")}
            >
              <Paperclip className="w-3.5 h-3.5" />
            </span>
          )}

          <span
            suppressHydrationWarning
            className="text-[10.5px] sm:text-[11px] text-[#8EA096] dark:text-[#6E8578] font-medium"
          >
            {formattedDate}
          </span>
        </div>
      </div>

      {/* Expanded Email Detail View */}
      {isExpanded && (
        <div className="px-4 sm:px-6 pb-5 pt-2 border-t border-[#EEF3EF] dark:border-[#1F382B] space-y-4 animate-in fade-in duration-150">
          {/* Metadata Subheader */}
          <div className="p-3.5 rounded-xl bg-[#F8FAF7] dark:bg-[#0C1712] border border-[#DEE7DF] dark:border-[#1F382B] flex items-center justify-between flex-wrap gap-3">
            <div className="space-y-1 text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#556A60] dark:text-[#A5B8AD] min-w-[50px]">
                  {t("email.from")}
                </span>
                <span className="font-semibold text-[#11231B] dark:text-[#F2F7F4]">
                  {message.senderName
                    ? `${message.senderName} <${message.senderEmail || ""}>`
                    : message.senderEmail || senderDisplay}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#556A60] dark:text-[#A5B8AD] min-w-[50px]">
                  {t("email.to")}
                </span>
                <span className="text-[#2D3E35] dark:text-[#D1DDD6]">
                  {message.recipientEmail || recipientDisplay}
                </span>
              </div>
              {message.cc && (
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#556A60] dark:text-[#A5B8AD] min-w-[50px]">
                    {t("email.cc")}
                  </span>
                  <span className="text-[#2D3E35] dark:text-[#D1DDD6]">
                    {message.cc}
                  </span>
                </div>
              )}
            </div>

            {/* Quick Reply Button */}
            {!isMe && onReply && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onReply(message);
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-bold border border-[#234235] shadow-xs transition-all cursor-pointer"
              >
                <Reply className="w-3.5 h-3.5" />
                <span>{t("email.reply_email")}</span>
              </button>
            )}
          </div>

          {/* Email Content Body */}
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] min-h-[100px] overflow-x-auto text-xs leading-relaxed text-[#11231B] dark:text-[#F2F7F4]">
            {message.html ? (
              <div
                className="email-html-content prose dark:prose-invert max-w-none text-xs"
                dangerouslySetInnerHTML={{ __html: message.html }}
              />
            ) : (
              <div className="whitespace-pre-wrap font-sans text-xs">
                {message.text || ""}
              </div>
            )}
          </div>

          {/* Attachment Preview Card */}
          {attachment && (
            <div className="p-3.5 rounded-xl bg-[#F8FAF7] dark:bg-[#0C1712] border border-[#DEE7DF] dark:border-[#1F382B] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] truncate">
                    {attachment.name || attachment.filename || t("email.attachments")}
                  </p>
                  {attachment.size && (
                    <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096]">
                      {attachment.size > 1024 * 1024
                        ? `${(attachment.size / 1024 / 1024).toFixed(1)} MB`
                        : `${Math.round(attachment.size / 1024)} KB`}
                    </p>
                  )}
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleDownloadAttachment(attachment)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white dark:bg-[#18362B] hover:bg-[#EBF1EB] text-xs font-bold text-[#184530] dark:text-[#B8F55C] border border-[#DEE7DF] dark:border-[#234235] shadow-2xs transition-all cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{t("common.download")}</span>
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
