"use client";

import React, { useState, useEffect, useRef } from "react";
import { useAsking } from "../../data/AskingContext";
import { useTranslation } from "../../data/TranslationContext";
import { WhatsAppLogo, TelegramLogo, EmailLogo } from "../shared/ChannelBadge";
import {
  X,
  Trash2,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Paperclip,
  Download,
  FileText,
  Plus,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Undo,
  Redo,
  ClipboardList,
  Clock,
  SquarePen,
  ImageIcon,
  Copy,
  Check,
} from "lucide-react";
import { CATEGORY_OPTIONS, STATUS_OPTIONS, PRIORITY_OPTIONS } from "../../constants/ticketConstants";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Placeholder from "@tiptap/extension-placeholder";
import { Markdown } from "@tiptap/markdown";

const getDeadlineParts = (deadline) => {
  const value = String(deadline || "");
  const match = value.match(/^(\d{4}-\d{2}-\d{2})(?:[T\s](\d{2}:\d{2}))?/);
  return {
    date: match?.[1] || "",
    time: match?.[2] || "",
  };
};

const formatFileSize = (bytes) => {
  if (!bytes || bytes === 0) return "0 B";
  if (bytes > 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${Math.round(bytes / 1024)} KB`;
};

const isImageAttachment = (item) =>
  item.type?.startsWith("image/") ||
  item.name?.match(/\.(jpg|jpeg|png|webp|gif)$/i) ||
  Boolean(item.thumbnailBase64);

function TicketAttachmentItem({
  item,
}) {
  const { t } = useTranslation();
  const isImg = isImageAttachment(item);
  const preview = item.previewUrl || item.thumbnailBase64 || item.url || item.dataBase64;
  const downloadUrl =
    item.thumbnailBase64 || item.previewUrl || item.url || item.dataBase64;

  return (
    <div
      data-testid={`attachment-item-${item.name || "file"}`}
      className="flex items-center justify-between p-2.5 rounded-xl border border-[#DEE7DF] dark:border-[#1F382B] bg-white dark:bg-[#162B21] shadow-2xs group hover:border-[#CFE2D3] dark:hover:border-[#234235] transition-all"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        {isImg && preview ? (
          <img
            src={preview}
            alt={item.name || "Attachment"}
            className="w-8 h-8 rounded-lg object-cover border border-[#DEE7DF] dark:border-[#1F382B] shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-lg bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] flex items-center justify-center shrink-0">
            {isImg ? <ImageIcon className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs font-semibold text-[#11231B] dark:text-[#F2F7F4] truncate max-w-[180px] sm:max-w-[240px]">
            {item.name || t("messages.file_attachment") || "Attachment"}
          </p>
          <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096]">
            {formatFileSize(item.size)}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        {downloadUrl && isImg && (
          <button
            type="button"
            onClick={() => {
              const a = document.createElement("a");
              a.href = downloadUrl;
              a.download = item.name || "attachment";
              a.click();
            }}
            className="p-1.5 rounded-lg text-[#6B8075] hover:text-[#11231B] dark:text-[#8EA096] dark:hover:text-[#F2F7F4] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer"
            title={t("messages.download_file")}
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  );
}

function TicketDrawerForm({
  editingTicket,
  initialContact,
  readOnlyForm = false,
  onClose,
  onSwitchToEdit,
}) {
  const { t, language } = useTranslation();
  const { saveTicket, deleteTicket, appendTicketNote, addToast, getNextTicketId } = useAsking();

  const [ticketId, setTicketId] = useState(() => editingTicket?.id || "");
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!editingTicket?.id && !ticketId && getNextTicketId) {
      getNextTicketId().then((nextId) => {
        if (nextId) setTicketId(nextId);
      });
    }
  }, [editingTicket, ticketId, getNextTicketId]);

  const handleCopyTicketId = async () => {
    if (!ticketId) return;
    try {
      await navigator.clipboard.writeText(ticketId);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
      addToast(t("tickets.copied_id", { id: ticketId }) || `ID Tiket #${ticketId} tersalin!`, "info");
    } catch {
      // ignore
    }
  };

  const [ticketChannel, setTicketChannel] = useState(
    () =>
      editingTicket?.channel ||
      initialContact?.channel ||
      (initialContact?.jid?.startsWith("tg_") ? "telegram" : "whatsapp")
  );
  const [ticketTitle, setTicketTitle] = useState(() => editingTicket?.title || "");
  const [ticketCategory, setTicketCategory] = useState(() => editingTicket?.category || "support");
  const [ticketStatus, setTicketStatus] = useState(() => editingTicket?.status || "New");
  const [ticketPriority, setTicketPriority] = useState(() => editingTicket?.priority || "medium");
  const [ticketContactName, setTicketContactName] = useState(
    () => editingTicket?.contactName || initialContact?.contactName || initialContact?.name || ""
  );
  const [ticketContactPhone, setTicketContactPhone] = useState(
    () => editingTicket?.contactPhone || editingTicket?.contactEmail || initialContact?.contactPhone || initialContact?.phone || ""
  );

  const initialDeadline = getDeadlineParts(editingTicket?.deadline);
  const [ticketDeadlineDate, setTicketDeadlineDate] = useState(
    initialDeadline.date || ""
  );
  const [ticketDeadlineTime, setTicketDeadlineTime] = useState(
    initialDeadline.time || ""
  );
  const [ticketDescription, setTicketDescription] = useState(
    () => editingTicket?.description || ""
  );
  const [ticketAttachments, setTicketAttachments] = useState(
    () => (Array.isArray(editingTicket?.attach) ? editingTicket.attach : Array.isArray(editingTicket?.attachments) ? editingTicket.attachments : [])
  );
  const fileInputRef = useRef(null);

  // Tiptap Rich Text Editor Setup for Ticket Description
  const editor = useEditor({
    immediatelyRender: false,
    editable: !readOnlyForm,
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Underline,
      Placeholder.configure({
        placeholder:
          t("tickets.drawer_desc_ph") ||
          "Jelaskan rincian keluhan pelanggan, langkah investigasi, atau catatan penyelesaian...",
      }),
      Markdown,
    ],
    content: editingTicket?.description || "",
    contentType: "markdown",
    editorProps: {
      attributes: {
        class:
          "tiptap prose dark:prose-invert max-w-none min-h-[130px] max-h-[220px] overflow-y-auto px-3.5 py-2.5 text-xs leading-relaxed focus:outline-none font-sans",
      },
    },
    onUpdate: ({ editor: curEditor }) => {
      const mdContent = curEditor.getMarkdown();
      setTicketDescription(mdContent);
    },
  });

  useEffect(() => {
    if (editor) {
      editor.setEditable(!readOnlyForm);
    }
  }, [editor, readOnlyForm]);

  useEffect(() => {
    if (editor && editingTicket?.description && editor.isEmpty) {
      editor.commands.setContent(editingTicket.description, {
        contentType: "markdown",
      });
    }
  }, [editor, editingTicket?.description]);

  // Activity Log & Note Modal State
  const [activity, setActivity] = useState(() => editingTicket?.activity || []);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [manualNote, setManualNote] = useState("");

  const handleAddFiles = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const newAttachments = files.map((f) => {
      const isImg = f.type.startsWith("image/");
      return {
        name: f.name,
        size: f.size,
        type: f.type || "document",
        previewUrl: isImg ? URL.createObjectURL(f) : null,
      };
    });

    setTicketAttachments((prev) => [...prev, ...newAttachments]);
    if (fileInputRef.current) fileInputRef.current.value = "";
    addToast(`${files.length} ${t("tickets.attachments_title")}`, "info");
  };

  const handleRemoveAttachment = (idxToRemove) => {
    if (readOnlyForm) return;
    setTicketAttachments((prev) => prev.filter((_, idx) => idx !== idxToRemove));
  };

  const handleAddNoteSubmit = () => {
    if (!manualNote.trim()) return;
    if (editingTicket?.id) {
      appendTicketNote(editingTicket.id, manualNote.trim());
    } else {
      const noteEntry = {
        type: "note",
        description: manualNote.trim(),
        timestamp: Date.now(),
      };
      setActivity((prev) => [...prev, noteEntry]);
    }
    setManualNote("");
    setIsNoteModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (readOnlyForm) return;

    if (!ticketTitle.trim()) {
      addToast(`${t("tickets.drawer_title")} ${t("common.required")}`, "error");
      return;
    }

    const fullDeadline = ticketDeadlineDate
      ? ticketDeadlineTime
        ? `${ticketDeadlineDate} ${ticketDeadlineTime}`
        : ticketDeadlineDate
      : "";

    const payload = {
      ...(editingTicket || {}),
      id: ticketId || editingTicket?.id,
      title: ticketTitle.trim(),
      category: ticketCategory,
      status: ticketStatus,
      priority: ticketPriority,
      channel: ticketChannel,
      contactName: ticketContactName.trim() || "Direct Client",
      contactPhone: ticketContactPhone.trim(),
      deadline: fullDeadline,
      description: ticketDescription.trim(),
      attach: ticketAttachments,
      attachments: ticketAttachments,
      activity,
    };

    saveTicket(payload, Boolean(editingTicket));
  };

  const handleDelete = () => {
    if (!editingTicket) return;
    if (confirm(t("tickets.delete_confirm", { id: editingTicket.id, title: editingTicket.title }))) {
      deleteTicket(editingTicket.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex-1 flex flex-col min-h-0">
      <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 scrollbar-thin-subtle">
        {/* Field 1: Ticket ID + Category */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6] mb-1">
              {t("tickets.col_id") || "ID Tiket"}
            </label>
            <div className="relative flex items-center">
              <input
                type="text"
                value={ticketId}
                readOnly
                className="w-full pl-3 pr-8 py-2 rounded-xl border border-[#DEE7DF] dark:border-[#1F382B] bg-[#F8FAF7] dark:bg-[#162B21] text-xs font-mono font-bold text-[#6B8075] dark:text-[#8EA096] focus:outline-none cursor-default"
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  type="button"
                  onClick={handleCopyTicketId}
                  className="p-1 hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] rounded text-[#6B8075] hover:text-[#11231B] transition-colors cursor-pointer"
                  title={t("tickets.copy_id") || "Salin ID"}
                >
                  {isCopied ? (
                    <Check className="w-3 h-3 text-[#22C55E]" />
                  ) : (
                    <Copy className="w-3 h-3" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6] mb-1">
              {t("tickets.col_category") || "Kategori"}
            </label>
            <div className="relative">
              <select
                value={ticketCategory}
                disabled={readOnlyForm}
                onChange={(e) => setTicketCategory(e.target.value)}
                className={`w-full pl-3.5 pr-8 py-2 rounded-xl border text-xs font-semibold text-[#11231B] dark:text-[#F2F7F4] appearance-none focus:outline-none capitalize ${
                  readOnlyForm
                    ? "bg-[#EBF1EB] dark:bg-[#18362B] border-[#DEE7DF] dark:border-[#1F382B] cursor-default opacity-80"
                    : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] focus:border-[#12281F] dark:focus:border-[#B8F55C] cursor-pointer"
                }`}
              >
                {CATEGORY_OPTIONS.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
              {!readOnlyForm && (
                <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-[#6B8075] pointer-events-none" />
              )}
            </div>
          </div>
        </div>

        {/* Field 2: Judul Tiket */}
        <div>
          <label className="block text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6] mb-1">
            {t("tickets.col_title") || "Judul Tiket"}{" "}
            {!readOnlyForm && <span className="text-rose-500">*</span>}
          </label>
          <input
            type="text"
            required={!readOnlyForm}
            readOnly={readOnlyForm}
            placeholder={t("tickets.drawer_title_ph") || "Contoh: Kendala Pembayaran Paket Pro via Virtual Account"}
            value={ticketTitle}
            onChange={(e) => setTicketTitle(e.target.value)}
            className={`w-full px-3.5 py-2 rounded-xl border text-xs font-semibold text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none transition-colors ${
              readOnlyForm
                ? "bg-[#EBF1EB] dark:bg-[#18362B] border-[#DEE7DF] dark:border-[#1F382B] cursor-default"
                : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] focus:border-[#12281F] dark:focus:border-[#B8F55C]"
            }`}
          />
        </div>

        {/* Field 3 & 4: Status + Priority */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6] mb-1">
              {t("tickets.col_status") || "Status"}
            </label>
            <div className="relative">
              <select
                value={ticketStatus}
                disabled={readOnlyForm}
                onChange={(e) => setTicketStatus(e.target.value)}
                className={`w-full pl-3.5 pr-8 py-2 rounded-xl border text-xs font-semibold text-[#11231B] dark:text-[#F2F7F4] appearance-none focus:outline-none ${
                  readOnlyForm
                    ? "bg-[#EBF1EB] dark:bg-[#18362B] border-[#DEE7DF] dark:border-[#1F382B] cursor-default opacity-80"
                    : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] focus:border-[#12281F] dark:focus:border-[#B8F55C] cursor-pointer"
                }`}
              >
                {STATUS_OPTIONS.map((st) => (
                  <option key={st.value} value={st.value}>
                    {st.label}
                  </option>
                ))}
              </select>
              {!readOnlyForm && (
                <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-[#6B8075] pointer-events-none" />
              )}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6] mb-1">
              {t("tickets.col_priority") || "Prioritas"}
            </label>
            <div className="relative">
              <select
                value={ticketPriority}
                disabled={readOnlyForm}
                onChange={(e) => setTicketPriority(e.target.value)}
                className={`w-full pl-3.5 pr-8 py-2 rounded-xl border text-xs font-semibold text-[#11231B] dark:text-[#F2F7F4] appearance-none focus:outline-none capitalize ${
                  readOnlyForm
                    ? "bg-[#EBF1EB] dark:bg-[#18362B] border-[#DEE7DF] dark:border-[#1F382B] cursor-default opacity-80"
                    : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] focus:border-[#12281F] dark:focus:border-[#B8F55C] cursor-pointer"
                }`}
              >
                {PRIORITY_OPTIONS.map((pri) => (
                  <option key={pri.id} value={pri.id}>
                    {pri.title}
                  </option>
                ))}
              </select>
              {!readOnlyForm && (
                <ChevronDown className="w-4 h-4 absolute right-3 top-2.5 text-[#6B8075] pointer-events-none" />
              )}
            </div>
          </div>
        </div>

        {/* Field 5: Deadline (Jatuh Tempo) */}
        <div>
          <label className="text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6] mb-1 flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#184530] dark:text-[#B8F55C]" />
            <span>{t("tickets.col_deadline") || "Jatuh Tempo"}</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={ticketDeadlineDate}
              readOnly={readOnlyForm}
              disabled={readOnlyForm}
              onChange={(e) => setTicketDeadlineDate(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium text-[#11231B] dark:text-[#F2F7F4] focus:outline-none ${
                readOnlyForm
                  ? "bg-[#EBF1EB] dark:bg-[#18362B] border-[#DEE7DF] dark:border-[#1F382B] cursor-default"
                  : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] focus:border-[#12281F] dark:focus:border-[#B8F55C] cursor-pointer"
              }`}
            />
            <input
              type="time"
              value={ticketDeadlineTime}
              readOnly={readOnlyForm}
              disabled={readOnlyForm}
              onChange={(e) => setTicketDeadlineTime(e.target.value)}
              aria-label={t("tickets.deadline_time_label") || "Waktu deadline"}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs font-medium text-[#11231B] dark:text-[#F2F7F4] focus:outline-none ${
                readOnlyForm
                  ? "bg-[#EBF1EB] dark:bg-[#18362B] border-[#DEE7DF] dark:border-[#1F382B] cursor-default"
                  : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] focus:border-[#12281F] dark:focus:border-[#B8F55C] cursor-pointer"
              }`}
            />
          </div>
        </div>

        {/* Field: Channel Platform (Saluran Kontak) */}
        <div>
          <label className="block text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6] mb-1">
            {t("tickets.channel_label") || "Saluran Kontak"}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              disabled={readOnlyForm}
              onClick={() => setTicketChannel("telegram")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                ticketChannel === "telegram"
                  ? "bg-[#229ED9]/15 border-[#229ED9] text-[#229ED9] shadow-xs"
                  : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] text-[#6B8075] dark:text-[#8EA096] hover:text-[#11231B]"
              } ${readOnlyForm ? "opacity-80 cursor-default" : "cursor-pointer"}`}
            >
              <TelegramLogo className="w-4 h-4 shrink-0" />
              <span>Telegram</span>
            </button>

            <button
              type="button"
              disabled={readOnlyForm}
              onClick={() => setTicketChannel("whatsapp")}
              className={`flex items-center justify-center gap-2 py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                ticketChannel === "whatsapp"
                  ? "bg-[#25D366]/15 border-[#25D366] text-[#128C7E] dark:text-[#25D366] shadow-xs"
                  : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] text-[#6B8075] dark:text-[#8EA096] hover:text-[#11231B]"
              } ${readOnlyForm ? "opacity-80 cursor-default" : "cursor-pointer"}`}
            >
              <WhatsAppLogo className="w-4 h-4 shrink-0" />
              <span>WhatsApp</span>
            </button>
          </div>
        </div>

        {/* Field 6: Pelanggan / Kontak */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6]">
            {t("tickets.col_client") || "Pelanggan / Kontak"}
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="text"
              placeholder={t("contacts.name_placeholder") || "Nama Kontak"}
              value={ticketContactName}
              readOnly={readOnlyForm}
              onChange={(e) => setTicketContactName(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none ${
                readOnlyForm
                  ? "bg-[#EBF1EB] dark:bg-[#18362B] border-[#DEE7DF] dark:border-[#1F382B] cursor-default"
                  : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] focus:border-[#12281F] dark:focus:border-[#B8F55C]"
              }`}
            />
            <input
              type="text"
              placeholder={
                ticketChannel === "telegram"
                  ? t("tickets.telegram_identifier_placeholder") || "Username (@user) atau ID"
                  : t("contacts.phone_placeholder") || "Contoh: 6281234567890"
              }
              value={ticketContactPhone}
              readOnly={readOnlyForm}
              onChange={(e) => setTicketContactPhone(e.target.value)}
              className={`w-full px-3.5 py-2 rounded-xl border text-xs text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none ${
                readOnlyForm
                  ? "bg-[#EBF1EB] dark:bg-[#18362B] border-[#DEE7DF] dark:border-[#1F382B] cursor-default"
                  : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] focus:border-[#12281F] dark:focus:border-[#B8F55C]"
              }`}
            />
          </div>
        </div>

        {/* Field 7: Ticket Description */}
        <div>
          <label className="block text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6] mb-1">
            {t("tickets.drawer_desc") || "Deskripsi Kendala & Catatan Penanganan"}
          </label>
          <div
            className={`rounded-xl border transition-colors overflow-hidden ${
              readOnlyForm
                ? "bg-[#EBF1EB] dark:bg-[#18362B] border-[#DEE7DF] dark:border-[#1F382B]"
                : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] focus-within:border-[#12281F] dark:focus-within:border-[#B8F55C]"
            }`}
          >
            {/* Formatting Toolbar */}
            {!readOnlyForm && (
              <div className="flex flex-wrap items-center gap-1 px-3 py-1.5 border-b border-[#DEE7DF] dark:border-[#1F382B] bg-white dark:bg-[#12241C] select-none">
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    editor?.isActive("bold")
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-bold"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                  }`}
                  title="Tebal (Bold)"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    editor?.isActive("italic")
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-bold"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                  }`}
                  title="Miring (Italic)"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    editor?.isActive("underline")
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-bold"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                  }`}
                  title="Garis Bawah (Underline)"
                >
                  <UnderlineIcon className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3.5 bg-[#DEE7DF] dark:bg-[#1F382B] mx-0.5" />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleBulletList().run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    editor?.isActive("bulletList")
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-bold"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                  }`}
                  title="Daftar Poin (Bullet List)"
                >
                  <List className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().toggleOrderedList().run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    editor?.isActive("orderedList")
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-bold"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                  }`}
                  title="Daftar Nomor (Numbered List)"
                >
                  <ListOrdered className="w-3.5 h-3.5" />
                </button>
                <div className="w-px h-3.5 bg-[#DEE7DF] dark:bg-[#1F382B] mx-0.5" />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().undo().run()}
                  disabled={!editor?.can().undo()}
                  className="p-1.5 rounded-lg text-xs text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Undo"
                >
                  <Undo className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => editor?.chain().focus().redo().run()}
                  disabled={!editor?.can().redo()}
                  className="p-1.5 rounded-lg text-xs text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21] transition-colors cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                  title="Redo"
                >
                  <Redo className="w-3.5 h-3.5" />
                </button>
              </div>
            )}

            {/* Tiptap Content Area */}
            <EditorContent editor={editor} />
          </div>
        </div>

        {/* Field 8: Ticket Attachments */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Paperclip className="w-3.5 h-3.5 text-[#184530] dark:text-[#B8F55C]" />
              <label className="text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6]">
                {t("tickets.attachments_title")}
              </label>
              <span className="text-[10px] text-[#6B8075] dark:text-[#8EA096] font-semibold">
                ({ticketAttachments.length})
              </span>
            </div>

          </div>

          {ticketAttachments.length > 0 ? (
            <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
              {ticketAttachments.map((att, idx) => (
                <TicketAttachmentItem
                  key={`${att.name}-${idx}`}
                  item={att}
                />
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-[#8EA096] italic pl-1">
              {t("tickets.attachments_empty")}
            </p>
          )}
        </div>

        {/* Section: Activity Log Timeline */}
        <section className="pt-2 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-start gap-2">
              <ClipboardList className="mt-0.5 w-4 h-4 text-[#184530] dark:text-[#B8F55C]" />
              <div>
                <h4 className="text-xs font-bold text-[#2D3E35] dark:text-[#D1DDD6]">
                  {t("tickets.activity_title")}
                </h4>
                <p className="text-[10px] text-[#8EA096]">
                  {activity.length} {t("tickets.activity_count")}
                </p>
              </div>
            </div>

            {!readOnlyForm && (
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(true)}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#D7E4D9] dark:border-[#31523F] bg-[#F8FAF7] dark:bg-[#162B21] text-[10px] font-bold text-[#184530] dark:text-[#B8F55C] hover:bg-[#EBF1EB] dark:hover:bg-[#1D3A2C] transition-colors cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>{t("tickets.activity_add_note")}</span>
              </button>
            )}
          </div>

          {activity.length > 0 ? (
            <div className="max-h-60 overflow-y-auto rounded-2xl border border-[#E5EEE6] dark:border-[#294A38] bg-[#F8FAF7] dark:bg-[#0C1712] p-3 space-y-2">
              {[...activity].reverse().map((entry, index) => {
                const dateStr = new Date(entry.timestamp || Date.now()).toLocaleDateString(
                  language === "en" ? "en-US" : "id-ID",
                  {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                );

                return (
                  <div
                    key={index}
                    className="p-2.5 rounded-xl border border-[#DEE7DF] dark:border-[#1F382B] bg-white dark:bg-[#162B21] shadow-2xs space-y-1"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-bold text-[#184530] dark:text-[#B8F55C]">
                        {entry.type === "created"
                          ? t("tickets.activity_created")
                          : entry.type === "status_change"
                            ? `${t("common.status")}: ${entry.oldValue} → ${entry.newValue}`
                            : entry.type === "priority_change"
                              ? `${t("common.priority")}: ${entry.oldValue} → ${entry.newValue}`
                              : t("tickets.activity_note")}
                      </span>
                      <span className="text-[9.5px] text-[#8EA096] font-mono">
                        {dateStr}
                      </span>
                    </div>
                    {entry.description && (
                      <p className="text-xs text-[#556A60] dark:text-[#A5B8AD] leading-relaxed">
                        {entry.description}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-[#DCE8DE] dark:border-[#294A38] bg-[#F8FAF7] dark:bg-[#0C1712] p-4 text-center text-xs text-[#8EA096]">
              {t("tickets.activity_empty")}
            </div>
          )}
        </section>
      </div>

      {/* Note Modal Dialog */}
      {isNoteModalOpen && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs animate-in fade-in">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-2xl p-4 space-y-3 animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-[#EEF3EF] dark:border-[#1F382B]">
              <h4 className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4]">
                {t("tickets.drawer_note_modal_title")}
              </h4>
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="p-1 rounded-lg text-[#8EA096] hover:text-[#11231B] dark:hover:text-[#F2F7F4]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              rows={4}
              placeholder={t("tickets.drawer_note_placeholder")}
              value={manualNote}
              onChange={(e) => setManualNote(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-[#DEE7DF] dark:border-[#1F382B] bg-[#F8FAF7] dark:bg-[#0C1712] text-xs text-[#11231B] dark:text-[#F2F7F4] focus:outline-none focus:border-[#184530] dark:focus:border-[#B8F55C] resize-none"
            />
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsNoteModalOpen(false)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold text-[#556A60] dark:text-[#A5B8AD] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B]"
              >
                {t("common.cancel")}
              </button>
              <button
                type="button"
                onClick={handleAddNoteSubmit}
                disabled={!manualNote.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-bold disabled:opacity-40"
              >
                {t("tickets.drawer_save_note")}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Drawer Sticky Footer Actions */}
      <div className="shrink-0 px-5 sm:px-6 py-4 border-t border-[#EEF3EF] dark:border-[#1F382B] bg-white dark:bg-[#12241C] flex items-center justify-between">
        {editingTicket && !readOnlyForm ? (
          <button
            type="button"
            onClick={handleDelete}
            className="px-3 py-2 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors flex items-center gap-1 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>{t("tickets.delete_ticket")}</span>
          </button>
        ) : (
          <div />
        )}

        <div className="flex items-center gap-2">
          {readOnlyForm ? (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#556A60] dark:text-[#A5B8AD] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer"
              >
                {t("common.close")}
              </button>
              <button
                type="button"
                onClick={onSwitchToEdit}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer border border-[#234235]"
              >
                <SquarePen className="w-3.5 h-3.5 text-[#B8F55C]" />
                <span>{t("tickets.drawer_btn_edit")}</span>
              </button>
            </>
          ) : (
            <>
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-[#556A60] dark:text-[#A5B8AD] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer border border-[#234235]"
              >
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B8F55C]" />
                <span>{editingTicket ? t("tickets.btn_save_changes") : t("tickets.btn_create_ticket")}</span>
              </button>
            </>
          )}
        </div>
      </div>
    </form>
  );
}

export default function TicketDrawer() {
  const { t } = useTranslation();
  const {
    isTicketDrawerOpen,
    setIsTicketDrawerOpen,
    editingTicket,
    ticketDrawerMode,
    setTicketDrawerMode,
    quickTicketInitialData,
  } = useAsking();

  if (!isTicketDrawerOpen) return null;

  const isReadOnly = ticketDrawerMode === "readonly";

  const handleClose = () => {
    setIsTicketDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-out Drawer Panel (Responsive: full-width on mobile, max-w-xl on desktop) */}
      <div className="relative w-full sm:max-w-xl bg-white dark:bg-[#12241C] border-l border-[#DEE7DF] dark:border-[#1F382B] shadow-2xl z-10 flex flex-col h-full animate-in slide-in-from-right duration-250">
        {/* Sticky Header */}
        <div className="p-5 sm:p-6 border-b border-[#DEE7DF] dark:border-[#1F382B] flex items-center justify-between shrink-0 bg-white dark:bg-[#12241C]">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-[#11231B] dark:text-[#F2F7F4]">
              {isReadOnly
                ? t("tickets.drawer_read_only")
                : editingTicket
                  ? t("tickets.drawer_edit_title")
                  : t("tickets.drawer_create_title")}
            </h3>
            <p className="text-xs text-[#556A60] dark:text-[#A5B8AD] mt-0.5">
              {editingTicket
                ? `#${editingTicket.id} - ${editingTicket.title}`
                : t("tickets.drawer_create_subtitle")}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#6B8075] hover:text-[#11231B] dark:hover:text-[#F2F7F4] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <TicketDrawerForm
          key={editingTicket ? `ticket-${editingTicket.id}-${ticketDrawerMode}` : "new-ticket"}
          editingTicket={editingTicket}
          initialContact={quickTicketInitialData}
          readOnlyForm={isReadOnly}
          onClose={handleClose}
          onSwitchToEdit={() => setTicketDrawerMode("edit")}
        />
      </div>
    </div>
  );
}
