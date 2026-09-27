"use client";

import React from "react";
import { useAsking } from "../../data/AskingContext";
import { useTranslation } from "../../data/TranslationContext";
import { NAV_ITEMS } from "../AskingSidebar";
import {
  ArrowLeft,
  CheckCircle2,
  ShieldCheck,
} from "lucide-react";

const MODULE_DESCRIPTIONS = {
  scheduler: {
    id: {
      subtitle: "Penjadwalan Pesan Otomatis & Broadcast Cron",
      description:
        "Modul engine penjadwalan pesan AsKing yang mengeksekusi pengiriman pesan otomatis secara berkala dengan variabel dinamis, perlindungan rate-limiting, dan antrean prioritas.",
      techStack: "Autonomous Background Cron Runner + IndexedDB Scheduler Store",
      features: [
        "Variabel template dinamis {name}, {invoice}, {time}",
        "Pemisahan batch pengiriman untuk mencegah blokir WhatsApp",
        "Logging eksekusi pengiriman sukses & gagal secara lokal",
      ],
    },
    en: {
      subtitle: "Automated Message Scheduling & Broadcast Cron",
      description:
        "AsKing message scheduling engine that executes scheduled broadcasts with dynamic variables, rate-limiting protection, and priority queue.",
      techStack: "Autonomous Background Cron Runner + IndexedDB Scheduler Store",
      features: [
        "Dynamic template variables {name}, {invoice}, {time}",
        "Batch dispatch staggering to prevent WhatsApp account blocks",
        "Local execution logging of success and failure states",
      ],
    },
  },
  templates: {
    id: {
      subtitle: "Pustaka Respon Cepat & Snippet Pesan",
      description:
        "Koleksi draf pesan terstandarisasi untuk customer care, konfirmasi pembayaran, follow-up prospek, dan eskalasi kendala teknis.",
      techStack: "Template Engine + Key-Value Storage",
      features: [
        "Kategorisasi berdasarkan support, billing, marketing, dan teknis",
        "Shortcut penyisipan otomatis langsung di composer obrolan",
        "Dukungan multi-bahasa Indonesia & Inggris",
      ],
    },
    en: {
      subtitle: "Quick Response Library & Message Snippets",
      description:
        "Collection of standardized message drafts for customer care, payment confirmations, lead follow-ups, and technical escalations.",
      techStack: "Template Engine + Key-Value Storage",
      features: [
        "Categorization across support, billing, marketing, and technical",
        "Instant auto-insert shortcut directly inside chat composer",
        "Multi-language support for Indonesian & English",
      ],
    },
  },
  contacts: {
    id: {
      subtitle: "Buku Kontak Pelanggan & Segmentasi",
      description:
        "Manajemen direktori pelanggan omnichannel terpadu yang memetakan nomor WhatsApp, username Telegram, dan alamat email ke dalam satu entitas profil.",
      techStack: "Dexie Local Database + Real-time Sync",
      features: [
        "Segmentasi pelanggan VIP, Lead, dan Pelanggan Aktif",
        "Pencatatan riwayat interaksi dan tiket support terkait",
        "Impor massal dari file Excel / CSV",
      ],
    },
    en: {
      subtitle: "Customer Contact Book & Segmentation",
      description:
        "Unified omnichannel customer directory mapping WhatsApp numbers, Telegram handles, and email addresses into single profile entities.",
      techStack: "Dexie Local Database + Real-time Sync",
      features: [
        "Customer segmentation into VIP, Leads, and Active Clients",
        "Interaction history tracking and linked support tickets",
        "Bulk import from Excel / CSV spreadsheets",
      ],
    },
  },
  channels: {
    id: {
      subtitle: "Integrasi Multi-Saluran Komunikasi",
      description:
        "Pusat konfigurasi dan autentikasi saluran pesan: WhatsApp Multi-Device (Baileys), Telegram MTProto API, dan IMAP/SMTP Email Gateway.",
      techStack: "Baileys Socket + MTProto GramJS + Nodemailer Gateway",
      features: [
        "Pairing QR Code instan tanpa biaya lisensi per pesan",
        "Multi-session management dengan status reconnect otomatis",
        "Enkripsi credential secara local-first di perangkat pengguna",
      ],
    },
    en: {
      subtitle: "Multi-Channel Communication Gateway",
      description:
        "Configuration and authentication hub for WhatsApp Multi-Device (Baileys), Telegram MTProto API, and IMAP/SMTP Email Gateway.",
      techStack: "Baileys Socket + MTProto GramJS + Nodemailer Gateway",
      features: [
        "Instant QR pairing without per-message licensing fees",
        "Multi-session management with auto-reconnect fallback",
        "Local-first credential encryption on user hardware",
      ],
    },
  },
  agent: {
    id: {
      subtitle: "AI Autonomous Customer Care Engine",
      description:
        "Mesin kecerdasan buatan otonom bertenaga Gemini yang mampu membaca basis pengetahuan dokumen, merespon pesan secara cerdas, dan membuat tiket otomatis.",
      techStack: "Google GenAI SDK (Gemini 2.5) + Agent Tools Sandbox",
      features: [
        "RAG (Retrieval-Augmented Generation) berbasis dokumen lokal",
        "Human-in-the-loop takeover kapan saja operator mengambil alih",
        "Guardrails ketat mencegah halusinasi dan pelanggaran kebijakan",
      ],
    },
    en: {
      subtitle: "AI Autonomous Customer Care Engine",
      description:
        "Autonomous artificial intelligence engine powered by Gemini that reads document knowledge bases, responds intelligently, and creates tickets.",
      techStack: "Google GenAI SDK (Gemini 2.5) + Agent Tools Sandbox",
      features: [
        "Local document Retrieval-Augmented Generation (RAG)",
        "Human-in-the-loop takeover whenever human agents step in",
        "Strict guardrails preventing hallucinations and policy violations",
      ],
    },
  },
  landingPages: {
    id: {
      subtitle: "Visual Page Builder & Studio Microsite",
      description:
        "Studio pembuat halaman promosi dan checkout responsif berbasis visual drag-and-drop Puck engine yang terhubung langsung ke WhatsApp CRM.",
      techStack: "Puck Visual Editor + React Component Registry",
      features: [
        "Komponen bento grid, testimoni, pricing, dan form prospek",
        "Ekspor halaman siap publish dalam format HTML / SSR",
        "Tracking pixel dan integrasi analitik bawaan",
      ],
    },
    en: {
      subtitle: "Visual Page Builder & Microsite Studio",
      description:
        "Visual drag-and-drop builder creating responsive promotional and checkout pages connected directly to WhatsApp CRM.",
      techStack: "Puck Visual Editor + React Component Registry",
      features: [
        "Bento grid components, customer reviews, pricing, and lead forms",
        "Production-ready page export in HTML / SSR formats",
        "Integrated pixel tracking and behavioral analytics",
      ],
    },
  },
  backup: {
    id: {
      subtitle: "Cadangan & Pemulihan Data Local-First",
      description:
        "Modul pencadangan data operasional seluruh pesan, kontak, dan tiket CRM ke arsip terenkripsi lokal serta opsi sinkronisasi cloud pribadi.",
      techStack: "IndexedDB Export / Import + AES Encryption",
      features: [
        "Auto-backup berkala tanpa mengirim data percakapan ke pihak ketiga",
        "Pemulihan satu klik saat berpindah komputer atau instal ulang",
        "Integritas data lokal aman memenuhi standar privasi",
      ],
    },
    en: {
      subtitle: "Local-First Backup & Data Recovery",
      description:
        "Operational data backup archiving messages, contacts, and CRM tickets into local encrypted vaults with optional cloud sync.",
      techStack: "IndexedDB Export / Import + AES Encryption",
      features: [
        "Periodic auto-backups without routing chat data to 3rd parties",
        "One-click restoration across machines or clean installations",
        "Local privacy-compliant data integrity standards",
      ],
    },
  },
  settings: {
    id: {
      subtitle: "Pengaturan Sistem, Profil & Preferensi",
      description:
        "Pusat pengelolaan identitas akun enterprise, preferensi tema, bahasa, notifikasi desktop, serta kuota token AI.",
      techStack: "AsKing System Config + Cloud Auth Store",
      features: [
        "Konfigurasi API key dan endpoint custom model AI",
        "Pengaturan masa aktif lisensi dan status paket langganan",
        "Toggle tema Dark / Light mode dan opsi notifikasi",
      ],
    },
    en: {
      subtitle: "System Settings, Profile & Preferences",
      description:
        "Management hub for enterprise account identity, theme preferences, language, desktop notifications, and AI token quotas.",
      techStack: "AsKing System Config + Cloud Auth Store",
      features: [
        "API keys and custom AI model endpoint configurations",
        "License validity and subscription tier management",
        "Dark / Light theme toggles and notification preferences",
      ],
    },
  },
};

export default function ModulePlaceholderView({ activeModuleId }) {
  const { setActiveTab } = useAsking();
  const { t, language } = useTranslation();

  const navItem = NAV_ITEMS.find((n) => n.id === activeModuleId) || {
    id: activeModuleId,
    label: "Modul",
    icon: ShieldCheck,
  };

  const navLabel =
    activeModuleId === "home"
      ? t("sidebar.nav_dashboard")
      : activeModuleId === "chat"
        ? t("sidebar.nav_messages")
        : activeModuleId === "tickets"
          ? t("sidebar.nav_tickets")
          : activeModuleId === "scheduler"
            ? t("sidebar.nav_scheduler")
            : navItem.label;

  const Icon = navItem.icon;
  const modData = MODULE_DESCRIPTIONS[activeModuleId];
  const info = (modData && modData[language]) || (modData && modData.id) || {
    subtitle: language === "en" ? "AsKing App Module" : "Modul Aplikasi AsKing",
    description: language === "en" ? "Functional module of AsKing customer manager." : "Modul fungsional bagian dari sistem omnichannel customer manager AsKing.",
    techStack: "AsKing Desktop Native Architecture",
    features: language === "en" ? ["Local integration", "Data protection", "Auto sync"] : ["Integrasi lokal", "Perlindungan data", "Sinkronisasi otomatis"],
  };

  return (
    <div className="flex-1 h-full overflow-y-auto bg-[#F8FAF7] dark:bg-[#0C1712] p-6 pb-24 lg:p-10 flex flex-col items-center justify-center select-none transition-colors duration-200 scrollbar-thin-subtle">
      <div className="max-w-2xl w-full bg-white dark:bg-[#12241C] border border-[#DEE7DF] dark:border-[#1F382B] shadow-sm rounded-3xl p-6 sm:p-8 space-y-6">
        {/* Module Header Badge & Icon */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-[#E5EFE7] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] flex items-center justify-center font-bold shadow-xs">
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] font-mono uppercase text-[10px] font-bold">
                  {t("placeholders.badge_module")}
                </span>
                <span className="text-[10px] text-[#22C55E] dark:text-[#B8F55C] font-bold">
                  {t("placeholders.available_desktop")}
                </span>
              </div>
              <h2 className="text-lg sm:text-xl font-black text-[#11231B] dark:text-[#F2F7F4] mt-0.5">
                {navLabel}
              </h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setActiveTab("home")}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#DEE7DF] dark:border-[#1F382B] text-xs font-semibold text-[#556A60] dark:text-[#A5B8AD] hover:bg-[#EBF1EB] dark:hover:bg-[#18362B] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>{t("common.back")}</span>
          </button>
        </div>

        {/* Subtitle & Description */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold text-[#184530] dark:text-[#B8F55C] uppercase tracking-wider">
            {info.subtitle}
          </h3>
          <p className="text-xs text-[#556A60] dark:text-[#A5B8AD] leading-relaxed">
            {info.description}
          </p>
        </div>

        {/* Tech Stack Spec Card */}
        <div className="p-3.5 rounded-2xl bg-[#F8FAF7] dark:bg-[#162B21] border border-[#DEE7DF] dark:border-[#1F382B] space-y-1 text-xs">
          <p className="text-[10px] uppercase font-bold text-[#6B8075] dark:text-[#8EA096]">
            {t("placeholders.architecture_label")}
          </p>
          <p className="font-mono text-[11px] font-bold text-[#11231B] dark:text-[#F2F7F4]">
            {info.techStack}
          </p>
        </div>

        {/* Highlighted Capabilities */}
        <div className="space-y-2">
          <p className="text-[11px] font-bold uppercase tracking-wider text-[#6B8075] dark:text-[#8EA096]">
            {t("placeholders.capabilities_label")}
          </p>
          <ul className="space-y-1.5">
            {info.features.map((feat, idx) => (
              <li key={idx} className="flex items-center gap-2 text-xs text-[#2D3E35] dark:text-[#D1DDD6]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E] shrink-0" />
                <span>{feat}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Quick Navigation Footer */}
        <div className="pt-4 border-t border-[#DEE7DF] dark:border-[#1F382B] flex flex-wrap items-center justify-between gap-3">
          <span className="text-[11px] text-[#8EA096] dark:text-[#6B8075]">
            {t("placeholders.quick_nav_label")}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setActiveTab("home")}
              className="px-3 py-1.5 rounded-xl bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] text-xs font-bold hover:bg-[#DEE7DF] transition-colors cursor-pointer"
            >
              {t("sidebar.nav_dashboard")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("chat")}
              className="px-3 py-1.5 rounded-xl bg-[#EBF1EB] dark:bg-[#18362B] text-[#184530] dark:text-[#B8F55C] text-xs font-bold hover:bg-[#DEE7DF] transition-colors cursor-pointer"
            >
              {t("sidebar.nav_messages")}
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("tickets")}
              className="px-3 py-1.5 rounded-xl bg-[#12281F] text-[#B8F55C] text-xs font-bold hover:bg-[#1C3B2E] transition-colors cursor-pointer border border-[#234235]"
            >
              {t("sidebar.nav_tickets")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
