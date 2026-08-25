"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { AsKingLogo } from "../components/Navbar";
import ContactSupportModal from "../components/ContactSupportModal";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import {
  User,
  Mail,
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Inbox,
  Globe,
  Headphones,
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const { t, language, toggleLanguage } = useTranslation();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [signupSuccess, setSignupSuccess] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!fullName.trim()) {
      setError(language === "id" ? "Silakan masukkan nama lengkap Anda." : "Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError(language === "id" ? "Silakan masukkan alamat email yang valid." : "Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError(language === "id" ? "Kata sandi minimal 6 karakter." : "Password must be at least 6 characters long.");
      return;
    }
    if (password !== repeatPassword) {
      setError(language === "id" ? "Konfirmasi kata sandi tidak cocok." : "Passwords do not match. Please re-enter.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase credentials are not configured yet in `.env.local`."
      );
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback`;

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          data: {
            full_name: fullName.trim(),
          },
          emailRedirectTo: redirectUrl,
        },
      });

      if (signUpError) {
        throw signUpError;
      }

      // Check if user already exists
      if (data?.user?.identities?.length === 0) {
        setError(
          language === "id"
            ? "Akun dengan email ini sudah terdaftar. Silakan masuk."
            : "An account with this email address already exists. Please log in."
        );
      } else {
        setSignupSuccess(true);
      }
    } catch (err) {
      setError(err.message || (language === "id" ? "Gagal membuat akun." : "Failed to create account."));
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (resendCooldown > 0 || !email) return;
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
      setResendCooldown(60);
      const timer = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (err) {
      setError(err.message || "Failed to resend confirmation email.");
    }
  };

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
        <div className="w-full max-w-md">
          {signupSuccess ? (
            /* EMAIL VERIFICATION SENT STATE */
            <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-[#DEE7DF] shadow-xl p-8 sm:p-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-[#E5EFE7] text-[#184530] border border-[#CFE2D3] flex items-center justify-center shadow-xs">
                <Inbox className="w-8 h-8 text-[#184530]" />
              </div>

              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5EFE7] text-[#184530] text-xs font-bold border border-[#CFE2D3]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#22C55E]" />
                  <span>{t("auth.email_verified_title")}</span>
                </span>
                <h1 className="text-2xl font-black text-[#11231B] tracking-tight">
                  {t("auth.verification_sent_title")}
                </h1>
                <p className="text-xs text-[#556A60] leading-relaxed">
                  {t("auth.verification_sent_desc", { email })}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] text-left space-y-2 text-xs text-[#4A5F54]">
                <p className="font-bold text-[#11231B] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#184530]" /> {t("auth.next_steps_title")}
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                  <li>{t("auth.next_step_1")}</li>
                  <li>{t("auth.next_step_2")}</li>
                  <li>{t("auth.next_step_3")}</li>
                </ol>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  type="button"
                  onClick={handleResendEmail}
                  disabled={resendCooldown > 0}
                  className="w-full py-3 rounded-full border border-[#DEE7DF] bg-white hover:bg-[#F2F7F3] disabled:opacity-50 text-xs font-bold text-[#11231B] transition-all cursor-pointer shadow-xs"
                >
                  {resendCooldown > 0
                    ? t("auth.resend_cooldown", { seconds: resendCooldown })
                    : t("auth.resend_email_btn")}
                </button>

                <button
                  type="button"
                  onClick={() => setIsSupportModalOpen(true)}
                  className="w-full py-2.5 px-4 rounded-full bg-[#E5EFE7] hover:bg-[#D5E6D8] text-[#184530] text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Headphones className="w-3.5 h-3.5 text-[#184530]" />
                  <span>
                    {language === "en"
                      ? "Email not received? Contact Support"
                      : "Email tidak masuk? Hubungi Support"}
                  </span>
                </button>

                <Link
                  href="/login"
                  className="block w-full py-3 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-bold shadow-sm transition-all text-center border border-[#234235]"
                >
                  {t("auth.back_to_login")}
                </Link>
              </div>
            </div>
          ) : (
            /* SIGNUP FORM */
            <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-[#DEE7DF] shadow-xl p-8 sm:p-10 space-y-6 animate-in fade-in duration-150">
              <div className="space-y-2 text-center">
                <h1 className="text-2xl sm:text-3xl font-black text-[#11231B] tracking-tight">
                  {t("auth.signup_title")}
                </h1>
                <p className="text-xs text-[#556A60]">
                  {t("auth.signup_subtitle")}
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-150">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span className="leading-relaxed font-medium">{error}</span>
                </div>
              )}

              <form onSubmit={handleSignup} className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2D3E35]">
                    {t("auth.full_name_label")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8075]" />
                    <input
                      type="text"
                      required
                      placeholder={t("auth.full_name_placeholder")}
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F] transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2D3E35]">
                    {t("auth.email_label")} <span className="text-rose-500">*</span>
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
                  <label className="block text-xs font-bold text-[#2D3E35]">
                    {t("auth.password_label")} <span className="text-rose-500">*</span>
                  </label>
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
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B8075] hover:text-[#11231B]"
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Repeat Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2D3E35]">
                    {t("auth.repeat_password_label")} <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8075]" />
                    <input
                      type={showRepeatPassword ? "text" : "password"}
                      required
                      placeholder={t("auth.repeat_password_placeholder")}
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F] transition-colors"
                    />
                    <button
                      type="button"
                      onClick={() => setShowRepeatPassword(!showRepeatPassword)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#6B8075] hover:text-[#11231B]"
                    >
                      {showRepeatPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Terms disclaimer */}
                <p className="text-[11px] text-[#6B8075] leading-relaxed pt-1">
                  {t("auth.terms_agree_prefix")}{" "}
                  <Link href="/term" className="underline font-semibold text-[#11231B]">
                    {t("auth.terms_link")}
                  </Link>{" "}
                  {t("auth.and_word")}{" "}
                  <Link href="/privacy" className="underline font-semibold text-[#11231B]">
                    {t("auth.privacy_link")}
                  </Link>.
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] disabled:opacity-50 text-[#B8F55C] text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer border border-[#234235] mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#B8F55C]" />
                      <span>{t("auth.creating_account")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("auth.btn_signup")}</span>
                      <ArrowRight className="w-4 h-4 text-[#B8F55C]" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-[#556A60] space-y-2">
                <div>
                  {t("auth.have_account_text")}{" "}
                  <Link
                    href="/login"
                    className="font-bold text-[#12281F] hover:underline"
                  >
                    {t("auth.sign_in_link")}
                  </Link>
                </div>

                <div className="pt-1 border-t border-[#EBF1EB]">
                  <button
                    type="button"
                    onClick={() => setIsSupportModalOpen(true)}
                    className="inline-flex items-center gap-1.5 text-xs text-[#4A5F54] hover:text-[#184530] font-semibold transition-colors cursor-pointer"
                  >
                    <Headphones className="w-3.5 h-3.5 text-[#184530]" />
                    <span>
                      {language === "en"
                        ? "Need help with registration? Contact Support"
                        : "Butuh bantuan mendaftar? Hubungi Tim Support"}
                    </span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Floating Support Button */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setIsSupportModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#12281F] hover:bg-[#18362B] text-[#B8F55C] text-xs font-bold shadow-xl border border-[#2A5241] transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Headphones className="w-4 h-4 text-[#B8F55C]" />
          <span>{language === "en" ? "Need Help?" : "Butuh Bantuan?"}</span>
        </button>
      </div>

      <ContactSupportModal
        isOpen={isSupportModalOpen}
        onClose={() => setIsSupportModalOpen(false)}
        context="signup"
        user={email ? { email, user_metadata: { full_name: fullName } } : null}
      />

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 sm:px-8 py-6 text-center text-xs text-[#6B8075]">
        &copy; {new Date().getFullYear()} {t("footer.copyright")}
      </footer>
    </div>
  );
}
