"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ClauseLogo } from "../components/Navbar";
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
} from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
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

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(null);

    // Validation
    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }
    if (password !== repeatPassword) {
      setError("Passwords do not match. Please re-enter.");
      return;
    }

    if (!isSupabaseConfigured()) {
      setError(
        "Supabase credentials are not configured yet in `.env.local`. Please update NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to enable live authentication."
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

      // Check if user is immediately confirmed or requires email verification
      if (data?.user?.identities?.length === 0) {
        setError("An account with this email address already exists. Please log in.");
      } else {
        setSignupSuccess(true);
      }
    } catch (err) {
      setError(err.message || "Failed to create account. Please try again.");
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
          <ClauseLogo className="w-9 h-9 group-hover:scale-105 transition-transform" />
        </Link>
        <div className="text-xs sm:text-sm font-medium text-[#4A5F54]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-[#12281F] hover:underline ml-1"
          >
            Log in
          </Link>
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
                  Confirmation Email Sent
                </span>
                <h1 className="text-2xl font-black text-[#11231B] tracking-tight">
                  Verify your email
                </h1>
                <p className="text-xs text-[#556A60] leading-relaxed">
                  We sent a verification link to{" "}
                  <strong className="text-[#11231B] font-semibold">{email}</strong>.
                  Please click the link in your email to activate your account.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] text-left space-y-2 text-xs text-[#4A5F54]">
                <p className="font-bold text-[#11231B] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#184530]" /> Next steps:
                </p>
                <ol className="list-decimal list-inside space-y-1 text-[11px] leading-relaxed">
                  <li>Check your inbox (or spam folder)</li>
                  <li>Click on the confirmation button</li>
                  <li>You will be redirected straight to your Profile</li>
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
                    ? `Resend available in ${resendCooldown}s`
                    : "Resend confirmation email"}
                </button>

                <Link
                  href="/login"
                  className="block w-full py-3 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-bold shadow-sm transition-all text-center border border-[#234235]"
                >
                  Back to Login
                </Link>
              </div>
            </div>
          ) : (
            /* SIGNUP FORM */
            <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-[#DEE7DF] shadow-xl p-8 sm:p-10 space-y-6 animate-in fade-in duration-150">
              <div className="space-y-2 text-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EFE7] text-[#184530] text-xs font-bold border border-[#CFE2D3]">
                  <span>✨ Get started with Clause</span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black text-[#11231B] tracking-tight">
                  Create your account
                </h1>
                <p className="text-xs text-[#556A60]">
                  Streamline agreements and contracts in minutes.
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
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8075]" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Samantha Brooks"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F] transition-colors"
                    />
                  </div>
                </div>

                {/* Email Address */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2D3E35]">
                    Work Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8075]" />
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F] transition-colors"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2D3E35]">
                    Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8075]" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="Minimum 6 characters"
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
                    Repeat Password <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <ShieldCheck className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8075]" />
                    <input
                      type={showRepeatPassword ? "text" : "password"}
                      required
                      placeholder="Re-enter your password"
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
                  By creating an account, you agree to our Terms of Service and Privacy Policy.
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
                      <span>Creating account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Account</span>
                      <ArrowRight className="w-4 h-4 text-[#B8F55C]" />
                    </>
                  )}
                </button>
              </form>

              <div className="pt-2 text-center text-xs text-[#556A60]">
                Already registered?{" "}
                <Link
                  href="/login"
                  className="font-bold text-[#12281F] hover:underline"
                >
                  Sign in to your account
                </Link>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 sm:px-8 py-6 text-center text-xs text-[#6B8075]">
        &copy; {new Date().getFullYear()} Clause Inc. All rights reserved.
      </footer>
    </div>
  );
}
