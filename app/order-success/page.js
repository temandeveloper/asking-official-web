"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AsKingLogo } from "@/app/components/Navbar";
import ContactSupportModal from "@/app/components/ContactSupportModal";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { trackMetaCustomEvent } from "@/lib/metaPixel";
import {
  CheckCircle2,
  ShieldCheck,
  Globe,
  Mail,
  MessageCircle,
  Download,
  ArrowRight,
  ExternalLink,
  Laptop,
  KeyRound,
  Check,
  Info,
} from "lucide-react";

function WindowsIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.802" />
    </svg>
  );
}

const MS_STORE_URL = "https://apps.microsoft.com/detail/9NWF08NXV3GS";

function OrderSuccessContent() {
  const searchParams = useSearchParams();
  const { t, language, toggleLanguage } = useTranslation();

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Extract payment/transaction reference from PayPal query parameters
  const refId =
    searchParams?.get("tx") ||
    searchParams?.get("payment_id") ||
    searchParams?.get("order_id") ||
    searchParams?.get("refId") ||
    searchParams?.get("ref_id") ||
    "";

  // Extract customer email if forwarded by payment gateway
  const emailParam =
    searchParams?.get("email") ||
    searchParams?.get("payer_email") ||
    searchParams?.get("customer_email") ||
    searchParams?.get("cm") ||
    "";

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col justify-between hero-grid relative overflow-hidden text-[#11231B]">
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[720px] h-[380px] bg-radial from-[#B8F55C]/20 via-[#B8F55C]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Top Header */}
      <header className="max-w-6xl w-full mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-2">
          <AsKingLogo className="w-9 h-9 group-hover:scale-105 transition-transform" />
        </Link>

        <div className="flex items-center gap-3">
          {/* Language Switcher Pill */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#EBF1EB] hover:bg-[#DDE7DE] border border-[#CFE2D3] text-xs font-bold text-[#184530] transition-all cursor-pointer shadow-2xs"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#184530]" />
            <span>{language === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-xl">
          <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-[#DEE7DF] shadow-xl p-7 sm:p-10 space-y-7 text-center animate-in zoom-in-95 duration-200">
            {/* Header Status & Icon */}
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-[#E5EFE7] text-[#184530] border border-[#CFE2D3] flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t("order_success.badge")}</span>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-black text-[#11231B] tracking-tight">
                  {t("order_success.title")}
                </h1>
                <p className="text-xs sm:text-sm text-[#556A60] leading-relaxed max-w-lg mx-auto">
                  {t("order_success.subtitle")}
                </p>
              </div>

              {/* Optional Transaction ID Pill */}
              {refId && (
                <div className="inline-block pt-1">
                  <span className="font-mono text-[11px] bg-[#F0F4F1] text-[#4A5F54] border border-[#DEE7DF] px-3.5 py-1 rounded-full">
                    Reference ID: <strong className="text-[#11231B]">{refId}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Email Dispatch Notice Card */}
            <div className="rounded-2xl bg-[#EBF4EE] border border-[#CFE2D3] p-5 flex items-start gap-3.5 text-left">
              <div className="w-10 h-10 rounded-xl bg-white text-[#184530] border border-[#B8D8C0] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Mail className="w-5 h-5 text-[#184530]" />
              </div>
              <div className="space-y-1.5 flex-1 min-w-0">
                <h3 className="text-sm font-bold text-[#11231B]">
                  {t("order_success.email_card_title")}
                </h3>
                <p className="text-xs text-[#334A3E] leading-relaxed">
                  {t("order_success.email_card_desc")}
                </p>
                {emailParam && (
                  <div className="pt-1">
                    <span className="text-[11px] font-mono text-[#184530] bg-white px-2.5 py-1 rounded-md border border-[#CFE2D3] inline-block font-bold truncate max-w-full">
                      {t("order_success.email_card_target")} {emailParam}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Direct Desktop App Download Card (NOT a deeplink) */}
            <div className="rounded-2xl bg-[#0C1712] border border-[#234235] p-5 sm:p-6 text-left space-y-4 shadow-lg text-white">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#18362B] text-[#B8F55C] flex items-center justify-center">
                    <Laptop className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm font-extrabold text-[#F2F7F4]">
                    {t("order_success.download_card_title")}
                  </h3>
                </div>
                <span className="text-[10px] uppercase tracking-wider font-bold text-[#B8F55C] bg-[#18362B] px-2.5 py-0.5 rounded-full border border-[#234235]">
                  Windows 10/11
                </span>
              </div>

              <p className="text-xs text-[#A5B8AD] leading-relaxed">
                {t("order_success.download_card_desc")}
              </p>

              {/* Direct Microsoft Store Download Link */}
              <a
                href={MS_STORE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackMetaCustomEvent("ClickMicrosoftStore", {
                    placement: "order_success_download",
                  })
                }
                className="w-full flex items-center justify-between gap-4 px-5 py-4 rounded-xl bg-[#B8F55C] text-[#11281F] font-black shadow-lg hover:bg-[#A8EB4B] transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-[#11281F] text-[#B8F55C] flex items-center justify-center shadow-xs shrink-0">
                    <WindowsIcon className="w-4.5 h-4.5 fill-current" />
                  </div>
                  <div className="text-left">
                    <div className="text-[10px] uppercase tracking-wider font-extrabold text-[#193F2D]">
                      {t("order_success.download_ms_store")}
                    </div>
                    <div className="text-sm sm:text-base font-black text-[#0B1A13] tracking-tight leading-tight">
                      {t("order_success.download_btn")}
                    </div>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-[#11281F] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </a>
            </div>

            {/* 3-Step Setup Instructions */}
            <div className="p-5 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] text-left space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#184530]">
                {t("order_success.guide_title")}
              </h4>
              <div className="space-y-2.5 text-xs">
                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#12281F] text-[#B8F55C] text-[10.5px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </span>
                  <div>
                    <strong className="text-[#11231B]">{t("order_success.step_1_title")}: </strong>
                    <span className="text-[#556A60]">{t("order_success.step_1_desc")}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#12281F] text-[#B8F55C] text-[10.5px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </span>
                  <div>
                    <strong className="text-[#11231B]">{t("order_success.step_2_title")}: </strong>
                    <span className="text-[#556A60]">{t("order_success.step_2_desc")}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-[#12281F] text-[#B8F55C] text-[10.5px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </span>
                  <div>
                    <strong className="text-[#11231B]">{t("order_success.step_3_title")}: </strong>
                    <span className="text-[#556A60]">{t("order_success.step_3_desc")}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Support and Contact Section */}
            <div className="pt-2 border-t border-[#EEF3EF] space-y-3 text-center">
              <p className="text-xs text-[#556A60] leading-relaxed max-w-md mx-auto">
                {t("order_success.support_notice")}
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4.5 py-2 rounded-full bg-[#12281F] hover:bg-[#18362B] text-[#B8F55C] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer border border-[#2A5241]"
                >
                  <MessageCircle className="w-3.5 h-3.5 text-[#B8F55C]" />
                  <span>
                    {language === "en"
                      ? "WhatsApp Support (+62 877-6900-5244)"
                      : "WhatsApp Support (+62 877-6900-5244)"}
                  </span>
                </button>

                <a
                  href="mailto:asking@godiscus.com"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#EBF1EB] hover:bg-[#DEE7DF] text-[#184530] text-xs font-bold transition-all border border-[#CFE2D3]"
                >
                  <Mail className="w-3.5 h-3.5 text-[#184530]" />
                  <span>asking@godiscus.com</span>
                </a>
              </div>
            </div>

            {/* Return to Home Link */}
            <div className="pt-2">
              <Link
                href="/"
                className="text-xs font-bold text-[#184530] hover:underline inline-flex items-center gap-1"
              >
                <span>{t("order_success.btn_home")}</span>
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* WhatsApp Support Modal */}
      <ContactSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
      />

      {/* Footer */}
      <footer className="py-6 text-center text-xs text-[#6B8075] border-t border-[#DEE7DF]/40 max-w-6xl w-full mx-auto px-6">
        <p>
          &copy; {new Date().getFullYear()} AsKing Customer Manager &bull; GoDiscus Team
        </p>
      </footer>
    </div>
  );
}

export default function OrderSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center text-xs text-[#556A60]">
          Loading order status...
        </div>
      }
    >
      <OrderSuccessContent />
    </Suspense>
  );
}

