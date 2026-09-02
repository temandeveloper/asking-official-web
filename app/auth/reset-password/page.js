"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Eye, EyeOff, Globe, KeyRound, Loader2, Lock } from "lucide-react";
import { AsKingLogo } from "../../components/Navbar";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { useTranslation } from "@/lib/i18n/LanguageContext";

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { t, language, toggleLanguage } = useTranslation();
  const [status, setStatus] = useState("checking");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (searchParams.get("error") === "expired" || !isSupabaseConfigured()) {
      setStatus("invalid");
      return;
    }

    let active = true;
    createClient().auth.getSession().then(({ data: { session } }) => {
      if (active) setStatus(session ? "ready" : "invalid");
    });

    return () => {
      active = false;
    };
  }, [searchParams]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (password.length < 6) {
      setError(t("auth.reset_password_too_short"));
      return;
    }
    if (password !== confirmation) {
      setError(t("auth.reset_password_mismatch"));
      return;
    }

    setLoading(true);
    try {
      const { error: updateError } = await createClient().auth.updateUser({ password });
      if (updateError) throw updateError;

      await createClient().auth.signOut();
      router.replace("/login?reset=true");
    } catch (updateError) {
      console.error("Password reset failed", updateError);
      setError(t("auth.reset_password_failed"));
    } finally {
      setLoading(false);
    }
  }

  const content = status === "checking" ? (
    <div className="space-y-3 py-6 text-center">
      <Loader2 className="mx-auto h-6 w-6 animate-spin text-[#184530]" />
      <p className="text-xs text-[#556A60]">{t("auth.reset_checking_link")}</p>
    </div>
  ) : status === "invalid" ? (
    <div className="space-y-5 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-50 text-rose-600"><KeyRound className="h-6 w-6" /></div>
      <div className="space-y-2"><h1 className="text-2xl font-black tracking-tight text-[#11231B]">{t("auth.reset_link_invalid_title")}</h1><p className="text-xs leading-relaxed text-[#556A60]">{t("auth.reset_link_invalid_desc")}</p></div>
      <Link href="/auth/forgot-password" className="inline-flex items-center gap-2 rounded-full bg-[#12281F] px-5 py-2.5 text-xs font-bold text-[#B8F55C] shadow-md hover:bg-[#1C3B2E]"><ArrowLeft className="h-4 w-4" />{t("auth.request_new_reset_link")}</Link>
    </div>
  ) : (
    <>
      <div className="space-y-2 text-center"><div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl bg-[#E5EFE7] text-[#184530]"><Lock className="h-5 w-5" /></div><h1 className="pt-2 text-2xl font-black tracking-tight text-[#11231B]">{t("auth.reset_password_title")}</h1><p className="text-xs leading-relaxed text-[#556A60]">{t("auth.reset_password_desc")}</p></div>
      {error && <p className="rounded-2xl border border-rose-200 bg-rose-50 p-3 text-xs font-medium leading-relaxed text-rose-700">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <PasswordInput label={t("auth.new_password_label")} placeholder={t("auth.new_password_placeholder")} value={password} onChange={setPassword} shown={showPassword} onToggle={() => setShowPassword(!showPassword)} />
        <PasswordInput label={t("auth.confirm_new_password_label")} placeholder={t("auth.confirm_new_password_placeholder")} value={confirmation} onChange={setConfirmation} shown={showConfirmation} onToggle={() => setShowConfirmation(!showConfirmation)} />
        <button type="submit" disabled={loading} className="flex w-full items-center justify-center gap-2 rounded-full border border-[#234235] bg-[#12281F] px-4 py-3 text-xs font-bold text-[#B8F55C] shadow-md transition-all hover:bg-[#1C3B2E] disabled:opacity-50">{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}<span>{loading ? t("auth.reset_updating") : t("auth.update_password_btn")}</span>{!loading && <ArrowRight className="h-4 w-4" />}</button>
      </form>
    </>
  );

  return (
    <div className="hero-grid relative flex min-h-screen flex-col justify-between overflow-hidden bg-[#F8FAF7] text-[#11231B]"><div className="pointer-events-none absolute left-1/2 top-10 -z-10 h-87.5 w-150 -translate-x-1/2 bg-radial from-[#B8F55C]/20 via-[#B8F55C]/5 to-transparent blur-3xl" /><header className="mx-auto flex w-full max-w-7xl items-center justify-between px-6 py-6 sm:px-8"><Link href="/" className="group flex items-center"><AsKingLogo className="h-9 w-9 transition-transform group-hover:scale-105" /></Link><button type="button" onClick={toggleLanguage} className="flex items-center gap-1.5 rounded-full border border-[#CFE2D3] bg-[#EBF1EB] px-3 py-1.5 text-xs font-bold text-[#184530] shadow-2xs transition-all hover:bg-[#DDE7DE]"><Globe className="h-3.5 w-3.5" /><span>{language === "id" ? "ID" : "EN"}</span></button></header><main className="flex flex-1 items-center justify-center px-6 py-8"><div className="w-full max-w-md space-y-6 rounded-3xl border border-[#DEE7DF] bg-white/95 p-8 shadow-xl backdrop-blur-xl sm:p-10">{content}</div></main><footer className="mx-auto w-full max-w-7xl px-6 py-6 text-center text-xs text-[#6B8075] sm:px-8">&copy; {new Date().getFullYear()} {t("footer.copyright")}</footer></div>
  );
}

function PasswordInput({ label, placeholder, value, onChange, shown, onToggle }) {
  return <div className="space-y-1"><label className="block text-xs font-bold text-[#2D3E35]">{label}</label><div className="relative"><Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6B8075]" /><input type={shown ? "text" : "password"} required value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-xl border border-[#DEE7DF] bg-[#F8FAF7] py-2.5 pl-10 pr-10 text-xs text-[#11231B] placeholder-[#8EA096] focus:border-[#12281F] focus:outline-none" /><button type="button" onClick={onToggle} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B8075] hover:text-[#11231B]">{shown ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>;
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center bg-[#F8FAF7]"><Loader2 className="h-6 w-6 animate-spin text-[#184530]" /></div>}>
      <ResetPasswordForm />
    </Suspense>
  );
}