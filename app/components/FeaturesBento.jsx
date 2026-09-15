"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  MessageCircle,
  Kanban,
  BrainCircuit,
  Bot,
  CalendarClock,
  ThumbsUp,
  Mail,
  ShieldCheck,
  Zap,
  Radio,
  Globe,
  Smartphone,
  Monitor,
  Layers,
  Lock,
  CheckCircle2,
  ShoppingCart,
  MessageCircleCheck,
  Gem,
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
            <ThumbsUp className="w-3.5 h-3.5" />
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
              <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">

                {/* 1. WhatsApp Channel Tile */}
                <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] hover:border-[#CFE2D3] transition-all space-y-3 shadow-2xs group">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-[#DEE7DF] shadow-xs flex items-center justify-center text-[#25D366] group-hover:scale-105 transition-transform">
                      <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.301-.15-1.78-.878-2.056-.979-.275-.1-.475-.15-.675.15-.2.301-.776.979-.951 1.18-.176.201-.351.226-.652.076-.301-.15-1.272-.469-2.423-1.496-.897-.8-1.503-1.789-1.679-2.09-.176-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.176.201-.301.301-.502.1-.201.05-.376-.025-.526-.075-.15-.676-1.631-.926-2.233-.244-.587-.492-.507-.676-.517-.175-.008-.376-.01-.576-.01-.2 0-.526.075-.802.376-.275.301-1.052 1.028-1.052 2.508 0 1.48 1.077 2.909 1.228 3.109.15.201 2.12 3.238 5.136 4.542.717.31 1.277.495 1.713.634.721.229 1.377.197 1.896.119.578-.087 1.78-.727 2.031-1.429.251-.702.251-1.304.176-1.429-.075-.126-.276-.201-.577-.351zM12.04 21.785h-.002a9.78 9.78 0 01-4.992-1.365l-.358-.213-3.712.974.99-3.619-.233-.371a9.78 9.78 0 01-1.503-5.185c0-5.405 4.398-9.803 9.808-9.803 2.618 0 5.079 1.02 6.93 2.871a9.754 9.754 0 012.868 6.932c0 5.407-4.399 9.809-9.808 9.809zM20.52 3.48A11.915 11.915 0 0012.04 0C5.402 0 .007 5.394.007 12.031c0 2.12.554 4.19 1.608 6.014L0 24l6.147-1.613a11.96 11.96 0 005.891 1.542h.005c6.636 0 12.031-5.395 12.031-12.033a11.914 11.914 0 00-3.554-8.416z" />
                      </svg>
                    </div>
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

                {/* 4. E-Mail Channel Tile */}
                <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] hover:border-[#CFE2D3] transition-all space-y-3 shadow-2xs group opacity-90 hover:opacity-100">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-[#DEE7DF] shadow-xs flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                      <Mail className="w-6 h-6 text-[#5B6B8A]" />
                    </div>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#11231B]">
                      {t("features.omnichannel_name_email")}
                    </h4>
                    <p className="text-[10px] text-[#556A60] mt-0.5 leading-snug">
                      {t("features.omnichannel_desc_email")}
                    </p>
                  </div>
                </div>

                {/* 3. Live Chat Widget Channel Tile */}
                <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] hover:border-[#CFE2D3] transition-all space-y-3 shadow-2xs group opacity-90 hover:opacity-100">
                  <div className="flex items-center justify-between">
                    <div className="w-11 h-11 rounded-2xl bg-white border border-[#DEE7DF] shadow-xs flex items-center justify-center text-purple-600 group-hover:scale-105 transition-transform">
                      <MessageCircle className="w-6 h-6" />
                    </div>
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
                    2026-08-25
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
          {/* ROW 2: Card 3 (Span 1) + Card 4 (Span 2) */}
          {/* ========================================================================= */}

          {/* Card 3: Smart Scheduler & Broadcast Templates (Span 1 col on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
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
              </div>
              <p className="text-xs text-[#556A60] leading-relaxed">
                Pengingat otomatis H-1 & broadcast template dengan parameter variabel dinamis.
              </p>
            </div>
          </motion.div>

          {/* Card 4: Landing Page Studio & Instant Publishing (Span 2 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="lg:col-span-2 rounded-3xl bg-white border border-[#DEE7DF] p-7 sm:p-9 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 h-full"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#12281F] text-[#B8F55C] border border-[#234235] flex items-center justify-center shadow-xs">
                  <Globe className="w-6 h-6 text-[#B8F55C]" />
                </div>
              </div>
              <h3 className="text-2xl font-black text-[#11231B]">
                {t("features.landing_title")}
              </h3>
              <p className="text-sm text-[#4B6055] leading-relaxed max-w-xl">
                {t("features.landing_desc")}
              </p>
            </div>

            {/* Studio Workspace Authentic Preview */}
            <div className="rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] p-4 sm:p-5 space-y-4 shadow-2xs overflow-hidden">
              {/* Top Studio Browser Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-[#DEE7DF]">
                {/* Traffic Light Dots */}
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                </div>

                {/* Subdomain URL Display */}
                <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-white border border-[#DEE7DF] shadow-2xs text-[11px] font-mono text-[#11231B]">
                  <Lock className="w-3 h-3 text-emerald-600 shrink-0" />
                  <span className="font-semibold text-emerald-700">https://</span>
                  <span className="font-bold text-[#11231B]">{t("features.landing_subdomain_sample")}</span>
                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[9px] font-bold border border-emerald-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {t("features.landing_live_status")}
                  </span>
                </div>

                {/* Viewport Toggles */}
                <div className="flex items-center gap-1 bg-[#EBF1EB] p-1 rounded-lg text-xs">
                  <div className="px-2 py-0.5 rounded bg-white text-[#184530] font-bold shadow-2xs flex items-center gap-1 text-[10px]">
                    <Smartphone className="w-3 h-3" />
                    <span>375px</span>
                  </div>
                  <div className="px-1.5 py-0.5 text-[#6B8075] flex items-center text-[10px]">
                    <Monitor className="w-3 h-3" />
                  </div>
                </div>
              </div>

              {/* Two-Column Studio Content: Left Components Architecture, Right Mobile Rendered Page */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                {/* Left (Col 5): Drag-and-drop Component Palette */}
                <div className="md:col-span-5 space-y-2">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#6B8075] flex items-center gap-1.5 mb-2">
                    <Layers className="w-3.5 h-3.5 text-[#184530]" />
                    <span>Komponen Terintegrasi</span>
                  </div>

                  {/* Component 1: Hero Block */}
                  <div className="p-2.5 rounded-xl bg-white border border-[#DEE7DF] hover:border-[#CFE2D3] transition-all flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#EAF3EC] text-[#184530] flex items-center justify-center font-bold text-[10px]">
                        <ShoppingCart className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-bold text-[#11231B]">Banner & List Product</span>
                    </div>
                  </div>

                  {/* Component 2: WhatsApp CTA */}
                  <div className="p-2.5 rounded-xl bg-white border border-[#DEE7DF] hover:border-[#CFE2D3] transition-all flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-[10px]">
                        <MessageCircleCheck className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-bold text-[#11231B]">Conversion Button (CTA)</span>
                    </div>
                  </div>

                  {/* Component 3: Promo & Multi-Channel */}
                  <div className="p-2.5 rounded-xl bg-white border border-[#DEE7DF] hover:border-[#CFE2D3] transition-all flex items-center justify-between shadow-2xs">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-[10px]">
                        <Gem className="w-3 h-3" />
                      </div>
                      <span className="text-xs font-bold text-[#11231B]">Promo & Multichannel</span>
                    </div>
                  </div>

                  {/* Performance Specs */}
                  <div className="pt-1.5 text-[11px] text-[#556A60] space-y-1">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{t("features.landing_tag_speed")}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{t("features.landing_feature_domain_desc")}</span>
                    </div>
                  </div>
                </div>

                {/* Right (Col 7): Mobile Live Rendered Mockup */}
                <div className="md:col-span-7 bg-white rounded-2xl border border-[#DEE7DF] p-4 shadow-sm space-y-3 relative overflow-hidden">
                  {/* Subtle top accent bar */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#184530] to-[#B8F55C]" />

                  {/* Mockup Header */}
                  <div className="flex items-center justify-between pt-1 pb-2 border-b border-[#F2F7F3]">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded-md bg-[#12281F] text-[#B8F55C] flex items-center justify-center font-bold text-[9px]">
                        B
                      </div>
                      <span className="text-xs font-bold text-[#11231B]">Brand Official Store</span>
                    </div>
                  </div>

                  {/* Mockup Hero Headline & Copy */}
                  <div className="space-y-1.5 py-1">
                    <h5 className="text-xs sm:text-sm font-extrabold text-[#11231B] leading-tight">
                      {t("features.landing_preview_hero_title")}
                    </h5>
                    <p className="text-[11px] text-[#556A60] leading-snug">
                      {t("features.landing_preview_hero_subtitle")}
                    </p>
                  </div>

                  {/* Mockup WhatsApp CTA Button */}
                  <div className="w-full py-2 px-3 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors cursor-default">
                    <MessageSquare className="w-3.5 h-3.5 fill-current" />
                    <span>{t("features.landing_preview_cta")}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* ========================================================================= */}
          {/* ROW 3: Card 5 (Span 2) + Card 6 (Span 1) */}
          {/* ========================================================================= */}

          {/* Card 5: Autonomous 24/7 AI Customer Agent (Span 2 cols on lg) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="lg:col-span-2 rounded-3xl bg-white border border-[#DEE7DF] p-7 sm:p-9 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 h-full"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#12281F] text-[#B8F55C] border border-[#234235] flex items-center justify-center shadow-xs">
                  <Bot className="w-6 h-6 text-[#B8F55C]" />
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  {t("features.agent_badge")}
                </span>
              </div>
              <h3 className="text-2xl font-black text-[#11231B]">
                {t("features.agent_title")}
              </h3>
              <p className="text-sm text-[#4B6055] leading-relaxed max-w-xl">
                {t("features.agent_desc")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-center">
              {/* Left: Guardrail & SOP Status */}
              <div className="p-4 rounded-2xl bg-[#F2F7F3] border border-[#DEE7DF] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#184530] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    {t("features.agent_guardrail")}
                  </span>
                  <span className="text-[9px] font-bold px-2 py-0.5 rounded-md bg-white border border-[#DEE7DF] text-[#184530]">
                    SOP Safe
                  </span>
                </div>
                <p className="text-xs text-[#556A60] leading-relaxed">
                  AI Agent bertindak otomatis dalam batas SOP perusahaan tanpa resiko halusinasi atau penyalahgunaan data.
                </p>
                <div className="space-y-1.5 pt-1 text-[11px] text-[#4B6055]">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Grounding basis data internal terverifikasi</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>Human handover otomatis saat kasus eskalasi</span>
                  </div>
                </div>
              </div>

              {/* Right: Live Simulated Chat Bubble */}
              <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2.5 shadow-2xs">
                <div className="flex items-center justify-between pb-2 border-b border-[#DEE7DF] text-[10px] text-[#6B8075]">
                  <span className="font-bold text-[#11231B]">Simulasi Respon Percakapan</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Aktif 24/7
                  </span>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="bg-white p-2.5 rounded-xl rounded-tl-xs border border-[#DEE7DF] max-w-[85%] text-[#11231B]">
                    Apakah AsKing support integrasi WhatsApp dan Telegram sekaligus?
                  </div>
                  <div className="bg-[#12281F] text-[#F2F7F4] p-2.5 rounded-xl rounded-tr-xs border border-[#234235] max-w-[90%] ml-auto text-[11px] leading-relaxed">
                    <span className="text-[#B8F55C] font-bold block text-[10px] mb-0.5">AsKing AI Agent:</span>
                    Ya, AsKing mendukung WhatsApp dan Telegram secara terpadu dalam satu aplikasi desktop Local-First.
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Card 6: AsKing AI Assistant Manager (Span 1 col on lg, Dark Theme) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.35 }}
            className="rounded-3xl bg-[#0C1712] text-white border border-[#234235] p-7 sm:p-9 shadow-lg flex flex-col justify-between space-y-6 h-full"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#12281F] text-[#B8F55C] border border-[#234235] flex items-center justify-center shadow-xs">
                <BrainCircuit className="w-6 h-6 text-[#B8F55C]" />
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

        </div>
      </div>
    </section>
  );
}
