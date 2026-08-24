"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Lock,
  Laptop,
  Bot,
  Ticket,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden pt-10 pb-20 md:pt-16 md:pb-28 hero-grid">
      {/* Decorative radial lighting glow behind center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-[#E8F6EB]/60 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-6xl mx-auto px-6 sm:px-8 relative">
        {/* Floating Interactive Badge 1: Top-Left (WhatsApp Connected) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="hidden lg:flex items-center gap-2.5 absolute top-6 left-4 p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#DEE7DF] shadow-md hover:shadow-lg transition-shadow"
        >
          <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-200 flex items-center justify-center font-bold">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div className="text-left pr-2">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[11px] font-bold text-[#11231B]">Unified Messaging</span>
            </div>
            <p className="text-[10px] text-[#556A60] font-medium">Unified multi-channel messaging</p>
          </div>
        </motion.div>

        {/* Floating Interactive Badge 2: Top-Right (100% Local Data Ownership) */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="hidden lg:flex items-center gap-2.5 absolute top-8 right-6 p-2.5 rounded-2xl bg-[#12281F] text-white border border-[#234235] shadow-lg"
        >
          <div className="w-8 h-8 rounded-xl bg-[#18362B] text-[#B8F55C] border border-[#234235] flex items-center justify-center">
            <ShieldCheck className="w-4 h-4 text-[#B8F55C]" />
          </div>
          <div className="text-left pr-2">
            <div className="text-[11px] font-bold text-[#B8F55C] flex items-center gap-1">
              <span>100% Local-First</span>
              <Lock className="w-3 h-3 text-[#B8F55C]" />
            </div>
            <p className="text-[10px] text-[#A5B8AD]">Data Stays On Your Device</p>
          </div>
        </motion.div>

        {/* Floating Interactive Badge 3: Bottom-Left (24/7 AI Customer Agent) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="hidden lg:flex items-center gap-2.5 absolute bottom-12 left-8 p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#DEE7DF] shadow-md"
        >
          <div className="w-8 h-8 rounded-xl bg-[#12281F] text-[#B8F55C] flex items-center justify-center">
            <Bot className="w-4 h-4 text-[#B8F55C]" />
          </div>
          <div className="text-left pr-2">
            <div className="text-[11px] font-bold text-[#11231B]">AI Customer Agent</div>
            <p className="text-[10px] text-[#556A60]">Autonomous 24/7 AI Customer Agent</p>
          </div>
        </motion.div>

        {/* Floating Interactive Badge 4: Bottom-Right (Kanban SLA Tracker) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
          className="hidden lg:flex items-center gap-2.5 absolute bottom-14 right-10 p-2.5 rounded-2xl bg-white/90 backdrop-blur-md border border-[#DEE7DF] shadow-md"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center font-bold">
            <Ticket className="w-4 h-4" />
          </div>
          <div className="text-left pr-2">
            <div className="text-[11px] font-bold text-[#11231B]">Kanban Tickets</div>
            <p className="text-[10px] text-[#556A60]">Real-time Priority Tracking</p>
          </div>
        </motion.div>

        {/* Center Content */}
        <div className="flex flex-col items-center text-center max-w-3xl mx-auto">
          {/* Badge Pill */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E5EFE7] border border-[#CFE2D3] text-xs font-bold text-[#184530] shadow-2xs mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#184530]" />
            <span>{t("hero.badge")}</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl sm:text-5xl lg:text-[58px] font-black tracking-[-0.03em] leading-[1.12] text-[#11241C] mb-6"
          >
            {t("hero.headline_prefix")}{" "}
            <span className="relative inline-block px-1.5 py-0.5">
              <span className="relative z-10 text-[#184530]">
                {t("hero.headline_highlight")}
              </span>
            </span>{" "}
            {t("hero.headline_suffix")}
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-base sm:text-lg text-[#4B6055] leading-relaxed max-w-2xl mb-10 font-normal"
          >
            {t("hero.subtitle")}
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto"
          >
            <a
              href="#download"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#12281F] text-[#B8F55C] hover:bg-[#1C3B2E] font-bold text-[15px] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all active:translate-y-0 border border-[#234235]"
            >
              <Laptop className="w-4 h-4" />
              <span>{t("hero.cta_primary")}</span>
            </a>
            <a
              href="#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-white text-[#12281F] border border-[#D3DFD6] font-bold text-[15px] shadow-xs hover:bg-[#F3F7F4] hover:border-[#BFD0C3] transition-all"
            >
              <span>{t("hero.cta_secondary")}</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
