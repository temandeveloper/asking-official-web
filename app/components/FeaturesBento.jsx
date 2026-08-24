"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  MessageCircle,
  Kanban,
  Sparkles,
  Bot,
  CalendarClock,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Zap,
  Radio,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function FeaturesBento() {
  const { t } = useTranslation();

  return (
    <section id="features" className="py-20 md:py-28 bg-[#F8FAF7] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5EFE7] border border-[#CFE2D3] text-xs font-bold text-[#184530]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t("features.tag")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11241C] tracking-tight">
            {t("features.title")}
          </h2>

          <p className="text-base sm:text-lg text-[#4B6055] leading-relaxed">
            {t("features.subtitle")}
          </p>
        </div>

        {/* Bento Grid (Balanced 3-Column Layout: Row 1: 2+1, Row 2: 1+1+1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          
          {/* ========================================================================= */}
          {/* ROW 1: Card 1 (Span 2) + Card 2 (Span 1) */}
          {/* ========================================================================= */}

          {/* Card 1: Omnichannel Message Channels (Span 2 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-2 rounded-3xl bg-white border border-[#DEE7DF] p-7 sm:p-9 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 h-full"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#12281F] text-[#B8F55C] border border-[#234235] flex items-center justify-center shadow-xs">
                <Radio className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-[#11231B]">
                {t("features.omnichannel_title")}
              </h3>
              <p className="text-sm text-[#4B6055] leading-relaxed max-w-xl">
                {t("features.omnichannel_desc")}
              </p>
            </div>

            {/* Channels Grid with Rounded-Square App Tiles */}
            <div className="space-y-4 pt-2">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                
                {/* 1. WhatsApp Channel Tile */}
                <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] hover:border-[#CFE2D3] transition-all space-y-3 shadow-2xs group">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-[#DEE7DF] shadow-xs flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-transform">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.475-.15-.675.15-.2.301-.776.979-.951 1.18-.176.201-.351.226-.652.076-.301-.15-1.272-.469-2.423-1.496-.897-.8-1.503-1.789-1.679-2.09-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.201-.301.301-.502.1-.201.05-.376-.025-.526-.075-.15-.676-1.631-.926-2.233-.244-.587-.492-.507-.676-.517-.175-.008-.376-.01-.576-.01-.2 0-.526.075-.802.376-.275.301-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.228 3.109.15.201 2.12 3.238 5.136 4.542.717.31 1.277.495 1.713.634.721.229 1.377.197 1.896.119.578-.087 1.78-.727 2.031-1.429.251-.702.251-1.304.176-1.429-.075-.126-.276-.201-.577-.351zM12.04 21.785h-.002a9.78 9.78 0 01-4.992-1.365l-.358-.213-3.712.974.99-3.619-.233-.371a9.78 9.78 0 01-1.503-5.185c0-5.405 4.398-9.803 9.808-9.803 2.618 0 5.079 1.02 6.93 2.871a9.754 9.754 0 012.868 6.932c0 5.407-4.399 9.809-9.808 9.809zM20.52 3.48A11.915 11.915 0 0012.04 0C5.402 0 .007 5.394.007 12.031c0 2.12.554 4.19 1.608 6.014L0 24l6.147-1.613a11.96 11.96 0 005.891 1.542h.005c6.636 0 12.031-5.395 12.031-12.033a11.914 11.914 0 00-3.554-8.416z" />
                      </svg>
                    </div>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      {t("features.omnichannel_status_wa")}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#11231B]">
                      {t("features.omnichannel_name_wa")}
                    </h4>
                    <p className="text-[10px] text-[#556A60] mt-0.5 leading-snug">
                      {t("features.omnichannel_desc_wa")}
                    </p>
                  </div>
                </div>

                {/* 2. Telegram Channel Tile */}
                <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] hover:border-[#CFE2D3] transition-all space-y-3 shadow-2xs group opacity-90 hover:opacity-100">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-[#DEE7DF] shadow-xs flex items-center justify-center text-[#229ED9] group-hover:scale-105 transition-transform">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm5.894 8.221l-1.97 9.28c-.145.658-.537.818-1.084.508l-3-2.21-1.446 1.394c-.16.16-.295.295-.605.295l.213-3.053 5.56-5.023c.242-.213-.054-.333-.373-.121l-6.871 4.326-2.962-.924c-.643-.204-.657-.643.136-.953l11.57-4.461c.537-.194 1.006.131.832.942z" />
                      </svg>
                    </div>
                    <span className="text-[10px] font-semibold text-[#556A60] bg-[#EBF1EB] px-2.5 py-0.5 rounded-full">
                      {t("features.omnichannel_status_tg")}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#11231B]">
                      {t("features.omnichannel_name_tg")}
                    </h4>
                    <p className="text-[10px] text-[#556A60] mt-0.5 leading-snug">
                      {t("features.omnichannel_desc_tg")}
                    </p>
                  </div>
                </div>

                {/* 3. Live Chat Widget Channel Tile */}
                <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] hover:border-[#CFE2D3] transition-all space-y-3 shadow-2xs group opacity-90 hover:opacity-100">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-[#DEE7DF] shadow-xs flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-semibold text-[#556A60] bg-[#EBF1EB] px-2.5 py-0.5 rounded-full">
                      {t("features.omnichannel_status_chat")}
                    </span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#11231B]">
                      {t("features.omnichannel_name_chat")}
                    </h4>
                    <p className="text-[10px] text-[#556A60] mt-0.5 leading-snug">
                      {t("features.omnichannel_desc_chat")}
                    </p>
                  </div>
                </div>

              </div>

              {/* Legal Disclaimer */}
              <p className="text-[10px] text-[#6B8075] italic leading-relaxed pt-2 border-t border-[#DEE7DF]">
                {t("features.omnichannel_disclaimer")}
              </p>
            </div>
          </motion.div>

          {/* Card 2: Visual Kanban & Priority Tickets (Span 1 col on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-3xl bg-white border border-[#DEE7DF] p-7 sm:p-9 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 h-full"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 border border-amber-200 flex items-center justify-center shadow-xs font-bold">
                <Kanban className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#11231B]">
                {t("features.kanban_title")}
              </h3>
              <p className="text-xs sm:text-sm text-[#4B6055] leading-relaxed">
                {t("features.kanban_desc")}
              </p>
            </div>

            {/* Authentic Kanban Column & Ticket Card Preview */}
            <div className="rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] p-3.5 space-y-2.5 overflow-hidden">
              {/* Column Header Bar */}
              <div className="flex items-center justify-between pb-2 border-b border-[#DEE7DF]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-purple-500" />
                  <span className="text-xs font-bold text-[#11231B]">Under Review</span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5EFE7] text-[#184530]">
                  1
                </span>
              </div>

              {/* Authentic AsKing Kanban Card */}
              <div className="rounded-xl bg-white border border-[#DEE7DF] p-3.5 space-y-2 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-[#F2F7F3] text-[#556A60] border border-[#DEE7DF]">
                    #TCK-1003
                  </span>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-[#EAF3EC] text-[#184530] border border-[#CFE2D3] flex items-center gap-1">
                    <span className="text-[9px]">🏷️</span> Support
                  </span>
                </div>

                <div className="text-xs font-bold text-[#11231B] leading-snug">
                  Sales Team Live Onboarding Demo
                </div>

                <div className="flex items-center justify-between text-[10px] pt-1">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200 font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Medium
                  </span>
                  <span className="inline-flex items-center gap-1 text-[#556A60] bg-[#F2F7F3] px-2 py-0.5 rounded border border-[#DEE7DF]">
                    📅 2026-08-25
                  </span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#F2F7F3] text-[11px] text-[#556A60]">
                  <div className="flex items-center gap-1.5">
                    <div className="w-4 h-4 rounded-full bg-[#184530] text-white flex items-center justify-center font-bold text-[9px]">
                      C
                    </div>
                    <span className="font-medium text-[11px]">Customer</span>
                  </div>
                  <MessageSquare className="w-3.5 h-3.5 text-[#8FA599]" />
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* ROW 2: Card 3 (Span 1) + Card 4 (Span 1) + Card 5 (Span 1) */}
          {/* ========================================================================= */}

          {/* Card 3: AsKing AI Assistant Manager (Col 1 of Row 2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="rounded-3xl bg-[#0C1712] text-white border border-[#234235] p-7 sm:p-9 shadow-lg flex flex-col justify-between space-y-6 h-full"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#12281F] text-[#B8F55C] border border-[#234235] flex items-center justify-center shadow-xs">
                <Sparkles className="w-6 h-6 text-[#B8F55C]" />
              </div>
              <h3 className="text-xl font-black text-[#F2F7F4]">
                {t("features.assistant_title")}
              </h3>
              <p className="text-xs sm:text-sm text-[#A5B8AD] leading-relaxed">
                {t("features.assistant_desc")}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#12241C] border border-[#1F382B] space-y-2">
              <div className="text-[11px] text-[#A5B8AD] font-semibold flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-[#B8F55C]" />
                <span>Executive Guidance:</span>
              </div>
              <p className="text-xs text-[#D1DDD6] italic leading-relaxed">
                "{t("features.assistant_reply_sample")}"
              </p>
            </div>
          </motion.div>

          {/* Card 4: Autonomous 24/7 AI Customer Agent (Col 2 of Row 2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="rounded-3xl bg-white border border-[#DEE7DF] p-7 sm:p-9 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 h-full"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#12281F] text-[#B8F55C] border border-[#234235] flex items-center justify-center shadow-xs">
                <Bot className="w-6 h-6 text-[#B8F55C]" />
              </div>
              <h3 className="text-xl font-black text-[#11231B]">
                {t("features.agent_title")}
              </h3>
              <p className="text-xs sm:text-sm text-[#4B6055] leading-relaxed">
                {t("features.agent_desc")}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F2F7F3] border border-[#DEE7DF] space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#184530] flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  {t("features.agent_guardrail")}
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  {t("features.agent_badge")}
                </span>
              </div>
              <p className="text-xs text-[#556A60] leading-relaxed">
                AI Agent bertindak otomatis dalam batas SOP perusahaan tanpa resiko halusinasi atau kebocoran data.
              </p>
            </div>
          </motion.div>

          {/* Card 5: Smart Scheduler & Templates (Col 3 of Row 2) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="rounded-3xl bg-white border border-[#DEE7DF] p-7 sm:p-9 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 h-full"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#12281F] text-[#B8F55C] border border-[#234235] flex items-center justify-center shadow-xs">
                <CalendarClock className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-black text-[#11231B]">
                {t("features.scheduler_title")}
              </h3>
              <p className="text-xs sm:text-sm text-[#4B6055] leading-relaxed">
                {t("features.scheduler_desc")}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#F2F7F3] border border-[#DEE7DF] space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#11231B]">
                <span>Follow-Up Demo Calendar</span>
                <span className="text-emerald-700 font-semibold text-[10px] bg-emerald-100/80 px-2 py-0.5 rounded-full">
                  {t("features.scheduler_active_badge")}
                </span>
              </div>
              <p className="text-xs text-[#556A60] leading-relaxed">
                Pengingat otomatis H-1 & broadcast template dengan parameter variabel dinamis.
              </p>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
