"use client";

import { Check, Sparkles, Zap, ShieldCheck, ArrowRight, Building2, HelpCircle } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { PRICING_CONFIG } from "@/lib/config/pricing";
import { trackMetaLinkEvent } from "@/lib/metaPixel";

export default function PricingSection() {
  const { t, language } = useTranslation();

  const trialFeatures = t("pricing.trial_features") || [];
  const proFeatures = t("pricing.pro_features") || [];
  const advanceFeatures = t("pricing.advance_features") || [];

  const displayOriginalPrice = t("pricing.pro_original_price") || `Rp ${PRICING_CONFIG.proOriginalPrice}`;
  const displayPrice = t("pricing.pro_price") || `Rp ${PRICING_CONFIG.proPrice}`;
  const displayDiscount = `${PRICING_CONFIG.proDiscountPercent}%`;

  return (
    <section id="pricing" className="py-24 px-6 sm:px-8 bg-[#F2F7F3] border-t border-[#DEE7DF] relative overflow-hidden">
      {/* Background Decorative Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#B8F55C]/15 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5EFE7] border border-[#CFE2D3] text-xs font-bold text-[#184530] shadow-2xs">
            <Zap className="w-3.5 h-3.5 text-[#184530]" />
            <span>{t("pricing.tag")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#11231B] tracking-tight">
            {t("pricing.title")}
          </h2>

          <p className="text-sm sm:text-base text-[#4B6055] leading-relaxed max-w-2xl mx-auto font-medium">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">

          {/* 1. FREE TRIAL 15 HARI */}
          <div className="rounded-3xl bg-white border border-[#DEE7DF] p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#CFE2D3] transition-all relative">
            <div className="space-y-6">
              {/* Badge & Title */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F2F7F3] border border-[#DEE7DF] text-[11px] font-bold text-[#4B6055]">
                  <span>{t("pricing.trial_badge")}</span>
                </div>
                <h3 className="text-2xl font-black text-[#11231B] tracking-tight">
                  {t("pricing.trial_title")}
                </h3>
                <p className="text-xs text-[#556A60] leading-relaxed min-h-[36px]">
                  {t("pricing.trial_desc")}
                </p>
              </div>

              {/* Price */}
              <div className="pt-2 pb-4 border-b border-[#EBF1EB]">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-[#11231B] tracking-tight">
                    {t("pricing.trial_price")}
                  </span>
                  <span className="text-xs font-semibold text-[#556A60]">
                    {t("pricing.trial_period")}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#11231B]">
                  {language === "id" ? "Fitur Termasuk:" : "Features Included:"}
                </div>
                <ul className="space-y-2.5">
                  {Array.isArray(trialFeatures) &&
                    trialFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#4B6055]">
                        <div className="w-4 h-4 rounded-full bg-[#E5EFE7] text-[#184530] flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px]">
                          ✓
                        </div>
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8 mt-6 border-t border-[#EBF1EB]">
              <Link
                href="/signup"
                onClick={(event) => trackMetaLinkEvent(event, "Lead", {
                  content_name: "AsKing Free Trial",
                  content_category: "pricing",
                })}
                className="w-full py-3.5 px-6 rounded-2xl bg-[#EBF1EB] hover:bg-[#DDE7DE] text-[#184530] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer group"
              >
                <span>{t("pricing.trial_cta")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* 2. PRO BUSINESS (FEATURED CARD) */}
          <div className="rounded-3xl bg-[#12281F] border-2 border-[#B8F55C] p-8 shadow-xl flex flex-col justify-between relative transform lg:-translate-y-2 text-white">

            <div className="space-y-6 pt-2">
              {/* Badge & Title */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#18362B] border border-[#2A5241] text-[11px] font-bold text-[#B8F55C]">
                    <Sparkles className="w-3.5 h-3.5 text-[#B8F55C]" />
                    <span>{language === "id" ? "Rekomendasi Utama" : "Best Value"}</span>
                  </div>
                  <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-rose-500/20 border border-rose-500/40 text-[11px] font-bold text-rose-300">
                    <span>🔥 {t("pricing.pro_discount_badge")}</span>
                  </div>
                </div>
                <h3 className="text-3xl font-black text-white tracking-tight">
                  {t("pricing.pro_title")}
                </h3>
                <p className="text-xs text-[#A1B8AC] leading-relaxed min-h-[36px]">
                  {t("pricing.pro_desc")}
                </p>
              </div>

              {/* Price */}
              <div className="pt-2 pb-4 border-b border-[#234235]">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="text-sm font-semibold text-[#8EA096] line-through">
                    {displayOriginalPrice}
                  </span>
                  <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-500 text-white shadow-xs uppercase tracking-wider">
                    {language === "id" ? `Hemat ${displayDiscount}` : `Save ${displayDiscount}`}
                  </span>
                </div>
                <div className="flex items-baseline gap-1.5">
                  <span className="text-4xl sm:text-5xl font-black text-[#B8F55C] tracking-tight">
                    {displayPrice}
                  </span>
                  <span className="text-xs font-semibold text-[#A1B8AC]">
                    {t("pricing.pro_period")}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-white">
                  {language === "id" ? "Seluruh Fitur Unggulan:" : "Everything Included:"}
                </div>
                <ul className="space-y-2.5">
                  {Array.isArray(proFeatures) &&
                    proFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#DEE7DF]">
                        <div className="w-4 h-4 rounded-full bg-[#B8F55C] text-[#11281F] flex items-center justify-center shrink-0 mt-0.5 font-black text-[10px]">
                          ✓
                        </div>
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8 mt-6 border-t border-[#234235]">
              <Link
                href="/signup"
                onClick={(event) => trackMetaLinkEvent(event, "Lead", {
                  content_name: "AsKing Pro Business",
                  content_category: "pricing",
                  currency: "IDR",
                  value: PRICING_CONFIG.proRawAmount,
                })}
                className="w-full py-4 px-6 rounded-2xl bg-[#B8F55C] hover:bg-[#A6EA47] text-[#11281F] font-black text-sm flex items-center justify-center gap-2 transition-all shadow-lg hover:shadow-xl cursor-pointer group"
              >
                <span>{t("pricing.pro_cta")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* 3. ADVANCE BUSINESS (COMING SOON) */}
          <div className="rounded-3xl bg-white border border-[#DEE7DF] p-8 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-[#CFE2D3] transition-all relative">
            <div className="space-y-6">
              {/* Badge & Title */}
              <div className="space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-800">
                  <span>{t("pricing.advance_badge")}</span>
                </div>
                <h3 className="text-2xl font-black text-[#11231B] tracking-tight">
                  {t("pricing.advance_title")}
                </h3>
                <p className="text-xs text-[#556A60] leading-relaxed min-h-[36px]">
                  {t("pricing.advance_desc")}
                </p>
              </div>

              {/* Price */}
              <div className="pt-2 pb-4 border-b border-[#EBF1EB]">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-3xl sm:text-4xl font-black text-[#11231B] tracking-tight">
                    {t("pricing.advance_price")}
                  </span>
                </div>
                <div className="mt-2 text-[11px] font-semibold text-[#556A60] flex items-center gap-1">
                  <Building2 className="w-3 h-3 text-[#184530]" />
                  <span>{t("pricing.advance_period")}</span>
                </div>
              </div>
              {/* Features List */}
              <div className="space-y-3 pt-2">
                <div className="text-xs font-bold uppercase tracking-wider text-[#11231B]">
                  {language === "id" ? "Fitur Advance & Kolaborasi:" : "Advance Capabilities:"}
                </div>
                <ul className="space-y-2.5">
                  {Array.isArray(advanceFeatures) &&
                    advanceFeatures.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-[#4B6055]">
                        <div className="w-4 h-4 rounded-full bg-emerald-100 text-[#184530] flex items-center justify-center shrink-0 mt-0.5 font-bold text-[10px]">
                          +
                        </div>
                        <span className="leading-tight">{feat}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* CTA Button */}
            <div className="pt-8 mt-6 border-t border-[#EBF1EB]">
              <a
                href="mailto:asking@godiscus.com?subject=Inquiry%20Advance%20Business%20Plan%20AsKing"
                className="w-full py-3.5 px-6 rounded-2xl bg-white border border-[#CFE2D3] hover:bg-[#F2F7F3] text-[#184530] font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-2xs cursor-pointer group"
              >
                <span>{t("pricing.advance_cta")}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Trust & Guarantee Callout */}
        <div className="mt-16 p-6 rounded-3xl bg-white border border-[#DEE7DF] shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-[#E5EFE7] text-[#184530] flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-sm font-bold text-[#11231B]">
                {language === "id" ? "100% Kedaulatan Data Lokal" : "100% Local Data Sovereignty"}
              </div>
              <div className="text-xs text-[#556A60]">
                {language === "id"
                  ? "Seluruh data pelanggan Anda tersimpan di komputer sendiri. Tidak ada biaya pesan tersembunyi."
                  : "All customer records reside on your machine. Zero hidden per-message cloud fees."}
              </div>
            </div>
          </div>

          <div className="text-xs text-[#556A60] font-medium shrink-0">
            {language === "id"
              ? "Pertanyaan seputar paket? "
              : "Questions about plans? "}
            <a href="mailto:asking@godiscus.com" className="text-[#184530] font-bold underline">
              asking@godiscus.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
