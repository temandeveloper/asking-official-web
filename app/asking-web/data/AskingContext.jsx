"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "./TranslationContext";
import {
  INITIAL_USER_PROFILE,
  INITIAL_CONVERSATIONS,
  INITIAL_TICKETS,
  INITIAL_SCHEDULES,
  INITIAL_TEMPLATES,
} from "./dummyData";

const AskingContext = createContext(null);

export function AskingProvider({ children }) {
  const { t } = useTranslation();

  // 1. Navigation & Theme
  const [activeTab, setActiveTab] = useState("home"); // 'home' | 'chat' | 'tickets' | ...
  const [theme, setTheme] = useState("light");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  // Sync theme to root element for daisyUI and Tailwind v4 dark variant
  const applyThemeToDOM = (themeMode) => {
    if (typeof document === "undefined") return;
    const isDark = themeMode === "dark";
    if (isDark) {
      document.documentElement.classList.add("dark");
      document.documentElement.setAttribute("data-theme", "dark");
      document.body.classList.remove("light");
      document.body.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
      document.documentElement.setAttribute("data-theme", "light");
      document.body.classList.remove("dark");
      document.body.classList.add("light");
    }
  };

  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("asking_web_theme") : null;
    const initialTheme = saved === "dark" || saved === "light" ? saved : "light";
    setTheme(initialTheme);
    applyThemeToDOM(initialTheme);
  }, []);

  useEffect(() => {
    applyThemeToDOM(theme);
  }, [theme]);

  const toggleTheme = useCallback(() => {
    setTheme((prev) => {
      const next = prev === "light" ? "dark" : "light";
      if (typeof window !== "undefined") {
        localStorage.setItem("asking_web_theme", next);
      }
      return next;
    });
  }, []);

  // 2. User Profile & System State
  const [userProfile, setUserProfile] = useState(INITIAL_USER_PROFILE);
  const [schedules, setSchedules] = useState(INITIAL_SCHEDULES);
  const [templates] = useState(INITIAL_TEMPLATES);
  const [filterScheduleStatus, setFilterScheduleStatus] = useState("all");
  const [isNewScheduleModalOpen, setIsNewScheduleModalOpen] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState(null);

  // 3. Toasts Notification
  const [toasts, setToasts] = useState([]);
  const addToast = useCallback((message, type = "info") => {
    const id = Date.now() + Math.random().toString(36).substring(2, 6);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3200);
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  // 4. Scheduler Automation Handlers
  const addScheduledMessage = useCallback((newSchedule) => {
    const item = {
      ...newSchedule,
      id: newSchedule.id || `sch_${Date.now()}`,
      status: "pending",
      scheduledTime: typeof newSchedule.scheduledTime === "string" 
        ? new Date(newSchedule.scheduledTime).getTime() 
        : (newSchedule.scheduledTime || Date.now() + 3600 * 1000),
      recipientsCount: newSchedule.recipientsCount || 1,
      recurrence: newSchedule.recurrence || "once",
    };
    setSchedules((prev) => [item, ...prev]);
    addToast(t("common.toast_schedule_created"), "success");
    setIsNewScheduleModalOpen(false);
    setEditingSchedule(null);
  }, [addToast, t]);

  const updateScheduledMessage = useCallback((id, updates) => {
    setSchedules((prev) =>
      prev.map((s) => (s.id === id ? { ...s, ...updates } : s))
    );
    addToast(t("common.toast_schedule_updated"), "success");
    setIsNewScheduleModalOpen(false);
    setEditingSchedule(null);
  }, [addToast, t]);

  const deleteScheduledMessage = useCallback((id) => {
    setSchedules((prev) => prev.filter((s) => s.id !== id));
    addToast(t("common.toast_schedule_deleted"), "info");
  }, [addToast, t]);

  const dispatchScheduledItem = useCallback((item) => {
    addToast(t("common.toast_schedule_sending"), "info");
    setTimeout(() => {
      setSchedules((prev) =>
        prev.map((s) =>
          s.id === item.id
            ? { ...s, status: "sent", sentAt: Date.now() }
            : s
        )
      );
      addToast(t("common.toast_schedule_sent"), "success");
    }, 900);
  }, [addToast, t]);

  // 4. Conversations & Messages
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [activeJid, setActiveJidState] = useState(INITIAL_CONVERSATIONS[0].jid);
  const [searchConversationQuery, setSearchConversationQuery] = useState("");
  const [filterUnreadOnly, setFilterUnreadOnly] = useState(false);
  const [replyingToMessage, setReplyingToMessage] = useState(null);
  const [isMobileChatActive, setIsMobileChatActive] = useState(false);

  // Set active JID and clear unread count
  const setActiveJid = useCallback((jid) => {
    setActiveJidState(jid);
    setConversations((prev) =>
      prev.map((c) => (c.jid === jid ? { ...c, unreadCount: 0 } : c))
    );
  }, []);

  const activeConversation = useMemo(() => {
    return conversations.find((c) => c.jid === activeJid) || conversations[0];
  }, [conversations, activeJid]);

  // Send message and simulate realistic auto-reply
  const sendMessage = useCallback(
    (text, attachments = [], replyTo = null, extra = {}) => {
      if (!text?.trim() && attachments.length === 0) return;

      const targetJid = activeJid;
      const newMsgId = "msg_out_" + Date.now();
      const newOutMsg = {
        id: newMsgId,
        text: text.trim(),
        timestamp: new Date().toISOString(),
        isMe: true,
        status: "sent",
        attachments: attachments || [],
        replyTo: replyTo || undefined,
        ...extra,
      };

      // Add message immediately
      setConversations((prev) =>
        prev.map((c) => {
          if (c.jid !== targetJid) return c;
          return {
            ...c,
            lastMessage: text.trim() || (attachments[0]?.name ? `Lampiran: ${attachments[0].name}` : "Pesan dikirim"),
            lastMessageTime: new Date().toISOString(),
            lastMessageFromMe: true,
            messages: [...c.messages, newOutMsg],
          };
        })
      );

      setReplyingToMessage(null);

      // Simulate status delivered after 500ms
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.jid !== targetJid) return c;
            return {
              ...c,
              messages: c.messages.map((m) =>
                m.id === newMsgId ? { ...m, status: "delivered" } : m
              ),
            };
          })
        );
      }, 500);

      // Simulate status read after 1000ms and show typing
      setTimeout(() => {
        setConversations((prev) =>
          prev.map((c) => {
            if (c.jid !== targetJid) return c;
            return {
              ...c,
              isTyping: true,
              messages: c.messages.map((m) =>
                m.id === newMsgId ? { ...m, status: "read" } : m
              ),
            };
          })
        );
      }, 1000);

      // Simulate automated smart reply from client after 2200ms
      setTimeout(() => {
        const replies = [
          "Baik, pesan Anda telah kami terima. Segera kami tinjau dan konfirmasikan kembali.",
          "Terima kasih informasinya. Tim operasional AsKing telah mencatat update terbaru ini.",
          "Siap, kami akan koordinasikan dengan PIC terkait dan mengabari hasilnya secepat mungkin.",
          "Diterima dengan baik. Laporan tiket sistem telah otomatis diperbarui.",
        ];
        const randomReply = replies[Math.floor(Math.random() * replies.length)];
        const replyMsg = {
          id: "msg_in_" + Date.now(),
          text: randomReply,
          timestamp: new Date().toISOString(),
          isMe: false,
          status: "delivered",
        };

        setConversations((prev) =>
          prev.map((c) => {
            if (c.jid !== targetJid) return c;
            return {
              ...c,
              isTyping: false,
              lastMessage: randomReply,
              lastMessageTime: new Date().toISOString(),
              lastMessageFromMe: false,
              messages: [...c.messages, replyMsg],
            };
          })
        );
      }, 2300);
    },
    [activeJid]
  );

  const toggleConversationHumanSupport = useCallback((jid) => {
    setConversations((prev) =>
      prev.map((c) => {
        if (c.jid !== jid) return c;
        const next = !c.isHumanSupport;
        addToast(
          next
            ? t("common.toast_human_support_active")
            : t("common.toast_ai_agent_active"),
          "info"
        );
        return { ...c, isHumanSupport: next };
      })
    );
  }, [addToast, t]);

  const deleteConversation = useCallback(
    (jid) => {
      setConversations((prev) => {
        const next = prev.filter((c) => c.jid !== jid);
        if (activeJid === jid) {
          setActiveJidState(next[0]?.jid || null);
        }
        return next;
      });
      addToast(t("common.toast_chat_deleted"), "warning");
    },
    [activeJid, addToast, t]
  );

  // New Chat Modal State & Action
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);

  const startNewChat = useCallback(
    ({ phone, email, name, channel = "whatsapp", jid }) => {
      let targetJid = jid;
      if (!targetJid) {
        if (channel === "email") {
          targetJid = `email:${email || phone}`;
        } else if (channel === "telegram") {
          targetJid = `tg_${phone?.replace(/[^a-zA-Z0-9_]/g, "") || Date.now()}`;
        } else {
          targetJid = `wa_${phone?.replace(/[^0-9]/g, "") || Date.now()}`;
        }
      }

      // Check existing
      const cleanPhone = phone?.trim();
      const cleanEmail = email?.trim();
      const existing = conversations.find(
        (c) =>
          c.jid === targetJid ||
          (cleanPhone && c.phone === cleanPhone) ||
          (cleanEmail && c.email === cleanEmail)
      );

      if (existing) {
        setActiveJid(existing.jid);
        addToast(t("common.toast_chat_opened", { name: existing.name }), "info");
      } else {
        const newConv = {
          jid: targetJid,
          name: name?.trim() || cleanPhone || cleanEmail || "Kontak Baru",
          phone: cleanPhone || "",
          email: cleanEmail || "",
          channel,
          unreadCount: 0,
          lastMessage: "Percakapan baru dimulai",
          lastMessageTime: new Date().toISOString(),
          messages: [
            {
              id: "msg_init_" + Date.now(),
              text: `Percakapan baru via ${channel.toUpperCase()} dimulai.`,
              timestamp: new Date().toISOString(),
              isMe: true,
              status: "read",
            },
          ],
          isOnline: true,
        };
        setConversations((prev) => [newConv, ...prev]);
        setActiveJid(targetJid);
        addToast(t("common.toast_chat_created", { name: newConv.name }), "success");
      }

      setIsNewChatModalOpen(false);
      setActiveTab("chat");
    },
    [conversations, setActiveJid, setActiveTab, addToast, t]
  );

  // 5. CRM Tickets Management
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [ticketSearchQuery, setTicketSearchQuery] = useState("");
  const [ticketCategoryFilter, setTicketCategoryFilter] = useState("all");
  const [ticketPriorityFilter, setTicketPriorityFilter] = useState("all");
  const [ticketStatusFilter, setTicketStatusFilter] = useState("all");
  const [ticketDateFilter, setTicketDateFilter] = useState("all");
  const [ticketDeadlineFilter, setTicketDeadlineFilter] = useState("all"); // 'all' | 'today' | 'tomorrow' | 'thisWeek' | 'overdue' | 'none'
  const [ticketViewMode, setTicketViewMode] = useState("table"); // 'table' only

  // Modals & Drawer State
  const [isTicketDrawerOpen, setIsTicketDrawerOpen] = useState(false);
  const [ticketDrawerMode, setTicketDrawerMode] = useState("create"); // 'create' | 'edit' | 'readonly'
  const [editingTicket, setEditingTicket] = useState(null); // null = create new
  const [isQuickTicketModalOpen, setIsQuickTicketModalOpen] = useState(false);
  const [quickTicketInitialData, setQuickTicketInitialData] = useState(null);

  // Update ticket status (used in Drag-and-Drop and fast move)
  const updateTicketStatus = useCallback((ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((ticket) => (ticket.id === ticketId ? { ...ticket, status: newStatus } : ticket))
    );
    addToast(t("common.toast_ticket_status_updated", { ticketId, newStatus }), "success");
  }, [addToast, t]);

  // Save ticket (create or edit)
  const saveTicket = useCallback(
    (ticketData) => {
      if (ticketData.id) {
        // Edit existing
        setTickets((prev) =>
          prev.map((ticket) => {
            if (ticket.id !== ticketData.id) return ticket;
            const activities = Array.isArray(ticket.activity) ? [...ticket.activity] : [];
            if (ticketData.status && ticketData.status !== ticket.status) {
              activities.push({
                type: "status_change",
                field: "status",
                oldValue: ticket.status,
                newValue: ticketData.status,
                timestamp: Date.now(),
              });
            }
            if (ticketData.priority && ticketData.priority !== ticket.priority) {
              activities.push({
                type: "priority_change",
                field: "priority",
                oldValue: ticket.priority,
                newValue: ticketData.priority,
                timestamp: Date.now(),
              });
            }
            return {
              ...ticket,
              ...ticketData,
              activity: ticketData.activity || activities,
            };
          })
        );
        addToast(t("common.toast_ticket_updated", { id: ticketData.id }), "success");
      } else {
        // Create new
        const nextId = "TKT-" + (100 + tickets.length + 1);
        const newTicket = {
          ...ticketData,
          id: nextId,
          createdAt: new Date().toISOString(),
          status: ticketData.status || "New",
          priority: ticketData.priority || "medium",
          category: ticketData.category || "support",
          activity: [
            {
              type: "created",
              description: `Tiket dibuat oleh operator`,
              timestamp: Date.now(),
            },
          ],
        };
        setTickets((prev) => [newTicket, ...prev]);
        addToast(t("common.toast_ticket_created", { id: nextId }), "success");
      }
      setIsTicketDrawerOpen(false);
      setEditingTicket(null);
    },
    [tickets.length, addToast, t]
  );

  // Append manual note to ticket activity
  const appendTicketNote = useCallback(
    (ticketId, noteText) => {
      if (!noteText.trim()) return;
      const noteEntry = {
        type: "note",
        description: noteText.trim(),
        timestamp: Date.now(),
      };
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === ticketId
            ? { ...ticket, activity: [...(ticket.activity || []), noteEntry] }
            : ticket
        )
      );
      setEditingTicket((prev) => {
        if (!prev || prev.id !== ticketId) return prev;
        return {
          ...prev,
          activity: [...(prev.activity || []), noteEntry],
        };
      });
      addToast(t("common.toast_ticket_note_added"), "success");
    },
    [addToast, t]
  );

  // Delete ticket
  const deleteTicket = useCallback(
    (ticketId) => {
      setTickets((prev) => prev.filter((ticket) => ticket.id !== ticketId));
      addToast(t("common.toast_ticket_deleted", { id: ticketId }), "warning");
      setIsTicketDrawerOpen(false);
      setEditingTicket(null);
    },
    [addToast, t]
  );

  // Open drawer for create
  const handleOpenCreateTicket = useCallback((initialProps = {}) => {
    setEditingTicket(null);
    setTicketDrawerMode("create");
    setQuickTicketInitialData(initialProps);
    setIsTicketDrawerOpen(true);
  }, []);

  // Open drawer for edit
  const handleOpenEditTicket = useCallback((ticket) => {
    setEditingTicket(ticket);
    setTicketDrawerMode("edit");
    setIsTicketDrawerOpen(true);
  }, []);

  // Open drawer for read only
  const handleOpenReadOnlyTicket = useCallback((ticket) => {
    setEditingTicket(ticket);
    setTicketDrawerMode("readonly");
    setIsTicketDrawerOpen(true);
  }, []);

  // Quick ticket creation directly from chat
  const handleQuickCreateTicketFromChat = useCallback((chatContact, lastMsgText) => {
    handleOpenCreateTicket({
      title: `Follow up: ${lastMsgText ? lastMsgText.substring(0, 50) + "..." : "Kendala Pelanggan"}`,
      contactName: chatContact.name,
      contactPhone: chatContact.phone,
      contactEmail: chatContact.email,
      channel: chatContact.channel,
      description: lastMsgText || "Dibuat langsung dari percakapan pelanggan.",
      priority: "high",
      status: "New",
      category: "support",
      deadline: new Date().toISOString().split("T")[0],
    });
  }, [handleOpenCreateTicket]);

  const value = {
    // Nav & Theme
    activeTab,
    setActiveTab,
    theme,
    toggleTheme,
    mobileNavOpen,
    setMobileNavOpen,
    userProfile,
    setUserProfile,
    schedules,
    setSchedules,
    filterScheduleStatus,
    setFilterScheduleStatus,
    isNewScheduleModalOpen,
    setIsNewScheduleModalOpen,
    editingSchedule,
    setEditingSchedule,
    addScheduledMessage,
    updateScheduledMessage,
    deleteScheduledMessage,
    dispatchScheduledItem,
    templates,

    // Toasts
    toasts,
    addToast,
    removeToast,

    // Conversations & Messages
    conversations,
    activeJid,
    setActiveJid,
    activeConversation,
    searchConversationQuery,
    setSearchConversationQuery,
    filterUnreadOnly,
    setFilterUnreadOnly,
    sendMessage,
    replyingToMessage,
    setReplyingToMessage,
    toggleConversationHumanSupport,
    deleteConversation,
    isNewChatModalOpen,
    setIsNewChatModalOpen,
    startNewChat,
    isMobileChatActive,
    setIsMobileChatActive,

    // Tickets
    tickets,
    ticketFilters: {
      search: ticketSearchQuery,
      category: ticketCategoryFilter,
      priority: ticketPriorityFilter,
      status: ticketStatusFilter,
      date: ticketDateFilter,
      deadline: ticketDeadlineFilter,
    },
    setTicketSearchQuery,
    setTicketCategoryFilter,
    setTicketPriorityFilter,
    setTicketStatusFilter,
    setTicketDateFilter,
    setTicketDeadlineFilter,
    ticketViewMode,
    setTicketViewMode,
    updateTicketStatus,
    saveTicket,
    deleteTicket,
    isTicketDrawerOpen,
    setIsTicketDrawerOpen,
    ticketDrawerMode,
    setTicketDrawerMode,
    editingTicket,
    handleOpenCreateTicket,
    handleOpenEditTicket,
    handleOpenReadOnlyTicket,
    appendTicketNote,
    handleQuickCreateTicketFromChat,
    quickTicketInitialData,
  };

  return <AskingContext.Provider value={value}>{children}</AskingContext.Provider>;
}

export function useAsking() {
  const context = useContext(AskingContext);
  if (!context) {
    throw new Error("useAsking must be used within an AskingProvider");
  }
  return context;
}
