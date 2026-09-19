"use client";

import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";

import { useAsking } from "../../data/AskingContext";
import { useTranslation } from "../../data/TranslationContext";
import { WhatsAppLogo, TelegramLogo, EmailLogo } from "../shared/ChannelBadge";
import {
  CalendarClock,
  X,
  Plus,
  Users,
  Search,
  Check,
  ShieldCheck,
  Smile,
  Mail,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Braces,
  Clock,
  AlertTriangle,
} from "lucide-react";

// Convert Tiptap HTML into WhatsApp / Telegram chat markdown
function tiptapHtmlToChatMarkdown(html) {
  if (!html) return "";
  let text = String(html);
  text = text.replace(/<p><\/p>/gi, "");
  text = text.replace(/<br\s*[/]?>/gi, "\n");
  text = text.replace(/<\/p>\s*<p[^>]*>/gi, "\n\n");
  text = text.replace(/<\/?p[^>]*>/gi, "");
  text = text.replace(/<(strong|b)>(.*?)<\/(strong|b)>/gi, "*$2*");
  text = text.replace(/<(em|i)>(.*?)<\/(em|i)>/gi, "_$2_");
  text = text.replace(/<u>(.*?)<\/u>/gi, "_$1_");
  text = text.replace(/<(s|del|strike)>(.*?)<\/(s|del|strike)>/gi, "~$2~");
  text = text.replace(/<code>(.*?)<\/code>/gi, "`$1`");
  text = text.replace(/<li[^>]*>(.*?)<\/li>/gi, "• $1\n");
  text = text.replace(/<\/?(ul|ol)[^>]*>/gi, "\n");
  text = text.replace(/<[^>]+>/g, "");
  text = text
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
  return text.replace(/\n{3,}/g, "\n\n").trim();
}

// Calculate dynamic duration in milliseconds
function calculateScheduleEstimatedDuration(channel, targetCount, text) {
  const count = Number(targetCount) || 0;
  if (count <= 0) return 0;
  const targetChannel = (channel || "whatsapp").toLowerCase();

  if (targetChannel === "email") {
    if (count === 1) return 2000;
    return (count - 1) * 25000 + 2000;
  }

  const clean = String(text || "").replace(/<[^>]+>/g, " ").trim();
  const wordCount = (clean.match(/\S+/g) || []).length;
  const typingMs = Math.min(
    30000,
    Math.max(1500, Math.round(wordCount * 500 + 650))
  );

  if (count === 1) return typingMs;
  return 75000 * (count - 1) + typingMs;
}

// Format duration into readable bilingual text
function formatDurationDisplay(ms, lang = "id") {
  const isEn = lang === "en";
  const sText = isEn ? "s" : "dtk";
  const mText = isEn ? "m" : "mnt";
  const hText = isEn ? "h" : "jam";

  const totalSeconds = Math.round((Number(ms) || 0) / 1000);
  if (totalSeconds <= 0) return `0 ${sText}`;
  if (totalSeconds < 60) return `${totalSeconds} ${sText}`;

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  if (minutes < 60) {
    if (remainingSeconds === 0) return `${minutes} ${mText}`;
    return `${minutes} ${mText} ${remainingSeconds} ${sText}`;
  }

  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  if (remainingMinutes === 0) return `${hours} ${hText}`;
  return `${hours} ${hText} ${remainingMinutes} ${mText}`;
}

function NewScheduleModalContent({ onClose, editingSchedule }) {
  const {
    conversations,
    contacts,
    fetchContacts,
    templates,
    fetchTemplates,
    schedules,
    addScheduledMessage,
    updateScheduledMessage,
  } = useAsking();
  const { t, language } = useTranslation();

  React.useEffect(() => {
    if (fetchContacts) {
      fetchContacts();
    }
    if (fetchTemplates) {
      fetchTemplates();
    }
  }, [fetchContacts, fetchTemplates]);

  const PAGE_SIZE = 15;

  const getDefaultTime = useCallback(() => {
    const inTenMins = new Date(Date.now() + 10 * 60 * 1000);
    return new Date(inTenMins.getTime() - inTenMins.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  }, []);

  // Selected Channel
  const [channel, setChannel] = useState(
    editingSchedule?.channel || "whatsapp"
  );

  // Selected Targets (Multi-contact, max 20)
  const [selectedTargets, setSelectedTargets] = useState(() => {
    if (
      editingSchedule?.targets &&
      Array.isArray(editingSchedule.targets) &&
      editingSchedule.targets.length > 0
    ) {
      return editingSchedule.targets;
    }
    if (editingSchedule?.target || editingSchedule?.jid) {
      const jid = editingSchedule.target || editingSchedule.jid;
      return [
        {
          jid,
          channel: editingSchedule.channel || "whatsapp",
          name: editingSchedule.contactName || jid,
          phone: jid,
          email: editingSchedule.channel === "email" ? jid : undefined,
        },
      ];
    }
    // Default initial target from first conversation
    if (conversations && conversations.length > 0) {
      const c = conversations[0];
      return [
        {
          jid: c.jid || c.phone,
          channel: c.channel || "whatsapp",
          name: c.name,
          phone: c.phone || c.jid,
          email: c.channel === "email" ? c.phone || c.jid : undefined,
        },
      ];
    }
    return [];
  });

  // Manual input field for quick adding
  const [manualPhone, setManualPhone] = useState("");
  const [manualName, setManualName] = useState("");
  const [contactSearch, setContactSearch] = useState("");
  const [showContactPicker, setShowContactPicker] = useState(false);
  const [displayLimit, setDisplayLimit] = useState(PAGE_SIZE);

  // Form Fields
  const [subject, setSubject] = useState(
    editingSchedule?.subject || editingSchedule?.title || ""
  );
  const [scheduledTime, setScheduledTime] = useState(() => {
    if (editingSchedule?.scheduledTime) {
      const d = new Date(editingSchedule.scheduledTime);
      return new Date(d.getTime() - d.getTimezoneOffset() * 60000)
        .toISOString()
        .slice(0, 16);
    }
    return getDefaultTime();
  });
  const [recurrence, setRecurrence] = useState(
    editingSchedule?.recurrence || "once"
  );
  const [appendTicketId, setAppendTicketId] = useState(
    editingSchedule?.appendTicketId ?? true
  );
  const [isTemplateDropdownOpen, setIsTemplateDropdownOpen] = useState(false);
  const [showTagMenu, setShowTagMenu] = useState(false);
  const [editorText, setEditorText] = useState(
    editingSchedule?.text ||
    editingSchedule?.message ||
    ""
  );

  // Tiptap Rich Text Editor Setup
  const editor = useEditor({
    immediatelyRender: false,
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
        placeholder:
          channel === "email"
            ? t("scheduler.modal_ph_email_msg")
            : t("scheduler.modal_ph_chat_msg"),
      }),
    ],
    content:
      editingSchedule?.html ||
      editingSchedule?.text ||
      editingSchedule?.message ||
      "",
    editorProps: {
      attributes: {
        class:
          "tiptap min-h-[110px] max-h-[190px] overflow-y-auto px-3.5 py-2.5 text-xs leading-relaxed focus:outline-none",
      },
    },
    onUpdate: ({ editor: curEditor }) => {
      const txt = curEditor.getText().trim();
      setEditorText(txt);
    },
  });

  // Live estimated job duration
  const estimatedDurationMs = useMemo(
    () =>
      calculateScheduleEstimatedDuration(
        channel,
        selectedTargets.length,
        editorText
      ),
    [channel, selectedTargets.length, editorText]
  );

  const formattedEstimatedDuration = useMemo(
    () => formatDurationDisplay(estimatedDurationMs, language),
    [estimatedDurationMs, language]
  );

  // Real-time schedule conflict check with existing schedules on same channel
  const conflictInfo = useMemo(() => {
    if (!scheduledTime || selectedTargets.length === 0) {
      return { hasConflict: false, recommendedTime: null };
    }
    const targetTimeMs = new Date(scheduledTime).getTime();
    if (isNaN(targetTimeMs)) return { hasConflict: false, recommendedTime: null };

    // Check if any existing schedule on same channel overlaps within 10 minutes
    const conflict = (schedules || []).find((s) => {
      if (editingSchedule && s.id === editingSchedule.id) return false;
      if (s.status !== "pending") return false;
      const sChannel = (s.channel || "whatsapp").toLowerCase();
      if (sChannel !== channel.toLowerCase()) return false;
      const sTime = typeof s.scheduledTime === "number" ? s.scheduledTime : new Date(s.scheduledTime).getTime();
      return Math.abs(sTime - targetTimeMs) < 600000; // within 10 mins
    });

    if (conflict) {
      const recTime = targetTimeMs + 15 * 60 * 1000; // suggest +15 minutes
      return { hasConflict: true, conflictingItem: conflict, recommendedTime: recTime };
    }

    return { hasConflict: false, recommendedTime: null };
  }, [scheduledTime, selectedTargets.length, channel, schedules, editingSchedule]);

  const handleApplyRecommendedTime = () => {
    if (!conflictInfo.recommendedTime) return;
    const recDate = new Date(conflictInfo.recommendedTime);
    const recIso = new Date(
      recDate.getTime() - recDate.getTimezoneOffset() * 60000
    )
      .toISOString()
      .slice(0, 16);
    setScheduledTime(recIso);
  };

  const handleChannelChange = (newChannel) => {
    if (newChannel === channel) return;
    setChannel(newChannel);
    setSelectedTargets([]);
    setContactSearch("");
    setDisplayLimit(PAGE_SIZE);

    if (newChannel !== "email" && editor) {
      editor.chain().focus().unsetTextAlign().run();
    }
  };

  const allAvailableContacts = useMemo(() => {
    const map = new Map();
    if (Array.isArray(contacts)) {
      for (const c of contacts) {
        const key = c.jid || c.phone || c.email;
        if (key) map.set(key, c);
      }
    }
    if (Array.isArray(conversations)) {
      for (const c of conversations) {
        const key = c.jid || c.phone || c.email;
        if (key && !map.has(key)) map.set(key, c);
      }
    }
    return Array.from(map.values());
  }, [contacts, conversations]);

  // Contacts list based on chosen channel
  const filteredContacts = useMemo(() => {
    const query = contactSearch.toLowerCase();
    return allAvailableContacts.filter((c) => {
      const isEmail = c.channel === "email" || c.jid?.startsWith("email:");
      const isTg =
        !isEmail && (c.channel === "telegram" || c.jid?.startsWith("tg_"));

      if (channel === "email" && !isEmail) return false;
      if (channel === "telegram" && !isTg) return false;
      if (channel === "whatsapp" && (isEmail || isTg)) return false;

      return (
        (c.name || "").toLowerCase().includes(query) ||
        (c.phone || "").includes(query) ||
        (c.email || "").toLowerCase().includes(query) ||
        (c.jid || "").toLowerCase().includes(query)
      );
    });
  }, [allAvailableContacts, contactSearch, channel]);

  const visibleContacts = useMemo(() => {
    return filteredContacts.slice(0, displayLimit);
  }, [filteredContacts, displayLimit]);

  const handlePickerScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
    if (scrollTop + clientHeight >= scrollHeight - 20) {
      if (displayLimit < filteredContacts.length) {
        setDisplayLimit((prev) => prev + PAGE_SIZE);
      }
    }
  };

  const handleAddTarget = (contact) => {
    if (selectedTargets.length >= 20) return;
    const isEmail = channel === "email";
    const isTg = channel === "telegram";
    const jid =
      contact.jid ||
      (isEmail
        ? contact.email?.startsWith("email:")
          ? contact.email
          : `email:${contact.email || contact.phone}`
        : isTg
          ? `tg_${contact.phone}`
          : contact.phone);

    if (!jid || selectedTargets.some((tItem) => tItem.jid === jid)) return;

    setSelectedTargets((prev) => [
      ...prev,
      {
        jid,
        channel,
        name: contact.name || (isEmail ? contact.email : contact.phone) || jid,
        phone: isEmail ? contact.email : contact.phone || jid,
        email: isEmail
          ? contact.email || contact.phone || jid.replace(/^email:/, "")
          : undefined,
      },
    ]);
  };

  const handleRemoveTarget = (jid) => {
    setSelectedTargets((prev) => prev.filter((tItem) => tItem.jid !== jid));
  };

  const handleAddManualContact = (e) => {
    e.preventDefault();
    if (!manualPhone.trim()) return;
    if (selectedTargets.length >= 20) return;

    const rawInput = manualPhone.trim();
    let jid;
    let cleanDisplay;

    if (channel === "email") {
      const cleanEmail = rawInput.toLowerCase();
      if (!cleanEmail.includes("@")) return;
      cleanDisplay = cleanEmail;
      jid = cleanEmail.startsWith("email:")
        ? cleanEmail
        : `email:${cleanEmail}`;
    } else if (channel === "telegram") {
      cleanDisplay = rawInput;
      jid = rawInput.startsWith("tg_")
        ? rawInput
        : rawInput.startsWith("@") || /^[a-zA-Z0-9_]{4,32}$/.test(rawInput)
          ? rawInput
          : `tg_${rawInput}`;
    } else {
      const cleanNumber = rawInput.replace(/[^0-9]/g, "");
      if (!cleanNumber || cleanNumber.length < 5) return;
      cleanDisplay = cleanNumber;
      jid = cleanNumber.includes("@")
        ? cleanNumber
        : `${cleanNumber}@s.whatsapp.net`;
    }

    if (selectedTargets.some((tItem) => tItem.jid === jid)) return;

    setSelectedTargets((prev) => [
      ...prev,
      {
        jid,
        channel,
        name: manualName.trim() || cleanDisplay,
        phone: cleanDisplay,
        email: channel === "email" ? cleanDisplay : undefined,
      },
    ]);

    setManualPhone("");
    setManualName("");
  };

  const insertTag = (tag) => {
    if (!editor) return;
    editor.chain().focus().insertContent(tag).run();
    setShowTagMenu(false);
  };

  const handleInsertTemplate = (content) => {
    if (!editor) return;
    editor.chain().focus().insertContent(content).run();
    setIsTemplateDropdownOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const htmlContent = editor?.getHTML() || "";
    const rawText = editor?.getText() || "";
    const chatMarkdown = tiptapHtmlToChatMarkdown(htmlContent);

    if (selectedTargets.length === 0 || !rawText.trim() || !scheduledTime)
      return;
    if (channel === "email" && !subject.trim()) return;

    const firstTarget = selectedTargets[0];
    const contactNames = selectedTargets.map((tItem) => tItem.name).join(", ");
    const targetDisplay = selectedTargets.map((tItem) => tItem.phone || tItem.email || tItem.jid).join(", ");

    const payload = {
      channel,
      targets: selectedTargets.map((tItem) => ({ ...tItem, channel })),
      contactName: contactNames,
      target: targetDisplay,
      jid: firstTarget?.jid,
      subject: channel === "email" ? subject.trim() : (subject.trim() || t("scheduler.modal_subject_chat_ph")),
      title: channel === "email" ? subject.trim() : (subject.trim() || t("scheduler.modal_subject_chat_ph")),
      text: (channel === "email" ? chatMarkdown || rawText : chatMarkdown || rawText).trim(),
      message: (channel === "email" ? chatMarkdown || rawText : chatMarkdown || rawText).trim(),
      html: channel === "email" ? htmlContent : undefined,
      scheduledTime: new Date(scheduledTime).getTime(),
      estimatedDuration: estimatedDurationMs,
      recurrence,
      recipientsCount: selectedTargets.length,
      appendTicketId: channel === "email" ? false : appendTicketId,
    };

    if (editingSchedule) {
      updateScheduledMessage(editingSchedule.id, payload);
    } else {
      addScheduledMessage(payload);
    }

    onClose();
  };

  const conflictTimeStr = conflictInfo.recommendedTime
    ? new Date(conflictInfo.recommendedTime).toLocaleTimeString(
      language === "en" ? "en-US" : "id-ID",
      {
        hour: "2-digit",
        minute: "2-digit",
      }
    )
    : "";

  return (
    <div
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-2xs flex items-center justify-center p-3 sm:p-4 select-none"
    >
      {/* Structured Modal Window: Constrained height + flex layout guarantees footer buttons are never cut off on mobile */}
      <div className="w-full max-w-xl max-h-[90dvh] sm:max-h-[85vh] rounded-3xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-2xl animate-in zoom-in-95 duration-150 text-[#11231B] dark:text-[#F2F7F4] flex flex-col overflow-hidden">
        {/* Fixed Header */}
        <div className="shrink-0 px-5 sm:px-6 py-4 border-b border-[#EEF3EF] dark:border-[#1F382B] flex items-center justify-between bg-white dark:bg-[#12241C]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] border border-[#CFE2D3] dark:border-[#234235] flex items-center justify-center shadow-xs shrink-0">
              <CalendarClock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold tracking-tight">
                {editingSchedule ? t("scheduler.modal_edit_title") : t("scheduler.modal_create_title")}
              </h2>
              <p className="text-[11px] text-[#6B8075] dark:text-[#8EA096]">
                {t("scheduler.modal_subtitle")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-[#6B8075] hover:text-[#11231B] dark:text-[#8EA096] dark:hover:text-[#F2F7F4] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer"
            title={t("common.close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form
          id="new-schedule-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto px-5 sm:px-6 py-4 space-y-4 scrollbar-thin-subtle"
        >
          {/* Target Channel Selector */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6]">
              {t("scheduler.channel")}
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleChannelChange("whatsapp")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${channel === "whatsapp"
                    ? "bg-[#E5EFE7] dark:bg-[#18362B] border-[#184530] dark:border-[#B8F55C] text-[#184530] dark:text-[#B8F55C] shadow-xs"
                    : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] text-[#6B8075] dark:text-[#8EA096] hover:bg-[#EEF3EF] dark:hover:bg-[#1B3528]"
                  }`}
              >
                <WhatsAppLogo className="w-4 h-4" />
                <span>WhatsApp</span>
              </button>
              <button
                type="button"
                onClick={() => handleChannelChange("telegram")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${channel === "telegram"
                    ? "bg-[#E5EFE7] dark:bg-[#18362B] border-[#184530] dark:border-[#B8F55C] text-[#184530] dark:text-[#B8F55C] shadow-xs"
                    : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] text-[#6B8075] dark:text-[#8EA096] hover:bg-[#EEF3EF] dark:hover:bg-[#1B3528]"
                  }`}
              >
                <TelegramLogo className="w-4 h-4" />
                <span>Telegram</span>
              </button>
              <button
                type="button"
                onClick={() => handleChannelChange("email")}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all ${channel === "email"
                    ? "bg-sky-50 dark:bg-sky-950/40 border-sky-500 text-sky-700 dark:text-sky-300 shadow-xs"
                    : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] text-[#6B8075] dark:text-[#8EA096] hover:bg-[#EEF3EF] dark:hover:bg-[#1B3528]"
                  }`}
              >
                <EmailLogo className="w-4 h-4 text-sky-500" />
                <span>Email</span>
              </button>
            </div>
          </div>

          {/* Target Recipients Section */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6] flex items-center gap-1.5 flex-wrap">
                <span>{t("scheduler.target_recipients")}</span>
                <span className="text-rose-500">*</span>
                <span className="text-[11px] font-normal text-[#6B8075] dark:text-[#8EA096]">
                  ({selectedTargets.length}/20)
                </span>
                {selectedTargets.length > 0 && (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10.5px] font-medium bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] border border-[#CFE2D3] dark:border-[#234235]"
                    title={
                      channel === "email"
                        ? t("scheduler.modal_est_tooltip_email")
                        : t("scheduler.modal_est_tooltip_chat")
                    }
                  >
                    <Clock className="w-3 h-3" />
                    <span>{t("scheduler.est_duration", { duration: formattedEstimatedDuration })}</span>
                  </span>
                )}
              </label>

              <button
                type="button"
                onClick={() => setShowContactPicker(!showContactPicker)}
                className="text-[11px] font-semibold text-[#184530] dark:text-[#B8F55C] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <Users className="w-3.5 h-3.5" />
                <span>
                  {showContactPicker ? t("scheduler.modal_close_contacts") : t("scheduler.modal_pick_contacts")}
                </span>
              </button>
            </div>

            {/* Selected Targets Badges */}
            {selectedTargets.length > 0 && (
              <div className="flex flex-wrap gap-1.5 p-2 rounded-2xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] max-h-24 overflow-y-auto">
                {selectedTargets.map((tItem) => (
                  <span
                    key={tItem.jid}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] text-xs text-[#11231B] dark:text-[#F2F7F4] shadow-2xs animate-in zoom-in-90"
                  >
                    <span className="max-w-[140px] truncate font-medium">
                      {tItem.name || tItem.phone || tItem.email}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveTarget(tItem.jid)}
                      className="text-[#6B8075] hover:text-rose-500 transition-colors cursor-pointer"
                      title={t("common.delete")}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* Contact Picker Accordion Box */}
            {showContactPicker && (
              <div className="p-3 rounded-2xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] space-y-2 animate-in fade-in-50 duration-200">
                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8EA096]" />
                  <input
                    type="text"
                    placeholder={t("scheduler.search_contacts_ph")}
                    value={contactSearch}
                    onChange={(e) => {
                      setContactSearch(e.target.value);
                      setDisplayLimit(PAGE_SIZE);
                    }}
                    className="w-full pl-8 pr-3 py-1.5 text-xs rounded-xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none"
                  />
                </div>

                {/* Scrollable Contact List */}
                <div
                  onScroll={handlePickerScroll}
                  className="max-h-36 overflow-y-auto space-y-1 pr-1 select-none scrollbar-thin-subtle"
                >
                  {filteredContacts.length === 0 ? (
                    <div className="py-4 text-center text-xs text-[#8EA096]">
                      {t("scheduler.no_contacts_found")}
                    </div>
                  ) : (
                    visibleContacts.map((c) => {
                      const targetJid = c.jid || c.phone;
                      const isSelected = selectedTargets.some(
                        (tItem) => tItem.jid === targetJid
                      );

                      return (
                        <div
                          key={c.jid || c.phone}
                          onClick={() =>
                            isSelected
                              ? handleRemoveTarget(targetJid)
                              : handleAddTarget(c)
                          }
                          className={`p-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${isSelected
                              ? "bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-semibold"
                              : "hover:bg-white dark:hover:bg-[#12241C] text-[#2D3E35] dark:text-[#D1DDD6]"
                            }`}
                        >
                          <div className="truncate">
                            <span>{c.name}</span>
                            <span className="text-[10px] text-[#6B8075] ml-1.5">
                              {channel === "email"
                                ? c.email || c.phone
                                : channel === "telegram"
                                  ? c.phone?.startsWith("@")
                                    ? c.phone
                                    : `@${c.phone}`
                                  : `+${c.phone?.replace(/[^0-9]/g, "")}`}
                            </span>
                          </div>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 text-[#22C55E]" />
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {/* Quick Manual Add Input */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={
                  channel === "email"
                    ? t("scheduler.modal_ph_manual_email")
                    : channel === "telegram"
                      ? t("scheduler.modal_ph_manual_tg")
                      : t("scheduler.modal_ph_manual_wa")
                }
                value={manualPhone}
                onChange={(e) => setManualPhone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddManualContact(e);
                  }
                }}
                className="flex-1 p-2 text-xs rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none"
              />
              <input
                type="text"
                placeholder={t("scheduler.modal_contact_name_ph")}
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddManualContact(e);
                  }
                }}
                className="w-28 sm:w-36 p-2 text-xs rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddManualContact}
                data-testid="add-manual-target"
                className="p-2 rounded-xl bg-[#EBF1EB] dark:bg-[#18362B] hover:bg-[#12281F] hover:text-[#B8F55C] text-[#2D3E35] dark:text-[#D1DDD6] text-xs font-semibold transition-colors cursor-pointer border border-[#DEE7DF]/50 dark:border-[#234235]"
                title={t("scheduler.modal_manual_contact")}
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subject Field for Email Channel */}
          {channel === "email" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-sky-500" />
                <span>{t("scheduler.modal_subject_email_label")}</span>
                <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder={t("scheduler.modal_subject_email_ph")}
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F]"
              />
            </div>
          )}

          {/* Non-email Subject/Campaign Field */}
          {channel !== "email" && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6]">
                {t("scheduler.modal_subject_chat_label")}
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("scheduler.modal_subject_chat_ph")}
                className="w-full p-2.5 text-xs rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F]"
              />
            </div>
          )}

          {/* Message Content with Tiptap Editor & Dynamic Tags */}
          <div className="space-y-1.5 relative">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6]">
                {t("scheduler.message_content")} <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowTagMenu(false);
                    setIsTemplateDropdownOpen(!isTemplateDropdownOpen);
                  }}
                  className="text-[11px] font-semibold text-[#184530] dark:text-[#B8F55C] hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <Smile className="w-3.5 h-3.5" />
                  <span>{t("scheduler.insert_template")}</span>
                </button>

                {/* Quick Template Picker Dropdown */}
                {isTemplateDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-30"
                      onClick={() => setIsTemplateDropdownOpen(false)}
                    />
                    <div className="absolute right-0 top-full mt-1.5 w-64 max-h-56 overflow-y-auto bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] rounded-2xl shadow-2xl p-2 z-40 space-y-1 animate-in zoom-in-95 duration-100">
                      <p className="text-[10px] font-bold text-[#6B8075] uppercase px-2 py-1 tracking-wider">
                        {t("scheduler.modal_template_select")}
                      </p>
                      {(templates || []).length === 0 ? (
                        <p className="text-[11px] text-[#8EA096] px-2 py-1">
                          {t("scheduler.modal_template_empty")}
                        </p>
                      ) : (
                        templates.map((tpl) => (
                          <button
                            key={tpl.id}
                            type="button"
                            onClick={() => handleInsertTemplate(tpl.content)}
                            className="w-full text-left p-2 rounded-xl hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] text-xs font-medium text-[#11231B] dark:text-[#F2F7F4] truncate cursor-pointer transition-colors"
                          >
                            {tpl.title}
                          </button>
                        ))
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Tiptap Container */}
            <div className="rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] focus-within:border-[#12281F] dark:focus-within:border-[#B8F55C] transition-colors shadow-2xs relative">
              {/* Toolbar */}
              <div className="px-3 py-2 border-b border-[#EEF3EF] dark:border-[#1F382B] flex items-center gap-1 flex-wrap bg-[#F3F6F3] dark:bg-[#13271E] select-none rounded-t-xl">
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleBold().run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive("bold")
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-bold"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                    }`}
                  title={language === "en" ? "Bold (*bold*)" : "Bold (*tebal*)"}
                >
                  <Bold className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleItalic().run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive("italic")
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-bold"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                    }`}
                  title={language === "en" ? "Italic (_italic_)" : "Italic (_miring_)"}
                >
                  <Italic className="w-3.5 h-3.5" />
                </button>
                <button
                  type="button"
                  onClick={() => editor?.chain().focus().toggleUnderline().run()}
                  className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive("underline")
                      ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-bold"
                      : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                    }`}
                  title="Underline"
                >
                  <UnderlineIcon className="w-3.5 h-3.5" />
                </button>

                {/* Email text alignments */}
                {channel === "email" && (
                  <>
                    <div className="w-px h-4 bg-[#DEE7DF] dark:bg-[#1F382B] mx-1" />
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().setTextAlign("left").run()}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive({ textAlign: "left" })
                          ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C]"
                          : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                        }`}
                      title={t("scheduler.modal_align_left")}
                    >
                      <AlignLeft className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().setTextAlign("center").run()}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive({ textAlign: "center" })
                          ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C]"
                          : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                        }`}
                      title={t("scheduler.modal_align_center")}
                    >
                      <AlignCenter className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().setTextAlign("right").run()}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive({ textAlign: "right" })
                          ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C]"
                          : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                        }`}
                      title={t("scheduler.modal_align_right")}
                    >
                      <AlignRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => editor?.chain().focus().setTextAlign("justify").run()}
                      className={`p-1.5 rounded-lg text-xs transition-colors cursor-pointer ${editor?.isActive({ textAlign: "justify" })
                          ? "bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C]"
                          : "text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21]"
                        }`}
                      title={t("scheduler.modal_align_justify")}
                    >
                      <AlignJustify className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}

                {/* Dynamic Variables Tag Dropdown */}
                <div className="relative ml-auto sm:ml-1">
                  <button
                    type="button"
                    onClick={() => {
                      setIsTemplateDropdownOpen(false);
                      setShowTagMenu(!showTagMenu);
                    }}
                    className="p-1.5 rounded-lg text-xs font-mono font-bold text-[#6B8075] dark:text-[#8EA096] hover:bg-[#F8FAF7] dark:hover:bg-[#162B21] transition-colors cursor-pointer flex items-center gap-1"
                    title={t("scheduler.modal_variables_tooltip")}
                  >
                    <Braces className="w-3.5 h-3.5 text-[#184530] dark:text-[#B8F55C]" />
                    <span className="text-[10px]">{t("scheduler.modal_variables_btn")}</span>
                  </button>

                  {showTagMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-30"
                        onClick={() => setShowTagMenu(false)}
                      />
                      <div className="absolute right-0 sm:left-0 top-full mt-1.5 w-56 max-h-60 overflow-y-auto rounded-xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-2xl p-1.5 z-40 space-y-0.5 animate-in zoom-in-95 duration-100">
                        <div className="px-2 py-1 text-[9px] font-bold text-[#8EA096] uppercase tracking-wider">
                          {t("scheduler.modal_select_tag")}
                        </div>
                        {[
                          { label: t("scheduler.modal_tag_name"), tag: "{{name}}" },
                          { label: t("scheduler.modal_tag_phone"), tag: "{{phone}}" },
                          ...(channel === "email"
                            ? [{ label: t("scheduler.modal_tag_email"), tag: "{{email}}" }]
                            : []),
                          { label: t("scheduler.modal_tag_date"), tag: "{{date}}" },
                          { label: t("scheduler.modal_tag_time"), tag: "{{time}}" },
                          { label: t("scheduler.modal_tag_ticket_id"), tag: "{{ticket_id}}" },
                          { label: t("scheduler.modal_tag_agent_name"), tag: "{{agent_name}}" },
                          { label: t("scheduler.modal_tag_company_name"), tag: "{{company_name}}" },
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

              {/* Tiptap Editor Content Area */}
              <EditorContent editor={editor} className="rounded-b-xl" />
            </div>
          </div>

          {/* Schedule Date & Recurrence Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6] mb-1">
                {t("scheduler.scheduled_time")} <span className="text-rose-500">*</span>
              </label>
              <input
                type="datetime-local"
                required
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] focus:outline-none focus:border-[#12281F]"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6] mb-1">
                {t("scheduler.recurrence")}
              </label>
              <select
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value)}
                className="w-full p-2.5 text-xs rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] focus:outline-none focus:border-[#12281F] cursor-pointer"
              >
                <option value="once">{t("scheduler.recurrence_once")}</option>
                <option value="daily">{t("scheduler.recurrence_daily")}</option>
                <option value="weekly">{t("scheduler.recurrence_weekly")}</option>
              </select>
            </div>
          </div>

          {/* Conflict Warning Banner with 1-Click Recommended Time */}
          {conflictInfo.hasConflict && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 space-y-2 animate-in fade-in duration-150">
              <div className="flex items-start gap-2.5">
                <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
                <div className="flex-1 space-y-1">
                  <span className="text-xs font-bold text-amber-800 dark:text-amber-300">
                    {t("scheduler.conflict_warning_title")}
                  </span>
                  <p className="text-[11px] text-amber-700 dark:text-amber-300/80 leading-relaxed">
                    {t("scheduler.conflict_warning_desc", {
                      channel: channel.toUpperCase(),
                      time: conflictTimeStr,
                    })}
                  </p>
                </div>
              </div>

              {conflictInfo.recommendedTime && (
                <div className="pt-1 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={handleApplyRecommendedTime}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-200/80 hover:bg-amber-300/80 dark:bg-amber-900/60 dark:hover:bg-amber-800/80 text-amber-900 dark:text-amber-200 text-[11px] font-semibold transition-colors cursor-pointer shadow-2xs"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>
                      {t("scheduler.use_recommended_time", { time: conflictTimeStr })}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Anti-Ban Strategy / Email Delivery Info Box */}
          {channel === "email" ? (
            <div className="p-3.5 rounded-2xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200 dark:border-sky-900/50 space-y-1.5">
              <span className="text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-sky-500" />
                {t("scheduler.email_info_title")}
              </span>
              <p className="text-[11px] text-[#556A60] dark:text-[#A5B8AD] leading-relaxed">
                {t("scheduler.modal_email_delivery_desc")}
              </p>
            </div>
          ) : (
            <div className="p-3.5 rounded-2xl bg-[#E5EFE7]/80 dark:bg-[#18362B]/40 border border-[#CFE2D3] dark:border-[#234235] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#184530] dark:text-[#B8F55C] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E]" />
                  {t("scheduler.modal_smart_mimicry_active")}
                </span>
                <label className="flex items-center gap-1.5 text-[11px] text-[#184530] dark:text-[#B8F55C] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={appendTicketId}
                    onChange={(e) => setAppendTicketId(e.target.checked)}
                    className="rounded text-[#184530] focus:ring-0"
                  />
                  <span>{t("scheduler.modal_append_ticket_id")}</span>
                </label>
              </div>
            </div>
          )}
        </form>

        {/* Fixed Sticky Footer Actions (Guaranteed never cut off on mobile) */}
        <div className="shrink-0 px-5 sm:px-6 py-3.5 border-t border-[#EEF3EF] dark:border-[#1F382B] bg-white dark:bg-[#12241C] flex items-center justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#EBF1EB] dark:bg-[#18362B] hover:bg-[#DCE6DD] dark:hover:bg-[#234A38] text-[#2D3E35] dark:text-[#D1DDD6] text-xs font-semibold cursor-pointer transition-colors"
          >
            {t("common.cancel")}
          </button>
          <button
            type="submit"
            form="new-schedule-form"
            onClick={handleSubmit}
            disabled={
              selectedTargets.length === 0 ||
              !editorText.trim() ||
              (channel === "email" && !subject.trim())
            }
            className="px-5 py-2 rounded-xl bg-[#12281F] hover:bg-[#1C3B2E] disabled:opacity-40 text-[#B8F55C] text-xs font-bold shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 border border-[#234235]"
          >
            <CalendarClock className="w-4 h-4 text-[#B8F55C]" />
            <span>
              {editingSchedule ? t("scheduler.btn_save_changes") : t("scheduler.modal_btn_save_schedule")}
              {selectedTargets.length > 0 ? ` (${selectedTargets.length})` : ""}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function NewScheduleModal() {
  const {
    isNewScheduleModalOpen,
    setIsNewScheduleModalOpen,
    editingSchedule,
    setEditingSchedule,
  } = useAsking();

  if (!isNewScheduleModalOpen) return null;

  const handleClose = () => {
    setIsNewScheduleModalOpen(false);
    setEditingSchedule(null);
  };

  return (
    <NewScheduleModalContent
      key={editingSchedule ? `edit-${editingSchedule.id}` : "new-schedule"}
      onClose={handleClose}
      editingSchedule={editingSchedule}
    />
  );
}
