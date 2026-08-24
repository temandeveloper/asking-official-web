"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Bot,
  Zap,
  Kanban,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowRight,
  Clock,
  Sparkles,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function NodeWorkflowSection() {
  const { t, language } = useTranslation();

  return (
    <section
      id="workflow"
      className="py-20 md:py-28 bg-[#F8FAF7] text-[#11231B] relative overflow-hidden border-t border-[#DEE7DF]"
    >
      {/* Subtle Background Glow */}
      <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-[#B8F55C]/12 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 right-1/4 translate-x-1/3 w-[500px] h-[300px] bg-[#184530]/8 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5EFE7] border border-[#CFE2D3] text-xs font-bold text-[#184530] shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-[#184530]" />
            <span>{t("integration.tag")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#11241C] tracking-tight">
            {t("integration.title")}
          </h2>

          <p className="text-sm sm:text-base text-[#4B6055] leading-relaxed max-w-2xl mx-auto">
            {t("integration.subtitle")}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 3-NODE WORKFLOW PIPELINE (Simple, Clean, Non-Technical) */}
        {/* ========================================================================= */}
        <div className="relative max-w-5xl mx-auto">

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-4 items-center">

            {/* ------------------------------------------------------------- */}
            {/* NODE 1: WHATSAPP CHAT & AI RESPONSE (Col Span 5) */}
            {/* ------------------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-5 rounded-3xl bg-white border border-[#DEE7DF] p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* WhatsApp Status Bar */}
              <div className="flex items-center justify-between pb-3 border-b border-[#DEE7DF]">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center justify-center font-bold">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-[#11231B]">WhatsApp</div>
                    <div className="text-[10px] text-emerald-700 font-medium">Online • Connected</div>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="space-y-3">
                {/* 1. Customer Message */}
                <div className="p-3.5 rounded-2xl bg-[#F2F7F3] border border-[#DEE7DF] text-xs text-[#11231B] leading-relaxed">
                  <div className="text-[10px] font-bold text-[#556A60] mb-1">
                    {t("integration.customer_label")}:
                  </div>
                  "{t("integration.customer_msg")}"
                </div>

                {/* 2. AI Customer Agent Auto-Reply */}
                <div className="p-3.5 rounded-2xl bg-[#EAF3EC] border border-[#CFE2D3] text-xs text-[#184530] leading-relaxed space-y-1">
                  <div className="flex items-center justify-between text-[10px]">
                    <span className="font-bold flex items-center gap-1">
                      <Bot className="w-3.5 h-3.5" />
                      AI Customer Agent
                    </span>
                  </div>
                  <p className="text-xs text-[#11281F] font-medium pt-0.5">
                    "{t("integration.ai_reply")}"
                  </p>
                </div>
              </div>
            </motion.div>

            {/* ------------------------------------------------------------- */}
            {/* NODE 2: AI ACTION PILL (Col Span 2 / Center Node) */}
            {/* ------------------------------------------------------------- */}
            <div className="lg:col-span-2 flex flex-col items-center justify-center relative py-2">

              {/* Connecting Line Left */}
              <div className="hidden lg:block absolute left-0 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-[#184530]" />
              {/* Connecting Line Right */}
              <div className="hidden lg:block absolute right-0 top-1/2 -translate-y-1/2 w-4 h-0.5 bg-[#184530]" />

              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="w-full py-4 px-3.5 rounded-2xl bg-[#12281F] text-white border border-[#234235] shadow-md text-center space-y-1.5"
              >
                <div className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-[#18362B] text-[#B8F55C] border border-[#2A5241] mx-auto">
                  <Zap className="w-3.5 h-3.5" />
                </div>

                <div className="text-xs font-bold text-[#B8F55C] leading-snug">
                  {t("integration.node2_action")}
                </div>

                <p className="text-[10px] text-[#A5B8AD] leading-tight">
                  {t("integration.node2_desc")}
                </p>
              </motion.div>
            </div>

            {/* ------------------------------------------------------------- */}
            {/* NODE 3: 1-PIECE AUTHENTIC KANBAN TICKET CARD (Col Span 5) */}
            {/* ------------------------------------------------------------- */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:col-span-5 rounded-3xl bg-white border border-[#DEE7DF] p-6 shadow-sm hover:shadow-md transition-all space-y-4"
            >
              {/* Column Bar Header */}
              <div className="flex items-center justify-between pb-3 border-b border-[#DEE7DF]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span className="text-xs font-bold text-[#11231B]">New</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5EFE7] text-[#184530]">
                  1 Ticket
                </span>
              </div>

              {/* Authentic AsKing Kanban Ticket Card (Single Piece) */}
              <div className="rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] p-4 space-y-3 shadow-2xs hover:border-[#CFE2D3] transition-colors">
                {/* Top Row: Ticket ID & Tag */}
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-white text-[#556A60] border border-[#DEE7DF]">
                    {t("integration.ticket_id")}
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EAF3EC] text-[#184530] border border-[#CFE2D3] flex items-center gap-1">
                    <span className="text-[9px]">🏷️</span> {t("integration.ticket_category")}
                  </span>
                </div>

                {/* Ticket Title */}
                <div className="text-sm font-bold text-[#11231B] leading-snug">
                  {t("integration.ticket_title")}
                </div>

                {/* Priority & Date */}
                <div className="flex items-center justify-between text-[11px] pt-1">
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold text-[10px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    {t("integration.ticket_priority")}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#556A60] bg-white px-2 py-0.5 rounded border border-[#DEE7DF] text-[10px]">
                    📅 {t("integration.ticket_date")}
                  </span>
                </div>

                {/* Customer Footer */}
                <div className="flex items-center justify-between pt-2.5 border-t border-[#DEE7DF] text-xs text-[#556A60]">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 rounded-full bg-[#18362B] text-white flex items-center justify-center font-bold text-[10px]">
                      C
                    </div>
                    <span className="font-medium text-xs text-[#11231B]">
                      {t("integration.customer_label")}
                    </span>
                  </div>
                  <MessageSquare className="w-4 h-4 text-[#184530]" />
                </div>
              </div>
            </motion.div>

          </div>

          {/* Bottom Note */}
          <div className="mt-8 text-center text-xs text-[#556A60] flex items-center justify-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>
              {language === "id"
                ? "Seluruh tiket dan pesan pelanggan tersimpan secara Local-First di komputer Anda tanpa pihak ketiga."
                : "All tickets and customer records are saved Local-First on your device without third-party exposure."}
            </span>
          </div>

        </div>
      </div>
    </section>
  );
}
