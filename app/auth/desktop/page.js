"use client";

import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { AsKingLogo } from "@/app/components/Navbar";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
  Laptop,
  ArrowRight,
  ShieldCheck,
  Globe,
} from "lucide-react";

function DesktopAuthBridge() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t } = useTranslation();

  const [status, setStatus] = useState("checking"); // 'checking' | 'authorizing' | 'success' | 'unauthenticated' | 'error'
  const [user, setUser] = useState(null);
  const [deepLinkUrl, setDeepLinkUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState(null);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setStatus("error");
      setErrorMessage("Supabase is not configured yet in .env.local.");
      return;
    }

    const supabase = createClient();

    async function authorizeDesktop() {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error || !session || !session.user) {
          setStatus("unauthenticated");
          return;
        }

        const currentUser = session.user;
        setUser(currentUser);
        setStatus("authorizing");

        // Construct deep link URL to AsKing Desktop Application
        const params = new URLSearchParams({
          access_token: session.access_token,
          refresh_token: session.refresh_token,
          expires_at: String(session.expires_at || Date.now() + 3600 * 1000),
          user_id: currentUser.id,
          email: currentUser.email || "",
          full_name: currentUser.user_metadata?.full_name || currentUser.email || "",
        });

        const targetDeepLink = `asking://auth/callback?${params.toString()}`;
        setDeepLinkUrl(targetDeepLink);

        // Attempt automatic deep link trigger
        setTimeout(() => {
          window.location.href = targetDeepLink;
          setStatus("success");
        }, 800);
      } catch (err) {
        console.error("Desktop auth bridge error:", err);
        setStatus("error");
        setErrorMessage(err.message || "Failed to authorize desktop application.");
      }
    }

    authorizeDesktop();
  }, [router]);

  const handleManualOpen = () => {
    if (deepLinkUrl) {
      window.location.href = deepLinkUrl;
    }
  };

  const userName = user?.user_metadata?.full_name || user?.email || "User";

  return (
    <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl border border-[#DEE7DF] shadow-2xl p-8 sm:p-10 space-y-6 text-center animate-in zoom-in-95 duration-200">
      {/* Icon Badge */}
      <div className="w-16 h-16 mx-auto rounded-3xl bg-[#12281F] text-[#B8F55C] border border-[#234235] flex items-center justify-center shadow-lg">
        <Laptop className="w-8 h-8" />
      </div>

      {/* State 1: Checking Session / Authorizing */}
      {(status === "checking" || status === "authorizing") && (
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5EFE7] text-[#184530] text-xs font-bold border border-[#CFE2D3]">
            <Loader2 className="w-3.5 h-3.5 animate-spin text-[#184530]" />
            {t("auth.desktop_bridge_badge")}
          </span>
          <h1 className="text-2xl font-black text-[#11231B] tracking-tight">
            {t("auth.desktop_bridge_title")}
          </h1>
          <p className="text-xs text-[#556A60] leading-relaxed">
            {t("auth.desktop_bridge_desc")}
          </p>
        </div>
      )}

      {/* State 2: Success / Deep Link Dispatched */}
      {status === "success" && (
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 text-xs font-bold border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
            {t("auth.desktop_bridge_success")}
          </span>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-[#11231B] tracking-tight">
              {t("auth.desktop_ready_title")}
            </h1>
            <p className="text-xs text-[#556A60] leading-relaxed">
              {t("auth.desktop_ready_desc", { user: userName })}
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <button
              type="button"
              onClick={handleManualOpen}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer border border-[#234235]"
            >
              <span>{t("auth.open_desktop_btn")}</span>
              <ExternalLink className="w-4 h-4 text-[#B8F55C]" />
            </button>

            <Link
              href="/profile"
              className="block w-full py-2.5 rounded-full border border-[#DEE7DF] bg-white hover:bg-[#F8FAF7] text-xs font-bold text-[#4A5F54] hover:text-[#11231B] transition-colors"
            >
              {t("auth.go_to_profile")}
            </Link>
          </div>
        </div>
      )}

      {/* State 3: Unauthenticated (Must Login First) */}
      {status === "unauthenticated" && (
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
            <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
            {t("auth.login_required_badge")}
          </span>
          <div className="space-y-1.5">
            <h1 className="text-2xl font-black text-[#11231B] tracking-tight">
              {t("auth.login_required_title")}
            </h1>
            <p className="text-xs text-[#556A60] leading-relaxed">
              {t("auth.login_required_desc")}
            </p>
          </div>

          <div className="pt-2 space-y-2.5">
            <Link
              href="/login?next=/auth/desktop"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-bold shadow-md transition-all text-center border border-[#234235]"
            >
              <span>{t("auth.login_with_email_btn")}</span>
              <ArrowRight className="w-4 h-4 text-[#B8F55C]" />
            </Link>

            <Link
              href="/signup?next=/auth/desktop"
              className="block w-full py-2.5 rounded-full border border-[#DEE7DF] bg-white hover:bg-[#F8FAF7] text-xs font-bold text-[#11231B] transition-colors"
            >
              {t("auth.create_account_btn")}
            </Link>
          </div>
        </div>
      )}

      {/* State 4: Error */}
      {status === "error" && (
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 text-xs font-bold border border-rose-200">
            <AlertCircle className="w-3.5 h-3.5 text-rose-600" />
            Authorization Error
          </span>
          <div className="space-y-1.5">
            <h1 className="text-xl font-bold text-[#11231B]">
              {t("auth.connection_failed_title")}
            </h1>
            <p className="text-xs text-rose-600 leading-relaxed font-medium">
              {errorMessage || "Unable to authorize desktop app."}
            </p>
          </div>

          <div className="pt-2">
            <Link
              href="/login"
              className="block w-full py-3 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-bold shadow-md transition-all text-center border border-[#234235]"
            >
              {t("auth.back_to_login")}
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DesktopAuthPage() {
  const { t, language, toggleLanguage } = useTranslation();

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col justify-between hero-grid relative overflow-hidden text-[#11231B]">
      {/* Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-radial from-[#B8F55C]/20 via-[#B8F55C]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="max-w-7xl w-full mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="group flex items-center">
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

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EFE7] text-[#184530] text-xs font-bold border border-[#CFE2D3]">
            <Sparkles className="w-3.5 h-3.5 text-[#184530]" />
            <span>Desktop SSO Bridge</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-[#556A60]">
              <Loader2 className="w-6 h-6 animate-spin text-[#184530] mx-auto mb-2" />
              Preparing desktop connection...
            </div>
          }
        >
          <DesktopAuthBridge />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 sm:px-8 py-6 text-center text-xs text-[#6B8075]">
        &copy; {new Date().getFullYear()} {t("footer.copyright")}
      </footer>
    </div>
  );
}
