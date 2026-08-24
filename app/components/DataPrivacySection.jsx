"use client";

import { motion } from "framer-motion";
import {
  ShieldAlert,
  ShieldCheck,
  Server,
  HardDrive,
  Lock,
  Unlock,
  Database,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function DataPrivacySection() {
  const { t } = useTranslation();

  const cloudPoints = t("privacy.cloud_crm_points") || [];
  const askingPoints = t("privacy.asking_points") || [];

  return (
    <section id="privacy" className="py-20 md:py-28 bg-[#F2F7F3]/60 relative overflow-hidden border-y border-[#DEE7DF]">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#E5EFE7] border border-[#CFE2D3] text-xs font-bold text-[#184530]">
            <Lock className="w-3.5 h-3.5" />
            <span>{t("privacy.tag")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#11241C] tracking-tight">
            {t("privacy.title")}
          </h2>

          <p className="text-base sm:text-lg text-[#4B6055] leading-relaxed">
            {t("privacy.subtitle")}
          </p>
        </div>

        {/* Comparison Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Traditional Cloud CRMs (Risky) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-white border border-rose-200 shadow-sm p-7 sm:p-9 space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-rose-50 rounded-full blur-2xl pointer-events-none -z-0" />

            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shadow-xs">
                <Server className="w-6 h-6" />
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-rose-100/70 text-rose-700 text-xs font-bold border border-rose-200">
                <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                Risiko Kebocoran Data
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#11231B]">
                {t("privacy.cloud_crm_title")}
              </h3>
              <p className="text-xs sm:text-sm text-[#556A60] leading-relaxed">
                {t("privacy.cloud_crm_desc")}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {Array.isArray(cloudPoints) &&
                cloudPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#4A5F54]">
                    <XCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
            </div>
          </motion.div>

          {/* Card 2: AsKing Local-First Architecture (Safe & Sovereign) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl bg-[#0C1712] text-white border border-[#234235] shadow-xl p-7 sm:p-9 space-y-6 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-40 h-40 bg-[#184530]/40 rounded-full blur-3xl pointer-events-none -z-0" />

            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-[#12281F] text-[#B8F55C] border border-[#234235] flex items-center justify-center shadow-xs">
                <HardDrive className="w-6 h-6 text-[#B8F55C]" />
              </div>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#18362B] text-[#B8F55C] text-xs font-bold border border-[#234235]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B8F55C]" />
                100% Data On-Device
              </span>
            </div>

            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#F2F7F4]">
                {t("privacy.asking_title")}
              </h3>
              <p className="text-xs sm:text-sm text-[#A5B8AD] leading-relaxed">
                {t("privacy.asking_desc")}
              </p>
            </div>

            <div className="space-y-3 pt-2">
              {Array.isArray(askingPoints) &&
                askingPoints.map((point, idx) => (
                  <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-[#D1DDD6]">
                    <CheckCircle2 className="w-4 h-4 text-[#B8F55C] shrink-0 mt-0.5" />
                    <span>{point}</span>
                  </div>
                ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
