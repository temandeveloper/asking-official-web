"use client";

import { useTranslation } from "@/lib/i18n/LanguageContext";
import { ShieldCheck, ExternalLink } from "lucide-react";

export default function StatsBanner() {
  const { t, language } = useTranslation();

  const stats = [
    {
      value: t("stats.stat1_value"),
      title: t("stats.stat1_title"),
      desc: t("stats.stat1_desc"),
      source: t("stats.stat1_source"),
    },
    {
      value: t("stats.stat2_value"),
      title: t("stats.stat2_title"),
      desc: t("stats.stat2_desc"),
      source: t("stats.stat2_source"),
    },
    {
      value: t("stats.stat3_value"),
      title: t("stats.stat3_title"),
      desc: t("stats.stat3_desc"),
      source: t("stats.stat3_source"),
    },
    {
      value: t("stats.stat4_value"),
      title: t("stats.stat4_title"),
      desc: t("stats.stat4_desc"),
      source: t("stats.stat4_source"),
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-[#F8FAF7]">
      <div className="max-w-6xl mx-auto px-6 sm:px-8">
        <div className="bg-white border border-[#DEE7DF] rounded-3xl p-7 sm:p-9 shadow-sm hover:shadow-md transition-shadow">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 lg:divide-x divide-[#DEE7DF]">
            {stats.map((stat, idx) => (
              <div
                key={idx}
                className={`flex flex-col justify-between text-left ${idx > 0 ? "pt-6 sm:pt-0 lg:pl-6" : ""
                  }`}
              >
                <div>
                  <div className="text-3xl sm:text-4xl lg:text-[40px] font-black text-[#11231B] tracking-tight leading-none">
                    {stat.value}
                  </div>

                  <h3 className="text-xs sm:text-sm font-bold text-[#11231B] mt-2 leading-snug">
                    {stat.title}
                  </h3>

                  <p className="text-[11px] sm:text-xs text-[#556A60] mt-1.5 leading-relaxed">
                    {stat.desc}
                  </p>
                </div>

                <div className="pt-3 mt-3 border-t border-[#F2F7F3]">
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#184530] bg-[#EAF3EC] px-2.5 py-0.5 rounded-full border border-[#CFE2D3]">
                    {stat.source}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Footnote Citation with DeepStrike URL */}
          <div className="mt-8 pt-5 border-t border-[#DEE7DF] flex flex-col sm:flex-row items-center justify-between gap-3 text-center sm:text-left">
            <a
              href="https://deepstrike.io/blog/third-party-risk-statistics"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-semibold text-emerald-700 hover:text-emerald-800 hover:underline inline-flex items-center gap-1 transition-colors"
            >
              <span>{language === "id" ? "Sumber: Third-Party Risk Statistics 2026: Vendor & Supply Chain Risk" : "Source: Third-Party Risk Statistics 2026: Vendor & Supply Chain Risk"}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
