"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { trackMetaCustomEvent } from "@/lib/metaPixel";
import {
  X,
  Laptop,
  ExternalLink,
  Download,
  CheckCircle2,
  Loader2,
  RotateCcw,
  ShieldCheck,
  ArrowUpRight,
  Info,
} from "lucide-react";

function WindowsIcon({ className = "w-4 h-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 3.449L9.75 2.1v9.451H0m10.949-9.602L24 0v11.4H10.949M0 12.6h9.75v9.451L0 20.699M10.949 12.6H24V24l-13.051-1.802" />
    </svg>
  );
}

export default function OpenAppModal({ isOpen, onClose, user = null }) {
  const { t, language } = useTranslation();
  const [mounted, setMounted] = useState(false);
  const [isLaunching, setIsLaunching] = useState(false);
  const [hasAttemptedLaunch, setHasAttemptedLaunch] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Keyboard navigation (ESC to close)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset launch states when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setIsLaunching(false);
      setHasAttemptedLaunch(false);
    }
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const handleOpenApp = async () => {
    setIsLaunching(true);
    setHasAttemptedLaunch(true);

    try {
      let targetDeepLink = "asking://open";

      if (isSupabaseConfigured()) {
        const supabase = createClient();
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session && user) {
          const params = new URLSearchParams({
            access_token: session.access_token || "",
            refresh_token: session.refresh_token || "",
            expires_at: String(session.expires_at || Date.now() + 3600 * 1000),
            user_id: user.id || "",
            email: user.email || "",
            full_name:
              user.user_metadata?.full_name || user.email || "AsKing User",
          });
          targetDeepLink = `asking://auth/callback?${params.toString()}`;
        }
      }

      // Track meta custom event
      trackMetaCustomEvent("OpenDesktopApp", {
        placement: "profile_modal",
        user_id: user?.id,
      });

      // Dispatch deep link to open or focus electron app
      window.location.href = targetDeepLink;
    } catch (err) {
      console.warn("Failed to generate authorized deep link:", err);
      window.location.href = "asking://open";
    } finally {
      setTimeout(() => {
        setIsLaunching(false);
      }, 1200);
    }
  };

  const modalContent = (
    <div
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-xs overflow-y-auto animate-in fade-in duration-150 cursor-pointer"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xl bg-white rounded-3xl border border-[#DEE7DF] shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200 cursor-default"
      >
        {/* Modal Header */}
        <div className="bg-[#12281F] text-white p-6 sm:p-7 flex items-center justify-between border-b border-[#234235]">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#18362B] text-[#B8F55C] border border-[#2A5241] flex items-center justify-center shadow-xs shrink-0">
              <Laptop className="w-5 h-5 text-[#B8F55C]" />
            </div>
            <div>
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#18362B] border border-[#234235] text-[10px] font-extrabold uppercase tracking-wider text-[#B8F55C] mb-1">
                <span>{t("profile.modal_app_badge")}</span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white tracking-tight">
                {t("profile.modal_app_title")}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
            title={t("profile.modal_app_close")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Subtitle / Intro */}
          <p className="text-xs sm:text-sm text-[#4E6357] leading-relaxed">
            {t("profile.modal_app_subtitle")}
          </p>

          {/* Section 1: Already Installed (Deep Link) */}
          <div className="rounded-2xl border-2 border-[#184530]/20 bg-[#F4F9F5] p-5 sm:p-6 space-y-4 transition-all hover:border-[#184530]/35">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#E0EFE4] text-[#184530] text-[11px] font-bold border border-[#CFE2D3]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  {t("profile.modal_app_installed_tag")}
                </span>
                <h4 className="text-sm sm:text-base font-black text-[#11231B] tracking-tight">
                  {t("profile.modal_app_installed_title")}
                </h4>
              </div>
            </div>

            <p className="text-xs text-[#52665B] leading-relaxed">
              {t("profile.modal_app_installed_desc")}
            </p>

            <button
              type="button"
              onClick={handleOpenApp}
              disabled={isLaunching}
              className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-[#B8F55C] hover:bg-[#A8EB4B] active:scale-[0.99] text-[#11281F] font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
            >
              {isLaunching ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#11281F]" />
                  <span>{t("profile.modal_app_launching")}</span>
                </>
              ) : (
                <>
                  <ExternalLink className="w-4 h-4 text-[#11281F]" />
                  <span>{t("profile.modal_app_installed_btn")}</span>
                </>
              )}
            </button>

            {/* Launch feedback state & helpful hint */}
            {hasAttemptedLaunch && (
              <div className="p-3.5 rounded-xl bg-white border border-[#CFE2D3] text-xs text-[#2A4D3B] space-y-2 animate-in fade-in duration-200">
                <div className="flex items-start gap-2 leading-relaxed">
                  <ShieldCheck className="w-4 h-4 text-[#22C55E] shrink-0 mt-0.5" />
                  <span>{t("profile.modal_app_launch_hint")}</span>
                </div>
                <button
                  type="button"
                  onClick={handleOpenApp}
                  className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-[#184530] hover:text-[#0C1712] underline cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{t("profile.modal_app_launch_retry")}</span>
                </button>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-2">
            <div className="w-full border-t border-[#DEE7DF]" />
            <span className="absolute bg-white px-3 text-[11px] font-bold text-[#8EA096] uppercase tracking-wider">
              {language === "en" ? "or" : "atau"}
            </span>
          </div>

          {/* Section 2: Not Yet Installed (Microsoft Store Download) */}
          <div className="rounded-2xl border border-[#DEE7DF] bg-[#F8FAF7] p-5 sm:p-6 space-y-4 my-6 transition-all hover:border-[#CFE2D3]">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-1">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#EAEFEA] text-[#4E6357] text-[11px] font-bold border border-[#DEE7DF]">
                  <Download className="w-3.5 h-3.5 text-[#184530]" />
                  {t("profile.modal_app_not_installed_tag")}
                </span>
                <h4 className="text-sm sm:text-base font-black text-[#11231B] tracking-tight">
                  {t("profile.modal_app_not_installed_title")}
                </h4>
              </div>
            </div>

            <p className="text-xs text-[#52665B] leading-relaxed">
              {t("profile.modal_app_not_installed_desc")}
            </p>

            <a
              href="https://apps.microsoft.com/detail/9NWF08NXV3GS"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() =>
                trackMetaCustomEvent("ClickMicrosoftStore", {
                  placement: "profile_modal_download",
                })
              }
              className="w-full flex items-center justify-between gap-3 px-5 py-3 rounded-2xl bg-[#12281F] hover:bg-[#1C3B2E] active:scale-[0.99] text-white font-bold text-xs sm:text-sm shadow-md border border-[#234235] transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-[#18362B] text-[#B8F55C] flex items-center justify-center shrink-0">
                  <WindowsIcon className="w-4 h-4 fill-current" />
                </div>
                <div className="text-left">
                  <div className="text-[10px] uppercase tracking-wider text-[#A5B8AD] font-semibold">
                    {t("profile.modal_app_ms_store")}
                  </div>
                  <div className="text-xs sm:text-sm font-black text-white group-hover:text-[#B8F55C] transition-colors leading-tight">
                    {t("profile.modal_app_download_btn")}
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-[#A5B8AD] group-hover:text-[#B8F55C] transition-colors shrink-0" />
            </a>
          </div>

          {/* Quick sync info */}
          <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F8FAF7] border border-[#E3EBE4] text-[11px] text-[#6B8075] leading-relaxed">
            <Info className="w-4 h-4 text-[#184530] shrink-0 mt-0.5" />
            <span>{t("profile.modal_app_sync_note")}</span>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-[#F8FAF7] border-t border-[#EEF3EF] px-6 py-4 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white hover:bg-[#EEF3EF] text-[#3E5348] text-xs font-bold border border-[#DEE7DF] transition-colors cursor-pointer"
          >
            {t("profile.modal_app_close")}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
