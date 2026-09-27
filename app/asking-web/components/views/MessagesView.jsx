"use client";

import React, { useState } from "react";
import { useAsking } from "../../data/AskingContext";
import { useTranslation } from "../../data/TranslationContext";
import ConversationList from "../messages/ConversationList";
import ChatWorkspace from "../messages/ChatWorkspace";
import NewChatModal from "../messages/NewChatModal";
import { WhatsAppLogo, TelegramLogo, EmailLogo } from "../shared/ChannelBadge";

export default function MessagesView() {
  const { userProfile, setIsMobileChatActive, channelStatuses = {} } = useAsking();
  const { t } = useTranslation();

  // Mobile master-detail view state: 'list' | 'chat'
  const [mobilePane, setMobilePane] = useState("list");

  // Cleanup on unmount
  React.useEffect(() => {
    return () => {
      setIsMobileChatActive(false);
    };
  }, [setIsMobileChatActive]);

  const handleSelectConversation = () => {
    setMobilePane("chat");
    setIsMobileChatActive(true);
  };

  const handleBackToList = () => {
    setMobilePane("list");
    setIsMobileChatActive(false);
  };

  const waStatus = channelStatuses?.whatsapp || "close";
  const tgStatus = channelStatuses?.telegram || "close";
  const emailStatus = channelStatuses?.email || "close";

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 bg-[#F8FAF7] dark:bg-[#0C1712] transition-colors duration-200 overflow-hidden">
      {/* Top Header Bar (Desktop only, hidden on mobile to avoid redundant header) */}
      <div className="hidden lg:flex h-12 px-6 bg-white dark:bg-[#12241C] border-b border-[#DEE7DF] dark:border-[#1F382B] items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-[#11231B] dark:text-[#F2F7F4]">
            {t("sidebar.nav_messages")}
          </h1>
        </div>

        {/* Omnichannel Status Indicator Pill */}
        <div className="flex items-center gap-2">
          <div
            className="flex items-center gap-3 px-3 py-1.5 rounded-full bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#234235] shadow-2xs"
            title="Status Saluran Pesan AsKing Desktop"
          >
            {/* 1. WhatsApp Status */}
            <div className="flex items-center gap-1.5" title={`WhatsApp: ${waStatus}`}>
              <div className="relative flex items-center justify-center">
                <WhatsAppLogo className="w-3.5 h-3.5 shrink-0" />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white dark:border-[#12241C] ${
                    waStatus === "open"
                      ? "bg-[#25D366] animate-pulse"
                      : waStatus === "connecting" || waStatus === "reconnecting"
                        ? "bg-amber-400 animate-ping"
                        : "bg-rose-500"
                  }`}
                />
              </div>
              <span className="text-[11px] font-medium text-[#556A60] dark:text-[#A5B8AD] hidden xl:inline">
                WA: {waStatus === "open" ? (t("channels.status_open") || "Terhubung") : waStatus === "connecting" || waStatus === "reconnecting" ? (t("channels.status_connecting") || "Menghubungkan...") : (t("channels.status_close") || "Terputus")}
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-3 bg-[#DEE7DF] dark:bg-[#234235]" />

            {/* 2. Telegram Status */}
            <div className="flex items-center gap-1.5" title={`Telegram: ${tgStatus}`}>
              <div className="relative flex items-center justify-center">
                <TelegramLogo className="w-3.5 h-3.5 shrink-0" />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white dark:border-[#12241C] ${
                    tgStatus === "open"
                      ? "bg-[#25D366] animate-pulse"
                      : tgStatus === "connecting"
                        ? "bg-amber-400 animate-ping"
                        : "bg-rose-500"
                  }`}
                />
              </div>
              <span className="text-[11px] font-medium text-[#556A60] dark:text-[#A5B8AD] hidden xl:inline">
                TG: {tgStatus === "open" ? (t("channels.status_open") || "Terhubung") : tgStatus === "connecting" ? (t("channels.status_connecting") || "Menghubungkan...") : (t("channels.status_close") || "Terputus")}
              </span>
            </div>

            {/* Divider */}
            <div className="w-px h-3 bg-[#DEE7DF] dark:bg-[#234235]" />

            {/* 3. Email Status */}
            <div className="flex items-center gap-1.5" title={`Email: ${emailStatus}`}>
              <div className="relative flex items-center justify-center">
                <EmailLogo className="w-3.5 h-3.5 shrink-0" />
                <span
                  className={`absolute -bottom-0.5 -right-0.5 w-1.5 h-1.5 rounded-full border border-white dark:border-[#12241C] ${
                    emailStatus === "open"
                      ? "bg-[#25D366] animate-pulse"
                      : emailStatus === "connecting"
                        ? "bg-amber-400 animate-ping"
                        : "bg-rose-500"
                  }`}
                />
              </div>
              <span className="text-[11px] font-medium text-[#556A60] dark:text-[#A5B8AD] hidden xl:inline">
                Email: {emailStatus === "open" ? (t("channels.status_open") || "Terhubung") : emailStatus === "connecting" ? (t("channels.status_connecting") || "Menghubungkan...") : (t("channels.status_close") || "Terputus")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Split Pane / Master-Detail Content */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Conversation List: Always visible on desktop, toggleable on mobile */}
        <div
          className={`w-full lg:w-80 h-full shrink-0 ${
            mobilePane === "chat" ? "hidden lg:block" : "block"
          }`}
        >
          <ConversationList onSelectConversation={handleSelectConversation} />
        </div>

        {/* Chat Workspace: Always visible on desktop, toggleable on mobile */}
        <div
          className={`flex-1 h-full min-w-0 ${
            mobilePane === "list" ? "hidden lg:flex" : "flex flex-col"
          }`}
        >
          <ChatWorkspace onBackToList={handleBackToList} />
        </div>
      </div>

      {/* New Chat Modal */}
      <NewChatModal />
    </div>
  );
}
