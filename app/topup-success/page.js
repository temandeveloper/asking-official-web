"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AsKingLogo } from "@/app/components/Navbar";
import ContactSupportModal from "@/app/components/ContactSupportModal";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import {
  CheckCircle2,
  RefreshCw,
  ShieldCheck,
  Globe,
  Mail,
  MessageCircle,
} from "lucide-react";

function TopUpSuccessContent() {
  const searchParams = useSearchParams();
  const { t, language, toggleLanguage } = useTranslation();

  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const refId = searchParams?.get("refId") || searchParams?.get("ref_id") || "";
  const emailParam = searchParams?.get("email") || searchParams?.get("customer_email") || "";

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
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF1EB] hover:bg-[#DDE7DE] border border-[#CFE2D3] text-xs font-bold text-[#184530] transition-all cursor-pointer shadow-2xs"
            title="Toggle Language"
          >
            <Globe className="w-3.5 h-3.5 text-[#184530]" />
            <span>{language === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex items-center justify-center px-4 sm:px-6 py-8">
        <div className="w-full max-w-lg">
          <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-[#DEE7DF] shadow-xl p-7 sm:p-10 space-y-6 text-center animate-in zoom-in-95 duration-200">
            {/* Header Status & Icon */}
            <div className="space-y-3">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-[#E5EFE7] text-[#184530] border border-[#CFE2D3] flex items-center justify-center shadow-xs">
                <CheckCircle2 className="w-8 h-8 text-[#22C55E]" />
              </div>

              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{t("topup_success.badge")}</span>
              </div>

              <div className="space-y-1.5">
                <h1 className="text-2xl sm:text-3xl font-black text-[#11231B] tracking-tight">
                  {t("topup_success.title")}
                </h1>
                <p className="text-xs sm:text-sm text-[#556A60] leading-relaxed max-w-md mx-auto">
                  {t("topup_success.subtitle")}
                </p>
              </div>

              {/* Optional RefID Pill */}
              {refId && (
                <div className="inline-block pt-1">
                  <span className="font-mono text-[11px] bg-[#F0F4F1] text-[#4A5F54] border border-[#DEE7DF] px-3 py-1 rounded-full">
                    Ref ID: <strong className="text-[#11231B]">{refId}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* Email Attribution Notice Card */}
            <div className="rounded-2xl bg-[#EBF4EE] border border-[#CFE2D3] p-4 sm:p-4.5 flex items-start gap-3.5 text-left">
              <div className="w-9 h-9 rounded-xl bg-white text-[#184530] border border-[#B8D8C0] flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <Mail className="w-4 h-4 text-[#184530]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-bold text-[#11231B]">
                  {t("topup_success.email_allocation_title")}
                </h3>
                <p className="text-[11.5px] text-[#334A3E] leading-relaxed font-medium">
                  {t("topup_success.email_allocation_desc")}
                </p>
                {emailParam && (
                  <div className="pt-0.5">
                    <span className="text-[11px] font-mono text-[#184530] bg-white px-2.5 py-0.5 rounded-md border border-[#CFE2D3] inline-block font-bold">
                      {t("topup_success.email_allocation_target")} {emailParam}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Troubleshooting & App Restart Notice */}
            <div className="p-4 sm:p-4.5 rounded-2xl bg-[#F8FAF7] border-2 border-[#184530]/20 flex items-start gap-3.5 text-left shadow-2xs">
              <div className="w-8 h-8 rounded-xl bg-[#184530] text-white flex items-center justify-center shrink-0 mt-0.5 shadow-2xs">
                <RefreshCw className="w-4 h-4 text-[#B8F55C]" />
              </div>
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-[#11231B]">
                  {t("topup_success.step_2_title")}
                </h3>
                <p className="text-[11.5px] text-[#184530] leading-relaxed font-medium">
                  {t("topup_success.step_2_desc")}
                </p>
              </div>
            </div>

            {/* Dedicated Support Section with Modal Trigger */}
            <div className="pt-2 border-t border-[#EEF3EF] space-y-3 text-center">
              <p className="text-xs text-[#556A60] leading-relaxed">
                {t("topup_success.support_notice")}
              </p>
              <div className="flex justify-center">
                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#12281F] hover:bg-[#18362B] text-[#B8F55C] text-xs font-bold transition-all shadow-md active:scale-95 cursor-pointer border border-[#2A5241]"
                >
                  <MessageCircle className="w-4 h-4 text-[#B8F55C]" />
                  <span>
                    {language === "en"
                      ? "Contact WhatsApp Support (+62 877-6900-5244)"
                      : "Hubungi WhatsApp Support (+62 877-6900-5244)"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* WhatsApp Support Modal */}
      <ContactSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        context="payment"
        user={emailParam ? { email: emailParam } : null}
        planName="Top-up AI Credit"
      />

      {/* Footer Copyright */}
      <footer className="max-w-6xl w-full mx-auto px-6 py-6 text-center text-xs text-[#889A90]">
        <p>&copy; {new Date().getFullYear()} AsKing Customer Manager &bull; GoDiscus Team</p>
      </footer>
    </div>
  );
}

export default function TopUpSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-[#12281F] border-t-transparent animate-spin" />
        </div>
      }
    >
      <TopUpSuccessContent />
    </Suspense>
  );
}
