"use client";

import React, { useState } from "react";
import { useAsking } from "../../data/AskingContext";
import { useTranslation } from "../../data/TranslationContext";
import ConversationList from "../messages/ConversationList";
import ChatWorkspace from "../messages/ChatWorkspace";
import NewChatModal from "../messages/NewChatModal";
import { WhatsAppLogo, TelegramLogo, EmailLogo } from "../shared/ChannelBadge";

export default function MessagesView() {
  const { userProfile, setIsMobileChatActive } = useAsking();
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

  return (
    <div className="flex-1 h-full flex flex-col min-w-0 bg-[#F8FAF7] dark:bg-[#0C1712] transition-colors duration-200 overflow-hidden">
      {/* Top Header Bar (Desktop only, hidden on mobile to avoid redundant header) */}
      <div className="hidden lg:flex h-12 px-6 bg-white dark:bg-[#12241C] border-b border-[#DEE7DF] dark:border-[#1F382B] items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-3">
          <h1 className="text-sm font-bold text-[#11231B] dark:text-[#F2F7F4]">
            {t("sidebar.nav_messages")}
          </h1>
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
