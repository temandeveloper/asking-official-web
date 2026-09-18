"use client";

import React, { useState, useRef } from "react";
import { useTranslation } from "../../data/TranslationContext";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import {
  Mail,
  X,
  Send,
  Paperclip,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Braces,
  Trash2,
  FileText,
} from "lucide-react";

export default function EmailComposeDrawer({
  isOpen,
  onClose,
  initialData = null,
  recipientEmail = "",
  onSendEmail,
}) {
  const { t } = useTranslation();
  const [to, setTo] = useState(() => (initialData?.to || recipientEmail || "").replace(/^email:/, ""));
  const [cc, setCc] = useState(initialData?.cc || "");
  const [showCc, setShowCc] = useState(Boolean(initialData?.cc));
  const [subject, setSubject] = useState(initialData?.subject || "");
  const [attachment, setAttachment] = useState(null);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Placeholder.configure({
        placeholder: t("email.body_placeholder") || "Tulis isi email Anda di sini...",
      }),
    ],
    content: initialData?.html || initialData?.text || "",
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[140px] max-h-[220px] overflow-y-auto px-4 py-3 text-xs leading-relaxed focus:outline-none",
      },
    },
  });

  if (!isOpen) return null;

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 10MB limit
    if (file.size > 10 * 1024 * 1024) {
      alert(t("email.file_size_exceeded"));
      e.target.value = "";
      return;
    }

    setAttachment({
      name: file.name,
      filename: file.name,
      size: file.size,
      type: file.type || "application/octet-stream",
      previewUrl: file.type?.startsWith("image/") ? URL.createObjectURL(file) : null,
    });
    e.target.value = "";
  };

  const insertTag = (tag) => {
    if (!editor) return;
    editor.chain().focus().insertContent(tag).run();
    setShowTagMenu(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!to.trim() || !subject.trim()) return;

    const htmlContent = editor?.getHTML() || "";
    const rawText = editor?.getText() || "";
    if (!rawText.trim()) return;

    setIsSending(true);

    setTimeout(() => {
      onSendEmail?.({
        to: to.trim(),
        cc: cc.trim() || undefined,
        subject: subject.trim(),
        text: rawText.trim(),
        html: htmlContent,
        attachments: attachment ? [attachment] : [],
      });
      setIsSending(false);
      onClose();
    }, 400);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      />

      {/* Slide-out Panel */}
      <div className="relative w-full sm:max-w-xl bg-white dark:bg-[#12241C] border-l border-[#DEE7DF] dark:border-[#1F382B] shadow-2xl z-10 flex flex-col h-full animate-in slide-in-from-right duration-250">
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-[#EEF3EF] dark:border-[#1F382B] flex items-center justify-between shrink-0 bg-white dark:bg-[#12241C]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-2xl bg-sky-50 dark:bg-sky-950/40 text-sky-600 dark:text-sky-400 border border-sky-200 dark:border-sky-900/50 flex items-center justify-center shadow-xs">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-bold text-[#11231B] dark:text-[#F2F7F4]">
                {initialData?.subject?.startsWith("Re:") ? t("email.compose_reply_title") : t("email.compose_title")}
              </h3>
              <p className="text-[11px] text-[#6B8075] dark:text-[#8EA096]">
                {t("email.channel_title")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#6B8075] hover:text-[#11231B] dark:hover:text-[#F2F7F4] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form
          id="email-compose-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 scrollbar-thin-subtle"
        >
          {/* To Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6]">
                {t("email.to")} <span className="text-rose-500">*</span>
              </label>
              {!showCc && (
                <button
                  type="button"
                  onClick={() => setShowCc(true)}
                  className="text-[11px] font-semibold text-[#184530] dark:text-[#B8F55C] hover:underline cursor-pointer"
                >
                  {t("email.add_cc")}
                </button>
              )}
            </div>
            <input
              type="email"
              required
              placeholder="email.tujuan@domain.com"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F]"
            />
          </div>

          {/* CC Field */}
          {showCc && (
            <div className="space-y-1.5 animate-in fade-in duration-150">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6]">
                  {t("email.cc")}
                </label>
                <button
                  type="button"
                  onClick={() => {
                    setCc("");
                    setShowCc(false);
                  }}
                  className="text-[11px] text-rose-500 hover:underline cursor-pointer"
                >
                  {t("common.delete")} CC
                </button>
              </div>
              <input
                type="text"
                placeholder="manager@domain.com, accounting@domain.com"
                value={cc}
                onChange={(e) => setCc(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F]"
              />
            </div>
          )}

          {/* Subject Field */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6]">
              {t("email.subject_label")} <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder={t("email.compose_subject_ph")}
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full p-2.5 text-xs rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F]"
            />
          </div>

          {/* Tiptap Rich Text Content */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6]">
              {t("scheduler.modal_msg_content")} <span className="text-rose-500">*</span>
            </label>

            <div className="rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] focus-within:border-[#12281F] dark:focus-within:border-[#B8F55C] transition-colors shadow-2xs relative">
              {/* Toolbar */}
              <div className="px-3 py-2 border-b border-[#EEF3EF] dark:border-[#1F382B] flex items-center gap-1 flex-wrap bg-[#F3F6F3] dark:bg-[#13271E] select-none rounded-t-xl">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    editor?.isActive("bold")
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-bold"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                  }`}
                  title="Bold"
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    editor?.isActive("italic")
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-bold"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                  }`}
                  title="Italic"
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    editor?.isActive("underline")
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-bold"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                  }`}
                  title="Underline"
                >
                  <UnderlineIcon className="w-3.5 h-3.5" />
                </button>

                <div className="w-px h-4 bg-[#DEE7DF] dark:bg-[#1F382B] mx-1" />

                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    editor?.isActive({ textAlign: "left" })
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C]"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                  }`}
                  title="Align Left"
                >
                  <AlignLeft className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    editor?.isActive({ textAlign: "center" })
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C]"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                  }`}
                  title="Align Center"
                >
                  <AlignCenter className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    editor?.isActive({ textAlign: "right" })
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C]"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                  }`}
                  title="Align Right"
                >
                  <AlignRight className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${
                    editor?.isActive({ textAlign: "justify" })
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C]"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                  }`}
                  title="Align Justify"
                >
                  <AlignJustify className="w-3.5 h-3.5" />
                </button>

                {/* Dynamic Variables */}
                <div className="relative ml-auto">
                  <button
                    type="button"
                    onClick={() => setShowTagMenu(!showTagMenu)}
                    className="p-1.5 rounded-lg text-xs font-mono font-bold text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21] transition-colors cursor-pointer flex items-center gap-1"
                    title={t("email.variables")}
                  >
                    <Braces className="w-3.5 h-3.5 text-[#184530] dark:text-[#B8F55C]" />
                    <span className="text-[10px]">{t("email.variables")}</span>
                  </button>

                  {showTagMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setShowTagMenu(false)}
                      />
                      <div className="absolute right-0 top-full mt-1.5 w-52 max-h-56 overflow-y-auto rounded-xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-2xl p-1.5 z-40 space-y-0.5 animate-in zoom-in-95 duration-100">
                        {[
                          { label: t("templates.tag_name"), tag: "{{name}}" },
                          { label: t("contacts.email_label"), tag: "{{email}}" },
                          { label: t("templates.tag_date"), tag: "{{date}}" },
                          { label: t("templates.tag_time"), tag: "{{time}}" },
                          { label: t("templates.tag_ticket_id"), tag: "{{ticket_id}}" },
                          { label: t("templates.tag_company"), tag: "{{company_name}}" },
                        ].map((item) => (
                          <button
                            key={item.tag}
                            type="button"
                            onClick={() => insertTag(item.tag)}
                            className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] text-xs transition-colors cursor-pointer flex items-center justify-between"
                          >
                            <span className="text-[11px] font-medium text-[#11231B] dark:text-[#F2F7F4]">
                              {item.label}
                            </span>
                            <span className="text-[10px] font-mono text-[#6B8075] dark:text-[#A5B8AD]">
                              {item.tag}
                            </span>
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Editor Content Area */}
              <EditorContent editor={editor} className="rounded-b-xl" />
            </div>
          </div>

          {/* Attachments Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6]">
                {t("email.attachments")} ({t("email.attach_max_size")})
              </label>
              {!attachment && (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1 text-[11px] font-semibold text-[#184530] dark:text-[#B8F55C] hover:underline cursor-pointer"
                >
                  <Paperclip className="w-3.5 h-3.5" />
                  <span>{t("email.attach_file")}</span>
                </button>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.txt,.zip,.csv"
              className="hidden"
              onChange={handleFileSelect}
            />

            {attachment && (
              <div className="flex items-center justify-between p-2.5 rounded-xl border border-[#DEE7DF] dark:border-[#1F382B] bg-[#F8FAF7] dark:bg-[#162B21]">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] truncate">
                      {attachment.name}
                    </p>
                    <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096]">
                      {attachment.size > 1024 * 1024
                        ? `${(attachment.size / 1024 / 1024).toFixed(1)} MB`
                        : `${Math.round(attachment.size / 1024)} KB`}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  className="p-1.5 rounded-lg text-[#6B8075] hover:text-rose-500 transition-colors cursor-pointer"
                  title={t("common.delete")}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </form>

        {/* Footer Actions */}
        <div className="shrink-0 px-5 sm:px-6 py-3.5 border-t border-[#EEF3EF] dark:border-[#1F382B] bg-white dark:bg-[#12241C] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-[#556A60] dark:text-[#A5B8AD] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            form="email-compose-form"
            disabled={isSending || !to.trim() || !subject.trim()}
            className="flex items-center gap-2 px-6 py-2 rounded-xl bg-[#12281F] hover:bg-[#1C3B2E] disabled:opacity-40 text-[#B8F55C] text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer border border-[#234235]"
          >
            <Send className="w-4 h-4 text-[#B8F55C]" />
            <span>{isSending ? t("email.sending_email") : t("email.send_email")}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
