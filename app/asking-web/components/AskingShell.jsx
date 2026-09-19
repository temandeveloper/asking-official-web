"use client";

import React from "react";
import { useAsking } from "../data/AskingContext";
import AskingSidebar from "./AskingSidebar";
import {
  AskingMobileHeader,
  AskingMobileBottomNav,
  AskingMobileDrawerMenu,
} from "./AskingMobileNav";
import DashboardView from "./views/DashboardView";
import MessagesView from "./views/MessagesView";
import TicketsView from "./views/TicketsView";
import SchedulerView from "./views/SchedulerView";
import ModulePlaceholderView from "./views/ModulePlaceholderView";
import TicketDrawer from "./tickets/TicketDrawer";
import NewScheduleModal from "./scheduler/NewScheduleModal";
import ToastContainer from "./shared/ToastContainer";
import RemoteLoadingOverlay from "./common/RemoteLoadingOverlay";

export default function AskingShell() {
  const { activeTab, theme, isMobileChatActive } = useAsking();

  return (
    <div
      data-theme={theme}
      className={`w-screen h-dvh flex flex-col bg-[#F8FAF7] dark:bg-[#0C1712] text-[#11231B] dark:text-[#F2F7F4] antialiased overflow-hidden select-none font-sans transition-colors duration-200 ${
        theme === "dark" ? "dark" : ""
      }`}
    >
      {/* Mobile Top Header Bar (< lg) - Hidden when mobile chat conversation is open to eliminate double-header */}
      {!(activeTab === "chat" && isMobileChatActive) && <AskingMobileHeader />}

      {/* Main Workspace Frame */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Desktop Left Sidebar (>= lg) */}
        <div className="hidden lg:block h-full shrink-0">
          <AskingSidebar />
        </div>

        {/* Dynamic Active Workspace View */}
        <main className="flex-1 h-full flex flex-col min-w-0 overflow-hidden relative pb-16 lg:pb-0">
          {activeTab === "home" && <DashboardView />}
          {activeTab === "chat" && <MessagesView />}
          {activeTab === "tickets" && <TicketsView />}
          {activeTab === "scheduler" && <SchedulerView />}

          {/* Other Menus (List Only -> Module Overview Placeholder) */}
          {activeTab !== "home" &&
            activeTab !== "chat" &&
            activeTab !== "tickets" &&
            activeTab !== "scheduler" && (
              <ModulePlaceholderView activeModuleId={activeTab} />
            )}
        </main>
      </div>

      {/* Mobile Bottom Navigation Bar (< lg) */}
      <AskingMobileBottomNav />

      {/* Global Ticket Drawer, Schedule Modal, Toast Container & Remote Connection Overlay */}
      <TicketDrawer />
      <NewScheduleModal />
      <ToastContainer />
      <RemoteLoadingOverlay />
    </div>
  );
}
