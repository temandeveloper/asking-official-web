"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ChevronDown,
  Menu,
  X,
  User,
  Globe,
  Download,
  Sparkles,
  ShieldCheck,
  MessageSquare,
  Kanban,
  Check,
} from "lucide-react";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export function AsKingLogo({ className = "w-9 h-9" }) {
  return (
    <div className="flex items-center gap-2.5">
      <div className={`relative flex items-center justify-center rounded-xl bg-[#12281F] border border-[#234235] shadow-xs shrink-0 overflow-hidden ${className}`}>
        <img
          src="/logo.png"
          alt="AsKing Logo"
          className="w-full h-full object-contain"
        />
      </div>
      <div className="flex flex-col text-left">
        <span className="text-lg font-black tracking-tight text-[#11231B] leading-none">
          AsKing
        </span>
        <span className="text-[10px] font-semibold text-[#556A60] tracking-tight mt-0.5">
          Customer Manager
        </span>
      </div>
    </div>
  );
}

// Backward compatibility alias for any existing imports
export const ClauseLogo = AsKingLogo;

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [solutionsOpen, setSolutionsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);

  const { t, language, setLanguage, toggleLanguage } = useTranslation();

  useEffect(() => {
    if (!isSupabaseConfigured()) return;

    try {
      const supabase = createClient();
      supabase.auth.getUser().then(({ data: { user: currentUser } }) => {
        setUser(currentUser);
      });

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => {
        subscription.unsubscribe();
      };
    } catch (err) {
      console.error("Navbar auth sync error:", err);
    }
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-[#F8FAF7]/90 backdrop-blur-md border-b border-[#12281F]/5 transition-all">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 h-20 flex items-center justify-between">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center group">
          <AsKingLogo className="w-9 h-9 group-hover:scale-105 transition-transform" />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-7 text-[14px] font-semibold text-[#3D5247]">
          {/* Solutions Dropdown */}
          <div className="relative group">
            <button
              onClick={() => setSolutionsOpen(!solutionsOpen)}
              onMouseEnter={() => setSolutionsOpen(true)}
              className="flex items-center gap-1 hover:text-[#11231B] transition-colors py-2 cursor-pointer"
            >
              <span>{t("nav.solutions")}</span>
              <ChevronDown
                className={`w-3.5 h-3.5 transition-transform duration-200 ${solutionsOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {solutionsOpen && (
              <div
                onMouseLeave={() => setSolutionsOpen(false)}
                className="absolute top-full left-0 mt-1 w-64 rounded-2xl bg-white p-2.5 shadow-xl border border-[#DEE7DF] animate-in fade-in slide-in-from-top-2 duration-150 space-y-1"
              >
                <a
                  href="/#omnichannel"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-[#F2F7F3] text-[#11231B] font-medium transition-colors"
                >
                  <MessageSquare className="w-4 h-4 text-[#184530]" />
                  <div>
                    <div className="font-bold text-[#11231B]">Omnichannel Hub</div>
                    <div className="text-[11px] text-[#556A60]">WhatsApp, Telegram, LiveChat</div>
                  </div>
                </a>
                <a
                  href="/#features"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-[#F2F7F3] text-[#11231B] font-medium transition-colors"
                >
                  <Kanban className="w-4 h-4 text-[#184530]" />
                  <div>
                    <div className="font-bold text-[#11231B]">Kanban & Tickets</div>
                    <div className="text-[11px] text-[#556A60]">Visual Workflow & Deadlines</div>
                  </div>
                </a>
                <a
                  href="/#features"
                  className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs hover:bg-[#F2F7F3] text-[#11231B] font-medium transition-colors"
                >
                  <Sparkles className="w-4 h-4 text-[#184530]" />
                  <div>
                    <div className="font-bold text-[#11231B]">AsKing AI Assistant</div>
                    <div className="text-[11px] text-[#556A60]">24/7 Agent & Manager Guidance</div>
                  </div>
                </a>
              </div>
            )}
          </div>

          <a
            href="/#privacy"
            className="hover:text-[#11231B] transition-colors py-2 flex items-center gap-1.5"
          >
            <ShieldCheck className="w-4 h-4 text-[#184530]" />
            <span>{t("nav.data_privacy")}</span>
          </a>

          <a
            href="/#pricing"
            className="hover:text-[#11231B] transition-colors py-2"
          >
            {t("nav.pricing")}
          </a>

          <a
            href="/#download"
            className="hover:text-[#11231B] transition-colors py-2 flex items-center gap-1 text-[#184530] font-bold"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{t("nav.download")}</span>
          </a>
        </nav>

        {/* Action Controls & Language Switcher */}
        <div className="hidden md:flex items-center gap-3">
          {/* Language Switcher Pill */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EBF1EB] hover:bg-[#DDE7DE] border border-[#CFE2D3] text-xs font-bold text-[#184530] transition-all cursor-pointer shadow-2xs"
              title="Toggle Language"
            >
              <Globe className="w-3.5 h-3.5 text-[#184530]" />
              <span className="uppercase">{language}</span>
              <ChevronDown className={`w-3 h-3 transition-transform ${langDropdownOpen ? "rotate-180" : ""}`} />
            </button>

            {langDropdownOpen && (
              <div
                onMouseLeave={() => setLangDropdownOpen(false)}
                className="absolute right-0 mt-1.5 w-36 rounded-2xl bg-white p-1.5 shadow-xl border border-[#DEE7DF] animate-in fade-in slide-in-from-top-2 duration-150 z-50 space-y-1"
              >
                <button
                  type="button"
                  onClick={() => {
                    setLanguage("id");
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${language === "id"
                      ? "bg-[#12281F] text-[#B8F55C]"
                      : "text-[#3D5247] hover:bg-[#F2F7F3]"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🇮🇩</span>
                    <span>Indonesia</span>
                  </div>
                  {language === "id" && <Check className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setLanguage("en");
                    setLangDropdownOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${language === "en"
                      ? "bg-[#12281F] text-[#B8F55C]"
                      : "text-[#3D5247] hover:bg-[#F2F7F3]"
                    }`}
                >
                  <div className="flex items-center gap-2">
                    <span>🇬🇧</span>
                    <span>English</span>
                  </div>
                  {language === "en" && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            )}
          </div>

          {/* User Auth Buttons */}
          {user ? (
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#12281F] text-[#B8F55C] hover:bg-[#1C3B2E] text-xs font-bold transition-all shadow-xs border border-[#234235]"
            >
              <div className="w-5 h-5 rounded-full bg-[#B8F55C] text-[#12281F] flex items-center justify-center text-[10px] font-black">
                {(user.user_metadata?.full_name || user.email || "U")
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <span className="max-w-[120px] truncate">
                {user.user_metadata?.full_name || t("nav.profile")}
              </span>
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-xs font-bold text-[#3D5247] hover:text-[#11231B] px-3.5 py-2 transition-colors"
              >
                {t("nav.login")}
              </Link>
              <Link
                href="/signup"
                className="inline-flex items-center justify-center px-5 py-2 rounded-full bg-[#12281F] text-[#B8F55C] hover:bg-[#1C3B2E] text-xs font-bold transition-all shadow-xs active:scale-98 border border-[#234235]"
              >
                {t("nav.signup")}
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center gap-2">
          {/* Quick Mobile Language Switcher */}
          <button
            type="button"
            onClick={toggleLanguage}
            className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#EBF1EB] border border-[#CFE2D3] text-xs font-bold text-[#184530]"
          >
            <span>{language === "id" ? "🇮🇩 ID" : "🇬🇧 EN"}</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl text-[#12281F] hover:bg-[#EBF1EB] transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white/95 backdrop-blur-xl border-b border-[#DEE7DF] px-6 py-6 space-y-4 animate-in slide-in-from-top-4 duration-200">
          <nav className="flex flex-col space-y-3 font-semibold text-sm text-[#3D5247]">
            <a
              href="/#omnichannel"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#11231B]"
            >
              Omnichannel Messaging (WhatsApp, Telegram)
            </a>
            <a
              href="/#privacy"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#11231B] text-[#184530] font-bold"
            >
              {t("nav.data_privacy")} (Local-First)
            </a>
            <a
              href="/#features"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#11231B]"
            >
              {t("nav.solutions")}
            </a>
            <a
              href="/#pricing"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#11231B]"
            >
              {t("nav.pricing")}
            </a>
            <a
              href="/#download"
              onClick={() => setMobileMenuOpen(false)}
              className="py-1.5 hover:text-[#11231B] text-[#184530] font-bold"
            >
              {t("nav.download")}
            </a>
          </nav>

          <div className="pt-4 border-t border-[#DEE7DF] flex flex-col gap-2.5">
            {user ? (
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center py-2.5 rounded-full bg-[#12281F] text-[#B8F55C] font-bold text-xs shadow-xs"
              >
                {t("nav.profile")}
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full border border-[#DEE7DF] font-bold text-xs text-[#11231B]"
                >
                  {t("nav.login")}
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-2.5 rounded-full bg-[#12281F] text-[#B8F55C] font-bold text-xs shadow-xs"
                >
                  {t("nav.signup")}
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
