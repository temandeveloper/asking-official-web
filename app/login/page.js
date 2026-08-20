"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ClauseLogo } from "../components/Navbar";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVerified = searchParams.get("verified") === "true";
  const callbackError = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [resendStatus, setResendStatus] = useState(null);
  const [checkingSession, setCheckingSession] = useState(true);

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setCheckingSession(false);
      return;
    }

    const supabase = createClient();

    // Check if user already has an active session from email verification redirect
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        router.push("/profile");
      } else {
        setCheckingSession(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session && (event === "SIGNED_IN" || event === "USER_UPDATED")) {
        router.push("/profile");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

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
        router.push("/profile");
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
      setResendStatus("Verification email resent! Please check your inbox.");
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
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EFE7] text-[#184530] text-xs font-bold border border-[#CFE2D3]">
          <span>🔐 Secure Member Access</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-[#11231B] tracking-tight">
          Welcome back
        </h1>
        <p className="text-xs text-[#556A60]">
          Log in to manage contracts, analytics, and integrations.
        </p>
      </div>

      {/* Verified Banner if arriving from email confirmation */}
      {isVerified && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-150">
          <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-[#22C55E]" />
          <div>
            <p className="font-bold">Email Verified Successfully!</p>
            <p className="text-[11px] text-emerald-700 mt-0.5">
              Your email has been confirmed. Please enter your credentials below to log in.
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
                Resend verification email &rarr;
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
            Email Address
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
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#2D3E35]">
              Password
            </label>
          </div>
          <div className="relative">
            <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8075]" />
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
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
              <span>Signing in...</span>
            </>
          ) : (
            <>
              <span>Log In</span>
              <ArrowRight className="w-4 h-4 text-[#B8F55C]" />
            </>
          )}
        </button>
      </form>

      <div className="pt-2 text-center text-xs text-[#556A60]">
        Don&apos;t have an account yet?{" "}
        <Link
          href="/signup"
          className="font-bold text-[#12281F] hover:underline"
        >
          Start free trial
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="font-bold text-[#12281F] hover:underline ml-1"
          >
            Sign up
          </Link>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <Suspense fallback={
          <div className="p-8 text-center text-xs text-[#556A60]">
            <Loader2 className="w-6 h-6 animate-spin text-[#184530] mx-auto mb-2" />
            Loading authentication...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 sm:px-8 py-6 text-center text-xs text-[#6B8075]">
        &copy; {new Date().getFullYear()} Clause Inc. All rights reserved.
      </footer>
    </div>
  );
}
