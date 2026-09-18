"use client";

import React, { useState } from "react";
import { useAsking } from "../../data/AskingContext";
import { useTranslation } from "../../data/TranslationContext";
import { WhatsAppLogo, TelegramLogo, EmailLogo } from "../shared/ChannelBadge";
import {
  MessageSquarePlus,
  X,
  Phone,
  User,
  Send,
  Mail,
  Search,
} from "lucide-react";

export default function NewChatModal() {
  const { t } = useTranslation();
  const {
    isNewChatModalOpen,
    setIsNewChatModalOpen,
    startNewChat,
    conversations,
  } = useAsking();

  const [tab, setTab] = useState("direct"); // 'direct' | 'contact'
  const [channel, setChannel] = useState("whatsapp"); // 'whatsapp' | 'telegram' | 'email'
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [contactFilter, setContactFilter] = useState("");

  if (!isNewChatModalOpen) return null;

  const handleClose = () => {
    setIsNewChatModalOpen(false);
  };

  const handleDirectSubmit = (e) => {
    e.preventDefault();
    if (!phone.trim()) return;

    if (channel === "email") {
      startNewChat({
        email: phone.trim(),
        name: name.trim(),
        channel: "email",
      });
    } else {
      startNewChat({
        phone: phone.trim(),
        name: name.trim(),
        channel,
      });
    }

    setPhone("");
    setName("");
  };

  const handleSelectContact = (contact) => {
    const isEmail =
      contact.channel === "email" || contact.jid?.startsWith("email:");
    const isTg =
      !isEmail &&
      (contact.channel === "telegram" || contact.jid?.startsWith("tg_"));
    const contactChannel = isEmail ? "email" : isTg ? "telegram" : "whatsapp";

    startNewChat({
      jid: contact.jid,
      phone: contact.phone,
      email: contact.email,
      name: contact.name,
      channel: contactChannel,
    });
  };

  const filteredContacts = (conversations || []).filter((c) => {
    const query = contactFilter.toLowerCase();
    return (
      (c.name || "").toLowerCase().includes(query) ||
      (c.phone || "").includes(query) ||
      (c.email || "").toLowerCase().includes(query)
    );
  });

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 select-none animate-in fade-in duration-150">
      {/* Backdrop */}
      <div
        onClick={handleClose}
        className="fixed inset-0"
      />

      {/* Modal Dialog (Responsive: bottom sheet on mobile, rounded-3xl dialog on desktop) */}
      <div className="relative w-full max-w-md max-h-[92vh] sm:max-h-[85vh] rounded-t-3xl sm:rounded-3xl bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] p-5 sm:p-6 space-y-4 shadow-2xl z-10 flex flex-col animate-in zoom-in-95 duration-150 text-[#11231B] dark:text-[#F2F7F4] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#EEF3EF] dark:border-[#1F382B] pb-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-2xl bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] border border-[#CFE2D3] dark:border-[#234235] flex items-center justify-center shadow-2xs">
              <MessageSquarePlus className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-[#11231B] dark:text-[#F2F7F4]">
                {t("new_chat.modal_title")}
              </h3>
              <p className="text-[11px] text-[#556A60] dark:text-[#A5B8AD]">
                {t("new_chat.modal_subtitle")}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-lg text-[#6B8075] hover:text-[#11231B] dark:hover:text-[#F2F7F4] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab switcher: Pesan Langsung vs Dari Kontak */}
        <div className="flex items-center gap-1 p-1 bg-[#EBF1EB] dark:bg-[#18362B] rounded-xl border border-[#DEE7DF] dark:border-[#1F382B] shrink-0">
          <button
            type="button"
            onClick={() => setTab("direct")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${tab === "direct"
                ? "bg-[#12281F] text-white dark:bg-[#12241C] dark:text-[#B8F55C] shadow-xs font-bold"
                : "text-[#556A60] dark:text-[#A5B8AD] hover:text-[#11231B] dark:hover:text-[#F2F7F4]"
              }`}
          >
            {t("new_chat.tab_direct")}
          </button>
          <button
            type="button"
            onClick={() => setTab("contact")}
            className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${tab === "contact"
                ? "bg-[#12281F] text-white dark:bg-[#12241C] dark:text-[#B8F55C] shadow-xs font-bold"
                : "text-[#556A60] dark:text-[#A5B8AD] hover:text-[#11231B] dark:hover:text-[#F2F7F4]"
              }`}
          >
            {t("new_chat.tab_contact", { count: conversations.length })}
          </button>
        </div>

        {/* Tab 1: Pesan Langsung (Direct Form) */}
        {tab === "direct" ? (
          <form onSubmit={handleDirectSubmit} className="flex-1 overflow-y-auto space-y-3.5 pr-0.5">
            {/* Platform / Channel Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6] mb-1.5">
                {t("new_chat.select_channel")}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setChannel("whatsapp")}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${channel === "whatsapp"
                      ? "bg-[#25D366]/10 border-[#25D366] text-[#25D366] shadow-xs"
                      : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] text-[#556A60] dark:text-[#A5B8AD]"
                    }`}
                >
                  <WhatsAppLogo className="w-4 h-4" />
                  <span>WhatsApp</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel("telegram")}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${channel === "telegram"
                      ? "bg-[#229ED9]/10 border-[#229ED9] text-[#229ED9] shadow-xs"
                      : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] text-[#556A60] dark:text-[#A5B8AD]"
                    }`}
                >
                  <TelegramLogo className="w-4 h-4" />
                  <span>Telegram</span>
                </button>
                <button
                  type="button"
                  onClick={() => setChannel("email")}
                  className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${channel === "email"
                      ? "bg-sky-500/10 border-sky-500 text-sky-600 dark:text-sky-400 shadow-xs"
                      : "bg-[#F8FAF7] dark:bg-[#162B21] border-[#DEE7DF] dark:border-[#1F382B] text-[#556A60] dark:text-[#A5B8AD]"
                    }`}
                >
                  <EmailLogo className="w-4 h-4" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            {/* Target Address / Phone / Username */}
            <div>
              <label className="block text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6] mb-1">
                {channel === "email"
                  ? t("new_chat.label_email")
                  : channel === "telegram"
                    ? t("new_chat.label_tg")
                    : t("new_chat.label_wa")}
              </label>
              <div className="relative">
                {channel === "email" ? (
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B8075] dark:text-[#8EA096]" />
                ) : (
                  <Phone className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B8075] dark:text-[#8EA096]" />
                )}
                <input
                  type={channel === "email" ? "email" : "text"}
                  required
                  placeholder={
                    channel === "email"
                      ? t("new_chat.ph_email")
                      : channel === "telegram"
                        ? t("new_chat.ph_tg")
                        : t("new_chat.ph_wa")
                  }
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] focus:outline-none focus:border-[#184530] dark:focus:border-[#B8F55C]"
                />
              </div>
            </div>

            {/* Contact Name (Optional) */}
            <div>
              <label className="block text-xs font-semibold text-[#2D3E35] dark:text-[#D1DDD6] mb-1">
                {t("new_chat.contact_name_optional")}
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B8075] dark:text-[#8EA096]" />
                <input
                  type="text"
                  placeholder={t("new_chat.contact_name_placeholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] focus:outline-none focus:border-[#184530] dark:focus:border-[#B8F55C]"
                />
              </div>
            </div>

            {/* Form Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#EEF3EF] dark:border-[#1F382B]">
              <button
                type="button"
                onClick={handleClose}
                className="px-4 py-2 rounded-xl bg-[#EBF1EB] dark:bg-[#18362B] hover:bg-[#DCE6DD] dark:hover:bg-[#234A38] text-[#2D3E35] dark:text-[#D1DDD6] text-xs font-semibold cursor-pointer"
              >
                {t("common.cancel")}
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-semibold shadow-xs cursor-pointer border border-[#234235] flex items-center gap-1.5 active:scale-95 transition-all"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{t("new_chat.btn_open_message")}</span>
              </button>
            </div>
          </form>
        ) : (
          /* Tab 2: Pilih Dari Kontak Tersimpan */
          <div className="flex-1 flex flex-col min-h-0 space-y-3">
            <div className="relative shrink-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#8EA096]" />
              <input
                type="text"
                placeholder={t("new_chat.search_contacts_ph")}
                value={contactFilter}
                onChange={(e) => setContactFilter(e.target.value)}
                className="w-full pl-8 pr-3 py-2 text-xs rounded-xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] focus:outline-none focus:border-[#184530] dark:focus:border-[#B8F55C]"
              />
            </div>

            <div className="flex-1 max-h-56 overflow-y-auto space-y-1.5 divide-y divide-[#EEF3EF] dark:divide-[#1F382B]/60 scrollbar-thin-subtle pr-1">
              {filteredContacts.length === 0 ? (
                <div className="py-8 text-center text-xs text-[#8EA096] dark:text-[#6E8578]">
                  {t("new_chat.no_contacts_found")}
                </div>
              ) : (
                filteredContacts.map((c) => {
                  const isEmail =
                    c.channel === "email" || c.jid?.startsWith("email:");
                  const isTg =
                    !isEmail &&
                    (c.channel === "telegram" || c.jid?.startsWith("tg_"));

                  return (
                    <button
                      key={c.jid}
                      type="button"
                      onClick={() => handleSelectContact(c)}
                      className="w-full p-2.5 rounded-xl hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] text-left transition-all flex items-center justify-between cursor-pointer group pt-2"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-7 h-7 rounded-lg bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] flex items-center justify-center shrink-0">
                          {isEmail ? (
                            <EmailLogo className="w-4 h-4" />
                          ) : isTg ? (
                            <TelegramLogo className="w-4 h-4" />
                          ) : (
                            <WhatsAppLogo className="w-4 h-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-[#11231B] dark:text-[#F2F7F4] truncate group-hover:text-[#184530] dark:group-hover:text-[#B8F55C] transition-colors">
                            {c.name}
                          </p>
                          <p className="text-[10px] text-[#6B8075] dark:text-[#8EA096] truncate">
                            {c.email || c.phone || c.jid}
                          </p>
                        </div>
                      </div>

                      <span className="text-[10px] font-bold text-[#184530] dark:text-[#B8F55C] group-hover:underline shrink-0 ml-2">
                        {t("new_chat.select_action")}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
