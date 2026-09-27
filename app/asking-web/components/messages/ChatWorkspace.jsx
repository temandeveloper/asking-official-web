"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useAsking } from "../../data/AskingContext";
import ContactAvatar from "../shared/ContactAvatar";
import MarkdownRenderer from "../shared/MarkdownRenderer";
import { WhatsAppLogo, TelegramLogo, EmailLogo } from "../shared/ChannelBadge";
import {
  Send,
  Paperclip,
  Check,
  CheckCheck,
  Clock,
  SquarePen,
  Tickets,
  CalendarClock,
  Trash2,
  Reply,
  X,
  ChevronLeft,
  Bot,
  UserCheck,
  FileText,
  Download,
  NotepadText,
  Mail,
  ImageIcon,
  EllipsisVertical,
} from "lucide-react";
import EmailMessageRow from "./EmailMessageRow";
import EmailComposeDrawer from "./EmailComposeDrawer";
import { ChatThreadSkeleton } from "../common/daisySkeletons";
import { useTranslation } from "../../data/TranslationContext";

export default function ChatWorkspace({ onBackToList }) {
  const {
    activeConversation,
    sendMessage,
    replyingToMessage,
    setReplyingToMessage,
    templates,
    channelStatuses,
    handleQuickCreateTicketFromChat,
    toggleConversationHumanSupport,
    deleteConversation,
    isRemoteLoading,
    addToast,
  } = useAsking();
  const { language, t } = useTranslation();

  const [inputMessage, setInputMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isTemplateMenuOpen, setIsTemplateMenuOpen] = useState(false);
  const [isComposeDrawerOpen, setIsComposeDrawerOpen] = useState(false);
  const [composeData, setComposeData] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const fileInputRef = useRef(null);

  // Close mobile dropdown menu on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)) {
        setIsMobileMenuOpen(false);
      }
    }
    if (isMobileMenuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("touchstart", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  // Reset mobile menu when active conversation changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [activeConversation?.jid]);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversation?.messages]);

  // Focus input on active conversation change
  useEffect(() => {
    if (activeConversation) {
      inputRef.current?.focus();
    }
  }, [activeConversation?.jid]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      addToast("Ukuran berkas melebihi batas 10MB", "error");
      if (fileInputRef.current) fileInputRef.current.value = "";
      return;
    }

    const isImg = file.type.startsWith("image/");
    const previewUrl = isImg ? URL.createObjectURL(file) : null;

    setSelectedFile({
      name: file.name,
      size: file.size,
      type: isImg ? "image" : "document",
      previewUrl,
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
    addToast(`Berkas "${file.name}" siap dikirim`, "info");
  };

  const handleSend = () => {
    if (!isChannelConnected) return;
    if (!inputMessage.trim() && !selectedFile) return;

    const attachments = selectedFile ? [selectedFile] : [];
    sendMessage(inputMessage, attachments, replyingToMessage);

    setInputMessage("");
    setSelectedFile(null);
    setReplyingToMessage(null);
    setIsTemplateMenuOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isChannelConnected) {
        handleSend();
      }
    }
  };

  const handleInsertTemplate = (tmpl) => {
    const textReplaced = tmpl.content
      .replace("{name}", activeConversation.name.split(" ")[0])
      .replace("{ticketId}", "TKT-" + Math.floor(100 + Math.random() * 900))
      .replace("{time}", "14.00")
      .replace("{code}", "ask-demo")
      .replace("{issue}", "integrasi webhook");

    setInputMessage((prev) => (prev ? prev + "\n" + textReplaced : textReplaced));
    setIsTemplateMenuOpen(false);
    addToast(`Template "${tmpl.title}" disisipkan`, "info");
  };

  const handleSendEmail = (emailPayload) => {
    sendMessage(
      emailPayload.text,
      emailPayload.attachments,
      null,
      {
        subject: emailPayload.subject,
        html: emailPayload.html,
        cc: emailPayload.cc,
        recipientEmail: emailPayload.to,
      }
    );
    addToast(`Email ke "${emailPayload.to}" berhasil dikirim`, "success");
  };

  const formatMessageTime = (isoString) => {
    if (!isoString) return "";
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDateDivider = (isoString) => {
    if (!isoString) return t("common.today") || "Hari Ini";
    const d = new Date(isoString);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return t("common.today") || "Hari Ini";
    }
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    if (d.toDateString() === yesterday.toDateString()) {
      return t("common.yesterday") || "Kemarin";
    }
    return d.toLocaleDateString(language === "en" ? "en-US" : "id-ID", {
      weekday: "long",
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const isDifferentDate = (d1, d2) => {
    if (!d1 || !d2) return true;
    return new Date(d1).toDateString() !== new Date(d2).toDateString();
  };

  if (!activeConversation) {
    return (
      <div className="flex-1 h-full bg-[#F8FAF7] dark:bg-[#0C1712] flex flex-col items-center justify-center p-8 text-center select-none transition-colors duration-200">
        <div className="max-w-md space-y-4">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] border border-[#DEE7DF] dark:border-[#234235] flex items-center justify-center shadow-xs">
            <Bot className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h2 className="text-base font-bold text-[#11231B] dark:text-[#F2F7F4]">
              {t("messages.empty_title") || "Pilih Percakapan"}
            </h2>
            <p className="text-xs text-[#556A60] dark:text-[#A5B8AD] leading-relaxed">
              {t("messages.empty_desc") || "Pilih salah satu obrolan dari daftar untuk melihat dan membalas pesan masuk omnichannel secara real-time."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const isTg = activeConversation.channel === "telegram" || activeConversation.jid?.startsWith("tg_");
  const isEmail = activeConversation.channel === "email" || activeConversation.jid?.startsWith("email:");

  const currentChannelStatus = isEmail
    ? channelStatuses?.email || "close"
    : isTg
      ? channelStatuses?.telegram || "close"
      : channelStatuses?.whatsapp || "close";

  const isChannelConnected = currentChannelStatus === "open";

  const inputPlaceholder = useMemo(() => {
    if (isChannelConnected) {
      return isEmail
        ? t("messages.reply_placeholder_email") || "Balas via email..."
        : t("messages.reply_placeholder_chat") || "Ketik pesan...";
    }
    if (isEmail) {
      if (currentChannelStatus === "connecting") return t("messages.placeholder_connecting") || "Menghubungkan ke saluran Email...";
      return "Email Terputus - Hubungkan akun di menu Channels";
    }
    if (isTg) {
      if (currentChannelStatus === "connecting") return t("messages.placeholder_connecting") || "Menghubungkan ke saluran Telegram...";
      return "Telegram Terputus - Hubungkan akun di menu Channels";
    }
    // WhatsApp
    if (currentChannelStatus === "connecting") {
      return t("messages.placeholder_connecting") || "Sedang menghubungkan ke saluran pesan... Mohon tunggu.";
    }
    if (currentChannelStatus === "reconnecting") {
      return t("messages.placeholder_reconnecting") || "Menghubungkan ulang sesi saluran pesan... Mohon tunggu.";
    }
    if (currentChannelStatus === "qr") {
      return t("messages.placeholder_qr") || "Silakan hubungkan saluran pesan di menu Message Channels.";
    }
    return t("messages.placeholder_disconnected") || "Saluran pesan belum terhubung. Silakan hubungkan saluran di menu Message Channels.";
  }, [isChannelConnected, isEmail, isTg, currentChannelStatus, t]);

  return (
    <div className="flex-1 h-full bg-[#F8FAF7] dark:bg-[#0C1712] flex flex-col min-w-0 transition-colors duration-200 relative">
      {/* Top Chat Header (h-16) */}
      <div className="h-16 px-4 sm:px-6 bg-white dark:bg-[#12241C] border-b border-[#DEE7DF] dark:border-[#1F382B] flex items-center justify-between shrink-0 select-none z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile Back Button */}
          {onBackToList && (
            <button
              type="button"
              onClick={onBackToList}
              className="lg:hidden p-1.5 rounded-lg text-[#6B8075] hover:text-[#11231B] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}

          <div className="relative shrink-0">
            <ContactAvatar
              seed={activeConversation.name}
              className="w-10 h-10 rounded-full"
              alt={activeConversation.name}
            />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 min-w-0">
              {isTg ? (
                <TelegramLogo className="w-4 h-4 shrink-0" />
              ) : isEmail ? (
                <Mail className="w-4 h-4 text-sky-500 shrink-0" />
              ) : (
                <WhatsAppLogo className="w-4 h-4 shrink-0" />
              )}
              <h2 className="text-sm font-bold text-[#11231B] dark:text-[#F2F7F4] truncate">
                {activeConversation.name}
              </h2>
            </div>
            {activeConversation.isTyping ? (
              <p className="text-[11px] text-[#22C55E] dark:text-[#B8F55C] font-semibold truncate animate-pulse">
                {t("messages.typing") || "sedang mengetik..."}
              </p>
            ) : !isChannelConnected ? (
              <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold truncate flex items-center gap-1.5">
                <span className={`w-1.5 h-1.5 rounded-full ${
                  currentChannelStatus === "reconnecting" || currentChannelStatus === "connecting"
                    ? "bg-amber-400 animate-ping"
                    : "bg-rose-500"
                }`} />
                <span>
                  {currentChannelStatus === "reconnecting"
                    ? (t("channels.status_reconnecting") || "Menghubungkan ulang...")
                    : currentChannelStatus === "connecting"
                      ? (t("channels.status_connecting") || "Menghubungkan...")
                      : (t("channels.status_close") || "Saluran Terputus")}
                </span>
              </p>
            ) : (
              <p className="text-[11px] text-[#6B8075] dark:text-[#8EA096] font-medium truncate">
                {isEmail
                  ? activeConversation.email || "email@pelanggan.com"
                  : isTg
                    ? "Telegram Chat"
                    : activeConversation.phone || "+62 812-9876-5432"}
              </p>
            )}
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Desktop / Tablet Buttons (>= sm) */}
          <div className="hidden sm:flex items-center gap-1.5 sm:gap-2">
            {/* Human Support vs AI Agent Mode Toggle */}
            {!isEmail && (
              <button
                type="button"
                onClick={() => toggleConversationHumanSupport(activeConversation.jid)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${activeConversation.isHumanSupport
                    ? "bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border-amber-300 dark:border-amber-800/60 shadow-xs"
                    : "bg-[#EBF1EB] hover:bg-[#DCE6DD] dark:bg-[#18362B] dark:hover:bg-[#234A38] text-[#184530] dark:text-[#B8F55C] border-[#DEE7DF]/60 dark:border-[#1F382B]"
                  }`}
                title={
                  activeConversation.isHumanSupport
                    ? (t("messages.switch_to_ai") || "Support by Human AKTIF. Klik untuk mengaktifkan AI.")
                    : (t("messages.switch_to_manual") || "AI Agent AKTIF. Klik untuk beralih ke Mode Manual.")
                }
              >
                {activeConversation.isHumanSupport ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                    <span>{t("messages.human_mode") || "Human Mode"}</span>
                  </>
                ) : (
                  <>
                    <Bot className="w-3.5 h-3.5 text-[#184530] dark:text-[#B8F55C]" />
                    <span>{t("messages.ai_agent_mode") || "AI Agent Mode"}</span>
                  </>
                )}
              </button>
            )}

            {/* Quick Create CRM Ticket from Chat */}
            <button
              type="button"
              onClick={() =>
                handleQuickCreateTicketFromChat(
                  activeConversation,
                  activeConversation.lastMessage
                )
              }
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#EBF1EB] hover:bg-[#DCE6DD] dark:bg-[#18362B] dark:hover:bg-[#234A38] text-[#184530] dark:text-[#B8F55C] text-xs font-semibold transition-colors cursor-pointer border border-[#DEE7DF]/60 dark:border-[#1F382B]"
              title={t("messages.create_ticket_btn") || "Buat Tiket Baru"}
            >
              <Tickets className="w-3.5 h-3.5 text-[#184530] dark:text-[#B8F55C]" />
              <span>{t("messages.create_ticket_btn") || "Buat Tiket Baru"}</span>
            </button>

            {/* Delete Conversation */}
            <button
              type="button"
              onClick={() => {
                if (
                  confirm(
                    t("messages.confirm_delete_chat", { name: activeConversation.name }) ||
                    `Hapus riwayat percakapan dengan ${activeConversation.name}?`
                  )
                ) {
                  deleteConversation(activeConversation.jid);
                }
              }}
              className="p-2 rounded-xl text-[#6B8075] hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              title={t("messages.delete_conversation") || "Hapus Percakapan"}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Dropdown Menu (< sm) with EllipsisVertical */}
          <div ref={mobileMenuRef} className="sm:hidden relative">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="p-2 rounded-xl text-[#556A60] dark:text-[#A5B8AD] hover:text-[#11231B] dark:hover:text-[#F2F7F4] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer border border-transparent hover:border-[#DEE7DF] dark:hover:border-[#1F382B]"
              title={t("messages.conversation_options") || "Opsi Percakapan"}
              aria-label={t("messages.conversation_options") || "Opsi Percakapan"}
            >
              <EllipsisVertical className="w-5 h-5" />
            </button>

            {isMobileMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-60 rounded-2xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-2xl p-1.5 z-50 space-y-1 animate-in fade-in zoom-in-95 select-none">
                {/* 1. Toggle AI Agent vs Human Support */}
                {!isEmail && (
                  <button
                    type="button"
                    onClick={() => {
                      toggleConversationHumanSupport(activeConversation.jid);
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer text-left group"
                  >
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EBF1EB] dark:bg-[#18362B] group-hover:bg-white dark:group-hover:bg-[#12241C] shrink-0 transition-colors">
                      {activeConversation.isHumanSupport ? (
                        <UserCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                      ) : (
                        <Bot className="w-4 h-4 text-[#184530] dark:text-[#B8F55C]" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] leading-tight">
                        {activeConversation.isHumanSupport
                          ? (t("messages.human_mode_active") || "Mode Human Support")
                          : (t("messages.ai_agent_mode_active") || "Mode AI Agent")}
                      </p>
                      <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096] truncate mt-0.5">
                        {activeConversation.isHumanSupport
                          ? (t("messages.switch_to_ai") || "Klik untuk beralih ke AI")
                          : (t("messages.switch_to_manual") || "Klik untuk alihkan ke Manual")}
                      </p>
                    </div>
                  </button>
                )}

                {/* 2. Buat Tiket Baru */}
                <button
                  type="button"
                  onClick={() => {
                    handleQuickCreateTicketFromChat(
                      activeConversation,
                      activeConversation.lastMessage
                    );
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer text-left group"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-[#EBF1EB] dark:bg-[#18362B] group-hover:bg-white dark:group-hover:bg-[#12241C] shrink-0 transition-colors">
                    <Tickets className="w-4 h-4 text-[#184530] dark:text-[#B8F55C]" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] leading-tight">
                      {t("messages.create_ticket_btn") || "Buat Tiket Baru"}
                    </p>
                    <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096] truncate mt-0.5">
                      {t("messages.convert_to_crm") || "Konversi ke tiket CRM"}
                    </p>
                  </div>
                </button>

                <div className="h-px bg-[#EEF3EF] dark:bg-[#1F382B] my-1" />

                {/* 3. Hapus Percakapan */}
                <button
                  type="button"
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    if (
                      confirm(
                        t("messages.confirm_delete_chat", { name: activeConversation.name }) ||
                        `Hapus riwayat percakapan dengan ${activeConversation.name}?`
                      )
                    ) {
                      deleteConversation(activeConversation.jid);
                    }
                  }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 transition-colors cursor-pointer text-left group"
                >
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center bg-rose-100/70 dark:bg-rose-950/50 group-hover:bg-rose-200 dark:group-hover:bg-rose-900/60 shrink-0 transition-colors">
                    <Trash2 className="w-4 h-4 text-rose-600 dark:text-rose-400" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold leading-tight">
                      {t("messages.delete_conversation") || "Hapus Percakapan"}
                    </p>
                    <p className="text-[10px] text-rose-500/80 dark:text-rose-400/70 truncate mt-0.5">
                      {t("messages.delete_chat_subtext") || "Hapus riwayat obrolan"}
                    </p>
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Messages Stream Area */}
      <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4 scrollbar-thin-subtle">
        {isRemoteLoading ? (
          <ChatThreadSkeleton />
        ) : isEmail ? (
          <div className="space-y-3 max-w-4xl mx-auto w-full">
            {(activeConversation.messages || []).map((msg) => (
              <EmailMessageRow
                key={msg.id}
                message={msg}
                onReply={(replyMsg) => {
                  setComposeData({
                    to:
                      replyMsg.senderEmail ||
                      activeConversation.email ||
                      activeConversation.jid?.replace(/^email:/, ""),
                    subject: replyMsg.subject?.startsWith("Re:")
                      ? replyMsg.subject
                      : `Re: ${replyMsg.subject || ""}`,
                  });
                  setIsComposeDrawerOpen(true);
                }}
              />
            ))}
          </div>
        ) : (
          (activeConversation.messages || []).map((msg, index) => {
            const isMe = msg.isMe || msg.fromMe;
            const prevMsg =
              index > 0 ? activeConversation.messages[index - 1] : null;
            const showDateDivider =
              index === 0 || isDifferentDate(prevMsg?.timestamp, msg.timestamp);

            return (
              <div key={msg.id || index} className="space-y-4">
                {/* Date divider pill */}
                {showDateDivider && msg.timestamp && (
                  <div className="flex items-center justify-center my-4">
                    <div className="flex items-center gap-3 w-full max-w-lg px-4">
                      <div className="flex-1 h-px bg-[#DEE7DF] dark:bg-[#1F382B]" />
                      <span className="px-3 py-1 rounded-full bg-[#EBF1EB] dark:bg-[#18362B] border border-[#DEE7DF] dark:border-[#234235] text-[10.5px] font-semibold text-[#556A60] dark:text-[#A5B8AD] shadow-2xs">
                        {formatDateDivider(msg.timestamp)}
                      </span>
                      <div className="flex-1 h-px bg-[#DEE7DF] dark:bg-[#1F382B]" />
                    </div>
                  </div>
                )}

                {/* Message row */}
                <div
                  className={`flex flex-col group ${isMe ? "items-end" : "items-start"
                    }`}
                >
                  <div
                    className={`flex items-start gap-2 max-w-xl ${isMe ? "flex-row-reverse" : "flex-row"
                      }`}
                  >
                    {/* Inbound Contact Avatar */}
                    {!isMe && (
                      <ContactAvatar
                        seed={activeConversation.name}
                        className="w-8 h-8 rounded-full shrink-0 mt-1"
                        alt={activeConversation.name}
                      />
                    )}

                    <div className="space-y-1">
                      {!isMe && (
                        <p className="text-[11px] font-bold text-[#2D3E35] dark:text-[#D1DDD6] pl-1">
                          {activeConversation.name}
                        </p>
                      )}

                      <div className="relative group/bubble flex items-center gap-2">
                        {/* Actual Chat Bubble */}
                        <div
                          className={`rounded-2xl border shadow-2xs text-xs leading-relaxed break-words max-w-lg p-3 ${isMe
                              ? "bg-[#12281F] text-white border-[#12281F] dark:bg-[#18362B] dark:border-[#234235] rounded-tr-none"
                              : "bg-white dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] rounded-tl-none"
                            }`}
                        >
                          {/* Quoted Reply Banner inside bubble */}
                          {msg.replyTo && (
                            <div
                              className={`mb-2 p-2 rounded-xl text-[11px] border-l-2 leading-tight ${isMe
                                  ? "bg-[#1C3B2E] border-[#B8F55C] text-[#D1DDD6]"
                                  : "bg-[#F8FAF7] dark:bg-[#12241C] border-[#184530] dark:border-[#B8F55C] text-[#4A5F54] dark:text-[#A5B8AD]"
                                }`}
                            >
                              <p className="font-semibold opacity-90">Membalas:</p>
                              <p className="truncate opacity-80 mt-0.5">
                                {msg.replyTo.text}
                              </p>
                            </div>
                          )}

                          {/* Attachments rendering */}
                          {msg.attachments &&
                            msg.attachments.map((att, attIdx) => {
                              const isImg = att.type === "image" || att.previewUrl;
                              return (
                                <div
                                  key={attIdx}
                                  className={`rounded-xl border mb-2 overflow-hidden max-w-sm ${isMe
                                      ? "bg-white/10 border-white/20 text-white"
                                      : "bg-[#F8FAF7] dark:bg-[#12241C] border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4]"
                                    }`}
                                >
                                  {isImg && (att.previewUrl || att.thumbnailBase64) && (
                                    <div className="w-full max-h-48 overflow-hidden bg-black/10">
                                      <img
                                        src={att.previewUrl || att.thumbnailBase64}
                                        alt={att.name || "Image"}
                                        className="w-full h-auto object-cover max-h-48 hover:scale-102 transition-transform cursor-pointer"
                                        onClick={() => window.open(att.previewUrl || att.thumbnailBase64, "_blank")}
                                      />
                                    </div>
                                  )}
                                  <div className="p-2.5 flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-[#EBF1EB] dark:bg-[#18362B] flex items-center justify-center shrink-0 text-[#184530] dark:text-[#B8F55C]">
                                      {isImg ? (
                                        <ImageIcon className="w-4 h-4" />
                                      ) : (
                                        <FileText className="w-4 h-4" />
                                      )}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <p className="text-xs font-bold truncate leading-tight">
                                        {att.name || t("messages.file_attachment")}
                                      </p>
                                      <p
                                        className={`text-[10px] mt-0.5 ${isMe
                                            ? "text-white/70"
                                            : "text-[#6B8075] dark:text-[#8EA096]"
                                          }`}
                                      >
                                        {att.size
                                          ? att.size > 1024 * 1024
                                            ? `${(att.size / 1024 / 1024).toFixed(1)} MB`
                                            : `${Math.round(att.size / 1024)} KB`
                                          : t("common.details")}
                                      </p>
                                    </div>
                                    <button
                                      type="button"
                                      onClick={() => {
                                        if (att.previewUrl) {
                                          const a = document.createElement("a");
                                          a.href = att.previewUrl;
                                          a.download = att.name || "download";
                                          a.click();
                                        } else {
                                          addToast(`${t("common.download")} ${att.name || ""}...`, "info");
                                        }
                                      }}
                                      className={`p-1.5 rounded-lg transition-colors cursor-pointer shrink-0 ${isMe
                                          ? "bg-white/20 hover:bg-white/30 text-white"
                                          : "bg-[#EBF1EB] dark:bg-[#18362B] hover:bg-[#D5E6D8] text-[#184530] dark:text-[#B8F55C]"
                                        }`}
                                      title={t("messages.download_file")}
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                    </button>
                                  </div>
                                </div>
                              );
                            })}

                          {/* Text Content */}
                          {Boolean(msg.text) && (
                            <MarkdownRenderer
                              content={msg.text}
                              className={isMe ? "text-white" : ""}
                            />
                          )}
                        </div>

                        {/* Hover Reply Button */}
                        <button
                          type="button"
                          onClick={() => setReplyingToMessage(msg)}
                          className="opacity-0 group-hover/bubble:opacity-100 p-1.5 rounded-full bg-[#EBF1EB] dark:bg-[#18362B] border border-[#DEE7DF] dark:border-[#1F382B] text-[#6B8075] dark:text-[#A5B8AD] hover:text-[#12281F] hover:bg-white dark:hover:bg-[#12241C] transition-all shadow-xs cursor-pointer shrink-0"
                          title={t("messages.reply_action")}
                        >
                          <Reply className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Timestamp & Status Icon */}
                      <div
                        className={`flex items-center gap-1 px-1 text-[10px] font-medium ${isMe
                            ? "justify-end text-[#8EA096] dark:text-[#6E8578]"
                            : "justify-start text-[#8EA096]"
                          }`}
                      >
                        <span>{formatMessageTime(msg.timestamp)}</span>
                        {isMe && (
                          <span>
                            {msg.status === "sending" ? (
                              <Clock className="w-3 h-3 text-[#8EA096] animate-spin" />
                            ) : msg.status === "read" ? (
                              <CheckCheck
                                className="w-3.5 h-3.5 text-[#22C55E]"
                                title={t("common.read") || "Read"}
                              />
                            ) : msg.status === "delivered" ? (
                              <CheckCheck
                                className="w-3.5 h-3.5 text-[#8EA096] dark:text-[#6E8578]"
                                title={t("common.delivered") || "Delivered"}
                              />
                            ) : (
                              <Check
                                className="w-3.5 h-3.5 text-[#8EA096] dark:text-[#6E8578]"
                                title={t("common.sent") || "Sent"}
                              />
                            )}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div className="h-6 shrink-0" />
        <div ref={messagesEndRef} />
      </div>

      {/* Email Bar vs Chat Floating Pill Composer */}
      {isEmail ? (
        <div className="p-3 sm:p-4 bg-white/90 dark:bg-[#12241C]/90 backdrop-blur-md border-t border-[#DEE7DF] dark:border-[#1F382B] shrink-0">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-3 flex-wrap sm:flex-nowrap">
            <div className="flex items-center gap-2.5 text-xs text-[#556A60] dark:text-[#A5B8AD] min-w-0">
              <Mail className="w-4 h-4 text-sky-500 shrink-0" />
              <span className="truncate">
                {t("messages.email_conversation_with")}{" "}
                <strong className="text-[#11231B] dark:text-[#F2F7F4]">
                  {activeConversation.email || activeConversation.jid?.replace(/^email:/, "")}
                </strong>
              </span>
            </div>

            <button
              type="button"
              disabled={!isChannelConnected}
              onClick={() => {
                setComposeData({
                  to: activeConversation.email || activeConversation.jid?.replace(/^email:/, ""),
                  subject: "",
                });
                setIsComposeDrawerOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] text-white dark:bg-[#18362B] dark:text-[#B8F55C] text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer border border-[#234235] shrink-0 disabled:opacity-40 disabled:cursor-not-allowed"
              title={isChannelConnected ? t("messages.compose_email_btn") : inputPlaceholder}
            >
              <SquarePen className="w-4 h-4 text-[#B8F55C]" />
              <span>{t("messages.compose_email_btn")}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2.5 sm:p-4 bg-white/90 dark:bg-[#12241C]/90 backdrop-blur-md border-t border-[#DEE7DF] dark:border-[#1F382B] shrink-0">
          {/* Reply Context Strip */}
          {replyingToMessage && (
            <div className="max-w-4xl mx-auto mb-2 px-4 py-2 rounded-2xl bg-[#EBF1EB] dark:bg-[#18362B] border-l-4 border-l-[#12281F] dark:border-l-[#B8F55C] border border-[#DEE7DF] dark:border-[#1F382B] flex items-center justify-between shadow-2xs animate-in slide-in-from-bottom-2">
              <div className="min-w-0 pr-2">
                <span className="text-[10px] font-bold text-[#184530] dark:text-[#B8F55C] uppercase">
                  {t("messages.replying_to")}
                </span>
                <p className="text-xs text-[#2D3E35] dark:text-[#D1DDD6] truncate font-medium mt-0.5">
                  {replyingToMessage.text || t("messages.file_attachment")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setReplyingToMessage(null)}
                className="p-1 rounded-lg text-[#6B8075] hover:text-[#11231B] hover:bg-white/60 dark:hover:bg-[#12241C] transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Selected Attachment Preview Strip */}
          {selectedFile && (
            <div className="max-w-4xl mx-auto mb-2 px-4 py-2 rounded-2xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-sm flex items-center justify-between animate-in slide-in-from-bottom-2">
              <div className="flex items-center gap-3 min-w-0">
                {selectedFile.previewUrl ? (
                  <img
                    src={selectedFile.previewUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-[#DEE7DF] dark:border-[#1F382B] shrink-0"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-lg bg-[#EBF1EB] dark:bg-[#18362B] flex items-center justify-center text-[#184530] dark:text-[#B8F55C] shrink-0">
                    <FileText className="w-5 h-5 text-rose-500" />
                  </div>
                )}
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-[#11231B] dark:text-[#F2F7F4] truncate">
                    {selectedFile.name}
                  </p>
                  <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096]">
                    {selectedFile.size > 1024 * 1024
                      ? `${(selectedFile.size / 1024 / 1024).toFixed(1)} MB`
                      : `${Math.round(selectedFile.size / 1024)} KB`}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedFile(null)}
                className="p-1.5 rounded-lg text-[#6B8075] hover:text-[#11231B] dark:hover:text-[#F2F7F4] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer"
                title={t("messages.cancel_attachment")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Floating Input Pill */}
          <div
            className={`max-w-4xl mx-auto flex items-center justify-between gap-2 p-1.5 pl-3 rounded-full border transition-all shadow-xs relative ${
              isChannelConnected
                ? "border-[#DEE7DF] dark:border-[#1F382B] bg-[#F8FAF7] dark:bg-[#0C1712]"
                : "bg-[#F0F4F1] dark:bg-[#14261D] border-amber-300/70 dark:border-amber-700/60 opacity-90"
            }`}
          >
            {/* Hidden Native File Input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.csv"
              className="hidden"
              onChange={handleFileSelect}
            />

            {/* Paperclip Button for Attachments */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={!isChannelConnected}
              className="p-2 rounded-full text-[#6B8075] hover:text-[#11231B] dark:text-[#8EA096] dark:hover:text-[#F2F7F4] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
              title={isChannelConnected ? t("messages.attach_tooltip") : inputPlaceholder}
            >
              <Paperclip className="w-4 h-4" />
            </button>

            {/* Quick Template Picker Button & Popover */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsTemplateMenuOpen((prev) => !prev)}
                disabled={!isChannelConnected}
                className="p-2 rounded-full text-[#6B8075] hover:text-[#11231B] dark:text-[#8EA096] dark:hover:text-[#F2F7F4] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shrink-0"
                title={isChannelConnected ? t("messages.template_tooltip") : inputPlaceholder}
              >
                <NotepadText className="w-4 h-4" />
              </button>

              {isTemplateMenuOpen && isChannelConnected && (
                <div className="absolute bottom-full left-0 mb-3 w-72 max-w-[calc(100vw-3rem)] max-h-60 overflow-y-auto bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] rounded-2xl shadow-xl p-2 z-30 space-y-1 animate-in fade-in zoom-in-95 scrollbar-thin-subtle">
                  <div className="px-2 py-1 text-[10px] font-bold text-[#6B8075] dark:text-[#8EA096] uppercase">
                    {t("messages.quick_templates_title")}
                  </div>
                  {(templates || []).map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => handleInsertTemplate(tpl)}
                      className="w-full text-left p-2 rounded-xl hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer"
                    >
                      <p className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4]">
                        {tpl.title}
                      </p>
                      <p className="text-[11px] text-[#4A5F54] dark:text-[#A5B8AD] truncate mt-0.5">
                        {tpl.content}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Text Input */}
            <input
              ref={inputRef}
              data-testid="chat-message-input"
              type="text"
              placeholder={inputPlaceholder}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={!isChannelConnected}
              className="flex-1 text-xs bg-transparent text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] dark:placeholder-[#6E8578] focus:outline-none px-2 disabled:cursor-not-allowed disabled:text-[#8EA096] dark:disabled:text-[#6E8578]"
            />

            {/* Send Button */}
            <button
              type="button"
              onClick={handleSend}
              disabled={!isChannelConnected || (!inputMessage.trim() && !selectedFile)}
              className="w-9 h-9 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] dark:bg-[#18362B] dark:text-[#B8F55C] disabled:opacity-30 disabled:cursor-not-allowed text-white flex items-center justify-center shrink-0 shadow-xs transition-all active:scale-95 cursor-pointer border border-[#234235]"
              title={isChannelConnected ? t("messages.send_tooltip") : inputPlaceholder}
            >
              <Send className="w-4 h-4 text-[#B8F55C]" />
            </button>
          </div>
        </div>
      )}

      {/* Email Compose Drawer */}
      <EmailComposeDrawer
        isOpen={isComposeDrawerOpen}
        onClose={() => setIsComposeDrawerOpen(false)}
        initialData={composeData}
        recipientEmail={activeConversation.email || activeConversation.jid?.replace(/^email:/, "")}
        onSendEmail={handleSendEmail}
      />
    </div>
  );
}
