"use client";

import Link from "next/link";
import { Laptop, Download, ArrowRight, ShieldCheck, Apple, Terminal } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function CtaBanner() {
  const { t } = useTranslation();

  return (
    <section id="download" className="py-20 bg-[#F8FAF7]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="rounded-3xl bg-[#0C1712] border border-[#234235] px-8 py-12 sm:px-14 sm:py-16 flex flex-col lg:flex-row items-center justify-between gap-10 shadow-2xl relative overflow-hidden text-center lg:text-left">
          {/* Subtle glow background */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[450px] h-[300px] bg-[#B8F55C]/10 rounded-full blur-3xl pointer-events-none" />

          {/* Left Title */}
          <div className="relative z-10 space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#18362B] border border-[#234235] text-xs font-bold text-[#B8F55C]">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Native Desktop Application</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white leading-tight">
              {t("cta.title")}
            </h2>

            <p className="text-sm sm:text-base text-[#A5B8AD] leading-relaxed">
              {t("cta.subtitle")}
            </p>
          </div>

          {/* Right Action Buttons */}
          <div className="relative z-10 flex flex-col items-center lg:items-end gap-3.5 w-full lg:w-auto">
            <Link
              href="/signup"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#B8F55C] text-[#12281F] font-black text-sm shadow-md hover:bg-[#A5E744] hover:shadow-xl transition-all hover:scale-102 cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>{t("cta.btn_download")}</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
