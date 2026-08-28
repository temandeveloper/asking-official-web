"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { AsKingLogo } from "../components/Navbar";
import ContactSupportModal from "../components/ContactSupportModal";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Globe,
  Check,
  Headphones,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";
  const { t, language } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendStatus, setResendStatus] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setCheckingSession(false);
      return;
    }

    const supabase = createClient();
    const nextUrl = searchParams.get("next") || "/profile";

    // Check if user already has an active session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push(nextUrl);
      } else {
        setCheckingSession(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "USER_UPDATED")) {
        router.push(nextUrl);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, searchParams]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setResendStatus(null);

    if (!email.trim() || !password) {
      setError("Please enter both email and password.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase credentials are not configured in `.env.local`. Please update NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY."
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { data, error: loginError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (loginError) {
        if (loginError.message.toLowerCase().includes("email not confirmed")) {
          setError(
            "Your email address is not verified yet. Please check your inbox and confirm your email before logging in."
          );
        } else {
          setError(loginError.message || "Invalid email or password.");
        }
        return;
      }

      if (data?.session) {
        const nextUrl = searchParams.get("next") || "/profile";
        router.push(nextUrl);
        router.refresh();
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    if (!email.trim()) {
      setError("Please enter your email to resend confirmation.");
      return;
    }
    try {
      const supabase = createClient();
      const { error: resendErr } = await supabase.auth.resend({
        type: "signup",
        email: email.trim(),
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });
      if (resendErr) throw resendErr;
      setResendStatus(t("auth.resend_success"));
    } catch (err) {
      setError(err.message || "Failed to resend confirmation email.");
    }
  };

  if (checkingSession) {
    return (
      <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl border border-[#DEE7DF] shadow-xl p-8 sm:p-10 text-center space-y-3">
        <Loader2 className="w-6 h-6 animate-spin text-[#184530] mx-auto" />
        <p className="text-xs text-[#556A60]">Checking active session...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md rounded-3xl bg-white/95 backdrop-blur-xl border border-[#DEE7DF] shadow-xl p-8 sm:p-10 space-y-6 animate-in fade-in duration-150">
      <div className="space-y-2 text-center">
        <h1 className="text-2xl sm:text-3xl font-black text-[#11231B] tracking-tight">
          {t("auth.login_title")}
        </h1>
        <p className="text-xs text-[#556A60] leading-relaxed">
          {t("auth.login_subtitle")}
        </p>
      </div>

      {/* Verified Banner if arriving from email confirmation */}
      {isVerified && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#22C55E]" />
          <div>
            <p className="font-bold">{t("auth.email_verified_title")}</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              {t("auth.email_verified_desc")}
            </p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs space-y-2 animate-in slide-in-from-top-2 duration-150">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span className="leading-relaxed font-medium">{error}</span>
          </div>
          {error.includes("not verified") && (
            <div className="pt-1 pl-6">
              <button
                type="button"
                onClick={handleResendConfirmation}
                className="font-bold underline text-rose-800 hover:text-rose-950 cursor-pointer"
              >
                {t("auth.resend_email_btn")} &rarr;
              </button>
            </div>
          )}
        </div>
      )}

      {/* Success Notification */}
      {resendStatus && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#22C55E]" />
          <span className="leading-relaxed font-medium">{resendStatus}</span>
        </div>
      )}

      <form onSubmit={handleLogin} className="space-y-4">
        {/* Email Address */}
        <div className="space-y-1">
          <label className="block text-xs font-bold text-[#2D3E35]">
            {t("auth.email_label")}
          </label>
          <div className="relative">
            <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8075]" />
            <input
              type="email"
              required
              placeholder={t("auth.email_placeholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F] transition-colors"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#2D3E35]">
              {t("auth.password_label")}
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8075]" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder={t("auth.password_placeholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F] transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B8075] hover:text-[#11231B] cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4" />
              ) : (
                <Eye className="w-4 h-4" />
              )}
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] disabled:opacity-50 text-[#B8F55C] text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer border border-[#234235] mt-2"
        >
          {loading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin text-[#B8F55C]" />
              <span>{t("auth.logging_in")}</span>
            </>
          ) : (
            <>
              <span>{t("auth.btn_login")}</span>
              <ArrowRight className="w-4 h-4 text-[#B8F55C]" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-[#556A60] space-y-2">
        <div>
          {t("auth.no_account_text")}{" "}
          <Link
            href="/signup"
            className="font-bold text-[#12281F] hover:underline"
          >
            {t("auth.start_free_trial")}
          </Link>
        </div>
      </div>

      <ContactSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        context="login"
        user={email ? { email } : null}
      />
    </div>
  );
}

export default function LoginPage() {
  const { t, language, toggleLanguage } = useTranslation();
  const [isGlobalSupportOpen, setIsGlobalSupportOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col justify-between hero-grid relative overflow-hidden text-[#11231B]">
      {/* Glow Orbs */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-radial from-[#B8F55C]/20 via-[#B8F55C]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header Bar */}
      <header className="max-w-7xl w-full mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="group flex items-center">
          <AsKingLogo className="w-9 h-9 group-hover:scale-105 transition-transform" />
        </Link>
        <div className="flex items-center gap-4 text-xs sm:text-sm font-medium text-[#4A5F54]">
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

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <Suspense
          fallback={
            <div className="p-8 text-center text-xs text-[#556A60]">
              <Loader2 className="w-6 h-6 animate-spin text-[#184530] mx-auto mb-2" />
              Loading authentication...
            </div>
          }
        >
          <LoginForm />
        </Suspense>
      </main>

      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsGlobalSupportOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#12281F] hover:bg-[#18362B] text-[#B8F55C] text-xs font-bold shadow-xl border border-[#2A5241] transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Headphones className="w-4 h-4 text-[#B8F55C]" />
          <span>{language === "en" ? "Need Help?" : "Butuh Bantuan?"}</span>
        </button>
      </div>

      <ContactSupportModal
        isOpen={isGlobalSupportOpen}
        onClose={() => setIsGlobalSupportOpen(false)}
        context="login"
      />

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 sm:px-8 py-6 text-center text-xs text-[#6B8075]">
        &copy; {new Date().getFullYear()} {t("footer.copyright")}
      </footer>
    </div>
  );
}
