"use client";

import Link from "next/link";
import { Laptop, Download, ArrowRight, ShieldCheck, Apple, WindowsIcon } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";



export default function CtaBanner() {
  const { t } = useTranslation();

  function WindowsIcon({ className = "w-4 h-4" }) {
    return (
      <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.802" />
      </svg>
    );
  }

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
              <span>Verified Desktop Application</span>
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
              className="relative w-full flex items-center justify-between gap-4 px-6 py-4.5 rounded-2xl bg-[#B8F55C] text-[#11281F] font-black shadow-xl hover:bg-[#A8EB4B] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            >
              <div className="flex items-center gap-3.5 text-left">
                <div className="w-11 h-11 rounded-xl bg-[#11281F] text-[#B8F55C] flex items-center justify-center shadow-md shrink-0">
                  <WindowsIcon className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <div className="text-[11px] uppercase tracking-wider font-extrabold text-[#193F2D] flex items-center gap-1.5">
                    <span>{t("cta.ms_store_desc")}</span>
                  </div>
                  <div className="text-base sm:text-lg font-black text-[#0B1A13] tracking-tight leading-tight">
                    {t("cta.btn_download")}
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
