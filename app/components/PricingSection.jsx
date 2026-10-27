"use client";

import { Check, ShieldCheck, ArrowRight, Laptop, Lock, HelpCircle, Flame } from "lucide-react";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { PRICING_CONFIG } from "@/lib/config/pricing";
import { trackMetaLinkEvent, CHECKOUT_URL } from "@/lib/metaPixel";

export default function PricingSection() {
  const { t, language } = useTranslation();

  const includedItems = t("pricing.what_you_get_items") || [
    "Aplikasi Desktop resmi AsKing Customer Manager",
    "Web Landing Page Bisnis, gratis 1 subdomain",
    "Lisensi aktivasi akun dan seluruh modul fitur utama",
    "Kuota Credit AI untuk asisten dan pesan otomatis",
    "Pembaruan aplikasi dan panduan penggunaan praktis",
    "Layanan Bantuan",
  ];

  const displayOriginalPrice =
    t("pricing.pro_plus_original_price") || `Rp ${PRICING_CONFIG.proPlusOriginalPrice}`;
  const displayPrice =
    t("pricing.pro_plus_price") || `Rp ${PRICING_CONFIG.proPlusPrice}`;
  const displayDiscount = `${PRICING_CONFIG.proPlusDiscountPercent}%`;
  const promoLimitText =
    t("pricing.pro_plus_promo_limit") || `Promo Terbatas • ${PRICING_CONFIG.proPlusPromoLimit}`;

  return (
    <section id="pricing" className="py-20 md:py-28 px-6 sm:px-8 bg-[#F8FAF7] border-t border-[#DEE7DF] relative overflow-hidden">
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5EFE7] border border-[#CFE2D3] text-xs font-bold text-[#184530] shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#184530]" />
            <span>{t("pricing.tag")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-[44px] font-black text-[#11231B] tracking-tight leading-[1.2]">
            {t("pricing.title")}
          </h2>

          <p className="text-sm sm:text-base text-[#4B6055] leading-relaxed max-w-2xl mx-auto font-normal">
            {t("pricing.subtitle")}
          </p>
        </div>

        {/* Master Offer Card (Split 2-Column Layout) */}
        <div className="bg-white border border-[#DEE7DF] rounded-3xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 items-stretch">
            {/* Left Column: What You Get & Feature List */}
            <div className="lg:col-span-7 p-7 sm:p-10 lg:p-12 flex flex-col justify-between space-y-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="text-xs font-extrabold tracking-wider uppercase text-[#184530]">
                    Paket Lengkap
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#11231B] tracking-tight">
                    {t("pricing.what_you_get_title")}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#556A60] leading-relaxed">
                    Semua modul utama siap pakai langsung dari komputer Anda tanpa perlu berlangganan cloud CRM terpisah.
                  </p>
                </div>

                {/* Inclusions List */}
                <div className="pt-2">
                  <ul className="space-y-3.5">
                    {Array.isArray(includedItems) &&
                      includedItems.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-sm text-[#273B31]">
                          <div className="w-5 h-5 rounded-full bg-[#E5EFE7] text-[#184530] border border-[#CFE2D3] flex items-center justify-center shrink-0 mt-0.5 font-black text-xs">
                            <Check className="w-3 h-3 stroke-[3]" />
                          </div>
                          <span className="font-semibold leading-snug">{item}</span>
                        </li>
                      ))}
                  </ul>
                </div>
              </div>

              {/* Local-First Architecture Guarantee Note */}
              <div className="pt-6 border-t border-[#F2F7F3] flex items-center gap-3 text-xs text-[#556A60]">
                <div className="w-8 h-8 rounded-xl bg-[#F2F7F3] text-[#184530] flex items-center justify-center shrink-0">
                  <Lock className="w-4 h-4 text-[#184530]" />
                </div>
                <div className="leading-relaxed">
                  <span className="font-bold text-[#11231B]">Privasi Terjamin:</span> Seluruh riwayat pesan, tiket, dan kontak pelanggan tersimpan di perangkat lokal Anda.
                </div>
              </div>
            </div>

            {/* Right Column: Pricing Box & Action Button */}
            <div className="lg:col-span-5 bg-[#12281F] text-white p-7 sm:p-10 lg:p-12 border-t lg:border-t-0 lg:border-l border-[#234235] flex flex-col justify-between space-y-8 relative overflow-hidden">
              <div className="space-y-6">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="inline-flex max-w-full items-center gap-1 whitespace-nowrap rounded-full border px-2 py-0.5 text-xs font-bold border-rose-500/40 bg-rose-500/20 text-rose-300">
                    <span>{t("pricing.pro_plus_badge")}</span>
                  </span>
                </div>

                {/* Plan Title & Subtitle */}
                <div className="space-y-1.5">
                  <h4 className="text-3xl font-black text-white tracking-tight">
                    {t("pricing.pro_plus_title")}
                  </h4>
                  <p className="text-xs text-[#A1B8AC] leading-relaxed">
                    {t("pricing.pro_plus_desc")}
                  </p>
                </div>

                {/* Price Display */}
                <div className="pt-3 pb-5 border-y border-[#234235] space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-[#8EA096] line-through">
                      {displayOriginalPrice}
                    </span>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-rose-600 text-white shadow-xs uppercase tracking-wider">
                      {language === "id" ? `Hemat ${displayDiscount}` : `Save ${displayDiscount}`}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl sm:text-5xl font-black text-[#B8F55C] tracking-tight">
                      {displayPrice}
                    </span>
                  </div>

                  <div className="text-[11px] font-semibold text-[#A1B8AC] flex items-center gap-1.5 pt-1">
                    <Laptop className="w-3.5 h-3.5 text-[#B8F55C]" />
                    <span>{t("pricing.pro_plus_period")} (Lifetime License)</span>
                  </div>
                </div>

                {/* Specs Note */}
                <p className="text-[11px] text-[#A1B8AC] leading-relaxed">
                  {t("pricing.specs_note")}
                </p>
              </div>

              {/* Action Button & Security Assurance */}
              <div className="space-y-3.5 pt-4">
                <a
                  href={CHECKOUT_URL}
                  onClick={(event) =>
                    trackMetaLinkEvent(event, "InitiateCheckout", {
                      content_name: "AsKing Lisensi Sekali Bayar",
                      content_category: "software",
                      currency: "IDR",
                      value: PRICING_CONFIG.proPlusRawAmount,
                    })
                  }
                  className="w-full py-4 px-6 rounded-2xl bg-[#B8F55C] hover:bg-[#A8EB4B] text-[#11281F] font-black text-base flex items-center justify-center gap-2.5 transition-all shadow-md hover:shadow-xl active:scale-[0.99] cursor-pointer group"
                >
                  <span>{t("pricing.cta_claim_offer")}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>

                <p className="text-[10px] text-center text-[#8EA096] leading-tight">
                  {t("pricing.secure_checkout_note")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Three Assurance Badges */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
          <div className="p-4 rounded-2xl bg-white border border-[#DEE7DF] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5EFE7] text-[#184530] flex items-center justify-center shrink-0 font-bold">
              <Check className="w-4 h-4 text-[#184530]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#11231B]">Lisensi Tetap</div>
              <div className="text-[11px] text-[#556A60]">Tanpa biaya sewa bulanan</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#DEE7DF] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5EFE7] text-[#184530] flex items-center justify-center shrink-0 font-bold">
              <Lock className="w-4 h-4 text-[#184530]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#11231B]">Data Lokal Mandiri</div>
              <div className="text-[11px] text-[#556A60]">100% tersimpan di perangkat</div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white border border-[#DEE7DF] shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#E5EFE7] text-[#184530] flex items-center justify-center shrink-0 font-bold">
              <HelpCircle className="w-4 h-4 text-[#184530]" />
            </div>
            <div className="text-left">
              <div className="text-xs font-bold text-[#11231B]">Dukungan Bantuan</div>
              <div className="text-[11px] text-[#556A60]">Bantuan & panduan instalasi</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
