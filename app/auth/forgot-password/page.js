"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CheckCircle2, Globe, KeyRound, Loader2, Mail } from "lucide-react";
import { AsKingLogo } from "../../components/Navbar";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/LanguageContext";

export default function ForgotPasswordPage() {
  const { t, language, toggleLanguage } = useTranslation();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (!email.trim() || !email.includes("@")) {
      setError(t("auth.reset_email_invalid"));
      return;
    }

    if (!isSupabaseConfigured()) {
      setError(t("auth.auth_unavailable"));
      return;
    }

    setLoading(true);
    try {
      const { error: resetError } = await createClient().auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/auth/callback?next=/auth/reset-password`,
      });

      if (resetError) throw resetError;
      setSent(true);
    } catch (requestError) {
      console.error("Password reset request failed", requestError);
      setError(t("auth.reset_request_failed"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="hero-grid relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#F8FAF7] text-[#11231B]">
      <div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-87.5 w-150 -translate-x-1/2 bg-radial from-[#B8F55C]/20 via-[#B8F55C]/5 to-transparent blur-3xl" />
      <header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8">
        <Link href="/" className="group flex items-center">
          <AsKingLogo className="h-9 w-9 transition-transform group-hover:scale-105" />
        </Link>
        <button type="button" onClick={toggleLanguage} className="flex items-center gap-1.5 rounded-full border border-[#CFE2D3] bg-[#EBF1EB] px-3 py-1.5 text-xs font-bold text-[#184530] shadow-2xs transition-all hover:bg-[#DDE7DE]">
          <Globe className="h-3.5 w-3.5" />
          <span>{language === "id" ? "ID" : "EN"}</span>
        </button>
      </header>

      <main className="flex flex-1 items-center justify-center px-6 py-8">
        <div className="w-full max-w-md space-y-6 rounded-3xl border border-[#DEE7DF] bg-white/95 p-8 shadow-xl backdrop-blur-xl sm:p-10">
          {sent ? (
            <div className="space-y-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-black tracking-tight text-[#11231B]">{t("auth.reset_email_sent_title")}</h1>
                <p className="text-xs leading-relaxed text-[#556A60]">{t("auth.reset_email_sent_desc")}</p>
              </div>
              <Link href="/login" className="inline-flex items-center gap-2 text-xs font-bold text-[#184530] hover:underline">
                <ArrowLeft className="h-4 w-4" />
                {t("auth.back_to_login")}
              </Link>
            </div>
          ) : (
            <>
              <div className="space-y-2 text-center">
                <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E5EFE7] text-[#184530]">
                  <KeyRound className="h-5 w-5" />
                </div>
                <h1 className="pt-2 text-2xl font-black tracking-tight text-[#11231B]">{t("auth.forgot_password_title")}</h1>
                <p className="text-xs leading-relaxed text-[#556A60]">{t("auth.forgot_password_desc")}</p>
              </div>
              {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium leading-relaxed text-rose-700">{error}</p>}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2D3E35]">{t("auth.email_label")}</label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B8075]" />
                    <input type="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder={t("auth.email_placeholder")} className="w-full rounded-xl border border-[#DEE7DF] bg-[#F8FAF7] py-2.5 pl-10 pr-4 text-xs text-[#11231B] placeholder-[#8EA096] focus:border-[#12281F] focus:outline-none" />
                  </div>
                </div>
                <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full border border-[#234235] bg-[#12281F] px-4 py-3 text-xs font-bold text-[#B8F55C] shadow-md transition-all hover:bg-[#1C3B2E] disabled:opacity-50">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                  <span>{loading ? t("auth.reset_sending") : t("auth.send_reset_link")}</span>
                  {!loading && <ArrowRight className="h-4 w-4" />}
                </button>
              </form>
              <div className="text-center">
                <Link href="/login" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#184530] hover:underline">
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t("auth.back_to_login")}
                </Link>
              </div>
            </>
          )}
        </div>
      </main>
      <footer className="mx-auto w-full max-w-7xl px-6 py-6 text-center text-xs text-[#6B8075] sm:px-8">&copy; {new Date().getFullYear()} {t("footer.copyright")}</footer>
    </div>
  );
}