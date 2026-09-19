"use client";

import React, { useMemo } from "react";
import { useAsking } from "../../data/AskingContext";
import { useTranslation } from "../../data/TranslationContext";
import ContactAvatar from "../shared/ContactAvatar";
import { WhatsAppLogo, TelegramLogo, EmailLogo } from "../shared/ChannelBadge";
import { MessagesListSkeleton } from "../common/daisySkeletons";
import {
  Search,
  MessageSquareDot,
  Check,
  CheckCheck,
  Clock,
  UserPlus,
  Mail,
} from "lucide-react";

export default function ConversationList({ onSelectConversation }) {
  const {
    conversations,
    activeJid,
    setActiveJid,
    searchConversationQuery,
    setSearchConversationQuery,
    filterUnreadOnly,
    setFilterUnreadOnly,
    setIsNewChatModalOpen,
    isRemoteLoading,
    addToast,
  } = useAsking();
  const { t } = useTranslation();

  // Filter conversations
  const filteredConversations = useMemo(() => {
    return (conversations || []).filter((c) => {
      // Only display conversations that have actual messages or are currently active (matching Desktop logic)
      const hasMessage = Boolean(
        (c.lastMessage &&
          c.lastMessage.trim().length > 0 &&
          c.lastMessage !== "No messages yet") ||
          (c.unreadCount && c.unreadCount > 0),
      );
      if (!hasMessage && c.jid !== activeJid) {
        return false;
      }

      const q = (searchConversationQuery || "").toLowerCase();
      const matchesSearch =
        (c.name || "").toLowerCase().includes(q) ||
        (c.phone || "").includes(q) ||
        (c.email || "").toLowerCase().includes(q) ||
        (c.lastMessage || "").toLowerCase().includes(q);

      if (filterUnreadOnly) {
        return matchesSearch && (c.unreadCount || 0) > 0;
      }
      return matchesSearch;
    });
  }, [conversations, activeJid, searchConversationQuery, filterUnreadOnly]);

  const formatTimestamp = (ts) => {
    if (!ts) return "";
    const date = new Date(ts);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  return (
    <div className="w-full h-full bg-white dark:bg-[#0C1712] border-r border-[#DEE7DF] dark:border-[#1F382B] flex flex-col shrink-0 select-none transition-colors duration-200">
      {/* Top Header: Search Pill + Filter + New Chat Button */}
      <div className="p-3.5 border-b border-[#EEF3EF] dark:border-[#1F382B] space-y-3">
        <div className="flex items-center gap-2">
          {/* Search Bar Input Pill */}
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#6B8075] dark:text-[#8EA096]" />
            <input
              type="text"
              placeholder={t("messages.search_placeholder") || "Cari kontak, pesan, nomor..."}
              value={searchConversationQuery}
              onChange={(e) => setSearchConversationQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs rounded-full bg-[#F8FAF7] dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] text-[#11231B] dark:text-[#F2F7F4] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F] dark:focus:border-[#B8F55C] transition-colors"
            />
          </div>

          {/* Filter Unread Button */}
          <button
            type="button"
            onClick={() => setFilterUnreadOnly(!filterUnreadOnly)}
            className={`p-1.5 rounded-lg text-[#6B8075] hover:text-[#11231B] dark:text-[#A5B8AD] dark:hover:text-[#F2F7F4] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer ${
              filterUnreadOnly
                ? "text-[#184530] dark:text-[#B8F55C] bg-[#E5EFE7] dark:bg-[#18362B]"
                : ""
            }`}
            title={t("messages.filter_unread") || "Filter pesan belum dibaca"}
          >
            <MessageSquareDot className="w-4 h-4" />
          </button>
        </div>

        {/* Start New Message Button */}
        <button
          type="button"
          onClick={() => setIsNewChatModalOpen(true)}
          className="w-full py-2 px-3 rounded-xl bg-[#EBF1EB] hover:bg-[#DCE6DD] dark:bg-[#18362B] dark:hover:bg-[#234A38] text-[#184530] dark:text-[#B8F55C] text-xs font-semibold flex items-center justify-center gap-1.5 transition-all shadow-2xs active:scale-98 cursor-pointer border border-[#DEE7DF]/60 dark:border-[#1F382B]"
        >
          <UserPlus className="w-3.5 h-3.5 text-[#184530] dark:text-[#B8F55C]" />
          <span>{t("messages.start_new_chat") || "Mulai Percakapan Baru"}</span>
        </button>
      </div>

      {/* Conversations Scrollable List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#EEF3EF] dark:divide-[#1F382B]/60 scrollbar-thin-subtle pb-20 lg:pb-2">
        {isRemoteLoading ? (
          <MessagesListSkeleton />
        ) : filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-[#8EA096] dark:text-[#6E8578] space-y-2">
            <p className="text-xs font-semibold">{t("messages.empty_desc") || "Tidak ada percakapan ditemukan"}</p>
            {filterUnreadOnly && (
              <button
                type="button"
                onClick={() => setFilterUnreadOnly(false)}
                className="text-[#184530] dark:text-[#B8F55C] hover:underline font-bold text-xs cursor-pointer"
              >
                {t("messages.filter_all") || "Tampilkan semua percakapan"}
              </button>
            )}
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = activeJid === conv.jid;
            const hasUnread = (conv.unreadCount || 0) > 0;
            const isTg = conv.channel === "telegram";
            const isEmail = conv.channel === "email";

            return (
              <div
                key={conv.jid}
                onClick={() => {
                  setActiveJid(conv.jid);
                  onSelectConversation?.();
                }}
                className={`p-3 cursor-pointer transition-all flex items-center gap-3 text-left ${
                  isActive
                    ? "bg-[#E5EFE7] dark:bg-[#162B21] border-l-3 border-l-[#12281F] dark:border-l-[#B8F55C]"
                    : "hover:bg-[#F8FAF7] dark:hover:bg-[#12241C]"
                }`}
              >
                {/* Contact Avatar + Channel SVG Badge */}
                <div className="relative shrink-0">
                  <ContactAvatar
                    seed={conv.name}
                    className="w-10 h-10 rounded-full"
                    alt={conv.name}
                  />
                  <div className="absolute -bottom-1 -right-1">
                    {isTg ? (
                      <TelegramLogo className="w-3.5 h-3.5 drop-shadow-xs" />
                    ) : isEmail ? (
                      <EmailLogo className="w-3.5 h-3.5 drop-shadow-xs" />
                    ) : (
                      <WhatsAppLogo className="w-3.5 h-3.5 drop-shadow-xs" />
                    )}
                  </div>
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3
                        className={`text-xs truncate ${
                          hasUnread
                            ? "font-bold text-[#11231B] dark:text-[#F2F7F4]"
                            : "font-semibold text-[#2D3E35] dark:text-[#D1DDD6]"
                        }`}
                      >
                        {conv.name}
                      </h3>
                      {conv.isHumanSupport && (
                        <span className="px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[9px] font-extrabold shrink-0 border border-amber-200/80 dark:border-amber-800/40">
                          Human
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] text-[#8EA096] dark:text-[#6E8578] shrink-0 ml-1">
                      {formatTimestamp(conv.lastMessageTime)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-1.5">
                    <p
                      className={`text-[11px] truncate flex-1 ${
                        conv.isTyping
                          ? "text-[#22C55E] dark:text-[#B8F55C] font-semibold italic animate-pulse"
                          : hasUnread
                            ? "text-[#11231B] dark:text-[#F2F7F4] font-medium"
                            : "text-[#6B8075] dark:text-[#8EA096]"
                      }`}
                    >
                      {conv.isTyping
                        ? (t("messages.typing") || "sedang mengetik...")
                        : conv.lastMessage || (t("messages.no_messages") || "Belum ada pesan")}
                    </p>

                    {/* Unread badge OR Outgoing Message Status Check */}
                    {hasUnread ? (
                      <span className="min-w-4.5 h-4 px-1.5 rounded-full bg-[#12281F] dark:bg-[#B8F55C] text-[#B8F55C] dark:text-[#12281F] text-[10px] font-bold flex items-center justify-center shrink-0 shadow-xs">
                        {conv.unreadCount}
                      </span>
                    ) : conv.lastMessageFromMe ? (
                      <span className="shrink-0">
                        <CheckCheck
                          className="w-3.5 h-3.5 text-[#22C55E]"
                          title={t("messages.status_read") || "Dibaca"}
                        />
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
