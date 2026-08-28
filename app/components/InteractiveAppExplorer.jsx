"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  MessageSquare,
  Kanban,
  Bot,
  Radio,
  CalendarClock,
  FileText,
  Users,
  DatabaseBackup,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  X,
  GalleryThumbnails,
  Zap,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

const SCREENSHOT_MODULES = [
  {
    id: "dashboard",
    icon: LayoutDashboard,
    image: "/screenshots/dashboard.png",
    route: "asking://app/dashboard",
    tag: "Analytics",
  },
  {
    id: "messages",
    icon: MessageSquare,
    image: "/screenshots/messages.png",
    route: "asking://app/messages",
    tag: "Omnichannel",
  },
  {
    id: "tikets",
    icon: Kanban,
    image: "/screenshots/tikets.png",
    route: "asking://app/tickets",
    tag: "Workflow",
  },
  {
    id: "scheduler",
    icon: CalendarClock,
    image: "/screenshots/scheduler.png",
    route: "asking://app/scheduler",
    tag: "Automation",
  },
  {
    id: "templates",
    icon: FileText,
    image: "/screenshots/templates.png",
    route: "asking://app/templates",
    tag: "Productivity",
  },
  {
    id: "contacts",
    icon: Users,
    image: "/screenshots/contacts.png",
    route: "asking://app/contacts",
    tag: "Directory",
  },
  {
    id: "customer_agent",
    icon: Bot,
    image: "/screenshots/customer agent.png",
    route: "asking://app/agent",
    tag: "AI Automation",
  },
  {
    id: "channels",
    icon: Radio,
    image: "/screenshots/message channels.png",
    route: "asking://app/channels",
    tag: "Connectivity",
  },
  {
    id: "backup",
    icon: DatabaseBackup,
    image: "/screenshots/backup and restore.png",
    route: "asking://app/backup",
    tag: "Local-First",
  },
];

export default function InteractiveAppExplorer() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);

  const currentIndex = SCREENSHOT_MODULES.findIndex((m) => m.id === activeTab);
  const currentModule = SCREENSHOT_MODULES[currentIndex] || SCREENSHOT_MODULES[0];

  const goToPrev = useCallback(() => {
    const prevIdx = (currentIndex - 1 + SCREENSHOT_MODULES.length) % SCREENSHOT_MODULES.length;
    setActiveTab(SCREENSHOT_MODULES[prevIdx].id);
  }, [currentIndex]);

  const goToNext = useCallback(() => {
    const nextIdx = (currentIndex + 1) % SCREENSHOT_MODULES.length;
    setActiveTab(SCREENSHOT_MODULES[nextIdx].id);
  }, [currentIndex]);

  // Handle keyboard navigation for lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isLightboxOpen) return;
      if (e.key === "Escape") setIsLightboxOpen(false);
      if (e.key === "ArrowLeft") goToPrev();
      if (e.key === "ArrowRight") goToNext();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, goToPrev, goToNext]);

  return (
    <section
      id="appshowcase"
      className="py-20 md:py-28 bg-[#F8FAF7] border-b border-[#DEE7DF] relative overflow-hidden"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#B8F55C]/5 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5EFE7] border border-[#CFE2D3] text-xs font-bold text-[#184530]">
            <GalleryThumbnails className="w-3.5 h-3.5 text-[#2C6E49]" />
            <span>{t("demo.tag")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11241C] tracking-tight">
            {t("demo.title")}
          </h2>

          <p className="text-base sm:text-lg text-[#4B6055] leading-relaxed">
            {t("demo.subtitle")}
          </p>
        </div>

        {/* Tab Navigation Pill Bar */}
        <div className="mb-8">
          <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-0 sm:flex-wrap sm:justify-center no-scrollbar px-1">
            {SCREENSHOT_MODULES.map((module, idx) => {
              const Icon = module.icon;
              const isActive = activeTab === module.id;
              const tabLabel = t(`demo.tabs.${module.id}`);

              return (
                <button
                  key={module.id}
                  onClick={() => setActiveTab(module.id)}
                  className={`flex items-center gap-2 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 cursor-pointer select-none ${isActive
                    ? "bg-[#12281F] text-[#B8F55C] shadow-md border border-[#234235] ring-2 ring-[#B8F55C]/20"
                    : "bg-white text-[#3D5247] hover:bg-[#EAEFEA] hover:text-[#11241C] border border-[#DEE7DF]"
                    }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? "text-[#B8F55C]" : "text-[#526B5D]"}`} />
                  <span>{tabLabel}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-md font-semibold ${isActive
                      ? "bg-[#1B3A2C] text-[#B8F55C]"
                      : "bg-[#F0F5F1] text-[#6A8174]"
                      }`}
                  >
                    0{idx + 1}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Desktop App Window Container */}
        <div className="max-w-6xl mx-auto rounded-3xl bg-[#0C1712] border border-[#234235] shadow-2xl overflow-hidden transition-all duration-300">
          {/* Screenshot Showcase Main Area */}
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.99, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.99, y: -8 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
                className="space-y-6"
              >
                {/* Screenshot Frame with Zoom Overlay */}
                <div
                  onClick={() => setIsLightboxOpen(true)}
                  className="group relative rounded-2xl overflow-hidden bg-[#070D0A] border border-[#1F382B] shadow-inner cursor-pointer"
                >
                  <div className="relative w-full aspect-[16/10] sm:aspect-[16/9.5] max-h-[560px]">
                    <Image
                      src={currentModule.image}
                      alt={t(`demo.modules.${currentModule.id}.title`)}
                      fill
                      priority
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1152px"
                      className="object-contain sm:object-cover sm:object-top transition-transform duration-500 group-hover:scale-[1.01]"
                    />
                  </div>

                  {/* Hover Floating Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-between p-4 sm:p-6 pointer-events-none">
                    <div className="space-y-1">
                      {/* Module Details & Key Highlights Card */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-2">
                        {/* Left Column: Title & Tagline */}
                        <div className="lg:col-span-5 space-y-2.5">
                          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#18362B] border border-[#234235] text-[11px] font-bold text-[#B8F55C]">
                            <Zap className="w-3 h-3 text-[#B8F55C]" />
                            <span>{t(`demo.modules.${currentModule.id}.badge`)}</span>
                          </div>
                          <h3 className="text-xl sm:text-2xl font-black text-[#F2F7F4] tracking-tight">
                            {t(`demo.modules.${currentModule.id}.title`)}
                          </h3>
                          <p className="text-xs sm:text-sm text-[#A5B8AD] leading-relaxed">
                            {t(`demo.modules.${currentModule.id}.tagline`)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#12281F]/90 border border-[#B8F55C]/40 text-[#B8F55C] text-xs font-bold backdrop-blur-md shadow-lg">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom Quick Thumbnail Strip */}
            <div className="pt-4 border-t border-[#1F382B]">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-[#8EA096]">
                <span>Eksplorasi Screenshot Lengkap</span>
                <span className="text-[#A5B8AD] font-mono">
                  {currentIndex + 1} / {SCREENSHOT_MODULES.length}
                </span>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-9 gap-2">
                {SCREENSHOT_MODULES.map((item, idx) => {
                  const isSelected = item.id === activeTab;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`relative aspect-[16/10] rounded-xl overflow-hidden border transition-all duration-200 group cursor-pointer text-left ${isSelected
                        ? "border-[#B8F55C] ring-2 ring-[#B8F55C]/40 scale-105 shadow-md shadow-black/60 z-10"
                        : "border-[#1F382B] opacity-60 hover:opacity-100 hover:border-[#2C523F]"
                        }`}
                    >
                      <Image
                        src={item.image}
                        alt={t(`demo.tabs.${item.id}`)}
                        fill
                        sizes="120px"
                        className="object-cover object-top"
                      />
                      <div
                        className={`absolute inset-0 transition-colors ${isSelected
                          ? "bg-transparent"
                          : "bg-[#0C1712]/40 group-hover:bg-transparent"
                          }`}
                      />
                      <span className="absolute bottom-1 left-1 right-1 text-[9px] font-bold text-white bg-black/80 px-1 py-0.5 rounded truncate text-center backdrop-blur-xs">
                        {t(`demo.tabs.${item.id}`)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Lightbox / Fullscreen Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.94, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.94, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-6xl w-full max-h-[95vh] flex flex-col bg-[#0C1712] border border-[#234235] rounded-3xl overflow-hidden shadow-2xl"
            >
              {/* Lightbox Header */}
              <div className="px-4 sm:px-6 py-3.5 bg-[#08100C] border-b border-[#1F382B] flex items-center justify-between gap-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-[#18362B] text-[#B8F55C] flex items-center justify-center font-bold">
                    <currentModule.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-[#F2F7F4] truncate">
                      {t(`demo.modules.${currentModule.id}.title`)}
                    </h4>
                    <p className="text-[11px] text-[#8EA096] truncate">{currentModule.route}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsLightboxOpen(false)}
                    className="p-2 rounded-xl bg-[#18362B] text-[#D1DDD6] hover:text-white hover:bg-[#204738] transition-colors cursor-pointer"
                    aria-label={t("demo.close_preview")}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Lightbox Body / Image Preview */}
              <div className="relative flex-1 min-h-[360px] max-h-[68vh] overflow-auto p-2 sm:p-4 bg-[#050B08] flex items-center justify-center">
                <div className="relative w-full h-[64vh] max-w-5xl">
                  <Image
                    src={currentModule.image}
                    alt={t(`demo.modules.${currentModule.id}.title`)}
                    fill
                    priority
                    sizes="100vw"
                    className="object-contain rounded-xl"
                  />
                </div>

                {/* Left & Right Float Arrows */}
                <button
                  onClick={goToPrev}
                  aria-label="Previous"
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/70 hover:bg-[#12281F] text-white hover:text-[#B8F55C] border border-white/10 transition-all cursor-pointer backdrop-blur-md"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={goToNext}
                  aria-label="Next"
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-2xl bg-black/70 hover:bg-[#12281F] text-white hover:text-[#B8F55C] border border-white/10 transition-all cursor-pointer backdrop-blur-md"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Lightbox Footer with Mini Thumbnails */}
              <div className="px-4 sm:px-6 py-3 bg-[#08100C] border-t border-[#1F382B] flex items-center justify-between gap-4 overflow-x-auto no-scrollbar">
                <div className="flex items-center gap-2 shrink-0">
                  {SCREENSHOT_MODULES.map((item) => {
                    const isSelected = item.id === activeTab;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`relative w-14 h-9 rounded-lg overflow-hidden border transition-all cursor-pointer ${isSelected
                          ? "border-[#B8F55C] ring-2 ring-[#B8F55C]/50 scale-105"
                          : "border-[#1F382B] opacity-50 hover:opacity-100"
                          }`}
                      >
                        <Image
                          src={item.image}
                          alt={t(`demo.tabs.${item.id}`)}
                          fill
                          sizes="60px"
                          className="object-cover object-top"
                        />
                      </button>
                    );
                  })}
                </div>
                <div className="text-xs text-[#8EA096] shrink-0 hidden sm:block">
                  <span>Gunakan tombol panah ◄ ► atau Esc untuk navigasi</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
