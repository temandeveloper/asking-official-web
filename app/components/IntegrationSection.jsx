"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Sparkles,
  ShieldCheck,
  HardDrive,
  Cpu,
  Database,
  Terminal,
  Layers,
  ArrowRight,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function IntegrationSection() {
  const { t } = useTranslation();

  const integrations = [
    { name: "WhatsApp", icon: MessageSquare, category: "Messaging Channel", desc: "Protocol" },
    { name: "Telegram", icon: MessageSquare, category: "Messaging Channel", desc: "Bot API" },
    { name: "Google Gemini", icon: Sparkles, category: "AI Engine", desc: "2.5-Flash & Lite" },
    { name: "Ollama LLM", icon: Cpu, category: "Local AI Engine", desc: "Offline Inference" },
    { name: "Local IndexedDB", icon: HardDrive, category: "Local Database", desc: "100% On-Device" },
    { name: "Supabase SSO", icon: ShieldCheck, category: "Cloud Auth", desc: "Session Bridge" },
    { name: "Desktop Native", icon: Terminal, category: "Cross-Platform", desc: "Mac, Win, Linux" },
    { name: "CSV / JSON Export", icon: Database, category: "Data Sovereignty", desc: "Manual Backup" },
  ];

  return (
    <section className="py-20 md:py-28 bg-[#12281F] text-white relative overflow-hidden">
      {/* Background Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-[#184530]/40 rounded-full blur-3xl pointer-events-none -z-0" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 text-center">
        {/* Section Header */}
        <div className="max-w-3xl mx-auto mb-14 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#18362B] border border-[#234235] text-xs font-bold text-[#B8F55C]">
            <Layers className="w-3.5 h-3.5" />
            <span>{t("integration.tag")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[#F2F7F4]">
            {t("integration.title")}
          </h2>

          <p className="text-base sm:text-lg text-[#A5B8AD] leading-relaxed">
            {t("integration.subtitle")}
          </p>
        </div>

        {/* Integration Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
          {integrations.map((item, idx) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="p-5 rounded-2xl bg-[#0C1712]/90 border border-[#234235] hover:border-[#B8F55C]/40 transition-all text-left group hover:-translate-y-1 shadow-md"
              >
                <div className="w-10 h-10 rounded-xl bg-[#18362B] text-[#B8F55C] border border-[#234235] flex items-center justify-center mb-3 group-hover:scale-105 transition-transform">
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-xs font-bold text-[#F2F7F4]">{item.name}</div>
                <div className="text-[11px] text-[#B8F55C] font-medium mt-0.5">{item.category}</div>
                <div className="text-[10px] text-[#8EA096] mt-1">{item.desc}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
