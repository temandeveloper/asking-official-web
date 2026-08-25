"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { AsKingLogo } from "@/app/components/Navbar";
import {
  ShieldCheck,
  Mail,
  KeyRound,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Globe,
} from "lucide-react";

export default function OperatorLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [otpToken, setOtpToken] = useState("");
  const [step, setStep] = useState("email"); // 'email' | 'otp'

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [resendCooldown, setResendCooldown] = useState(0);

  // Check if operator already logged in
  useEffect(() => {
    if (!isSupabaseConfigured()) return;
    const supabase = createClient();

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user?.email) {
        // Verify whitelist dynamically from database
        fetch("/api/operator/check-whitelist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: session.user.email }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.authorized) {
              router.push("/operator");
            }
          })
          .catch(() => { });
      }
    });
  }, [router]);

  // Step 1: Request OTP Token for Whitelisted Operator
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setError("Silakan masukkan alamat email operator Anda.");
      return;
    }

    setLoading(true);
    try {
      // 1. Check Whitelist in Database via Server API (dynamically checks tb_operator)
      const whitelistRes = await fetch("/api/operator/check-whitelist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      const whitelistData = await whitelistRes.json();
      if (!whitelistRes.ok || !whitelistData.authorized) {
        setError(
          whitelistData.message ||
          "Akses ditolak: Email tidak memiliki otorisasi operator AsKing."
        );
        return;
      }

      // 2. Dispatch OTP via Supabase Auth
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          shouldCreateUser: false, // Only existing authorized users
        },
      });

      if (otpError) {
        // If user record doesn't exist in auth yet, allow signInWithOtp to initialize
        const { error: retryError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            shouldCreateUser: true,
          },
        });
        if (retryError) throw retryError;
      }

      setSuccessMsg(
        `Kode OTP rahasia telah dikirim ke ${cleanEmail}. Silakan periksa inbox email Anda.`
      );
      setStep("otp");
      startCooldown();
    } catch (err) {
      console.error("Operator OTP request error:", err);
      setError(err.message || "Gagal mengirimkan kode OTP operator.");
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP Token
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanToken = otpToken.trim();
    if (!cleanToken) {
      setError("Silakan masukkan kode OTP yang Anda terima di email.");
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email: email.trim().toLowerCase(),
        token: cleanToken,
        type: "email",
      });

      if (verifyError) throw verifyError;

      // Store operator email in localStorage for fast lookup
      if (typeof window !== "undefined") {
        localStorage.setItem("asking_operator_email", email.trim().toLowerCase());
      }

      setSuccessMsg("Verifikasi berhasil! Mengarahkan ke Dashboard Operator...");
      setTimeout(() => {
        router.push("/operator");
      }, 800);
    } catch (err) {
      console.error("OTP verification error:", err);
      setError(err.message || "Kode OTP tidak valid atau telah kadaluarsa.");
    } finally {
      setLoading(false);
    }
  };

  const startCooldown = () => {
    setResendCooldown(60);
    const interval = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#11231B] flex flex-col justify-between relative overflow-hidden select-none font-sans">
      {/* Background Radial Glow */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-radial from-[#B8F55C]/20 via-[#B8F55C]/5 to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header Bar */}
      <header className="max-w-7xl w-full mx-auto px-6 sm:px-8 py-6 flex items-center justify-between">
        <Link href="/" className="group flex items-center gap-3">
          <AsKingLogo className="w-9 h-9 group-hover:scale-105 transition-transform" />
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#E5EFE7] border border-[#CFE2D3] text-xs font-bold text-[#184530]">
          <ShieldCheck className="w-4 h-4 text-[#184530]" />
          <span>Internal Portal - Restricted Access</span>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 flex items-center justify-center px-6 py-10">
        <div className="w-full max-w-md">
          <div className="rounded-3xl bg-white/95 backdrop-blur-xl border border-[#DEE7DF] shadow-xl p-8 sm:p-10 space-y-6 animate-in fade-in duration-150">

            {/* Title & Badge */}
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-[#E5EFE7] border border-[#CFE2D3] text-[#184530] flex items-center justify-center mx-auto shadow-2xs">
                {step === "email" ? (
                  <Lock className="w-6 h-6 text-[#184530]" />
                ) : (
                  <KeyRound className="w-6 h-6 text-[#184530]" />
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#11231B] tracking-tight pt-1">
                {step === "email" ? "Login Operator" : "Verifikasi OTP"}
              </h1>
              <p className="text-xs text-[#556A60] leading-relaxed max-w-xs mx-auto">
                {step === "email"
                  ? "Sistem autentikasi tanpa password. Masukkan email operator yang terdaftar di database."
                  : `Masukkan kode OTP rahasia yang dikirimkan ke ${email}.`}
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-150">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-500" />
                <span className="leading-relaxed font-medium">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-150">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="leading-relaxed font-medium">{successMsg}</span>
              </div>
            )}

            {/* STEP 1: EMAIL INPUT */}
            {step === "email" ? (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2D3E35]">
                    Email Operator Terdaftar
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8075]" />
                    <input
                      type="email"
                      required
                      placeholder="Email Operator Terdaftar"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F] transition-colors font-mono"
                    />
                  </div>
                  <p className="text-[11px] text-[#6B8075]">
                    Hanya email yang telah terdaftar di tabel operator yang diizinkan masuk.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] disabled:opacity-50 text-[#B8F55C] text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer border border-[#234235] mt-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#B8F55C]" />
                      <span>Memverifikasi Database...</span>
                    </>
                  ) : (
                    <>
                      <span>Kirim Akses Login</span>
                      <ArrowRight className="w-4 h-4 text-[#B8F55C]" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: OTP INPUT */
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2D3E35]">
                    Kode OTP / Token
                  </label>
                  <div className="relative">
                    <KeyRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8075]" />
                    <input
                      type="text"
                      required
                      autoFocus
                      placeholder="123456"
                      value={otpToken}
                      onChange={(e) => setOtpToken(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#184530] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F] transition-colors font-mono tracking-widest text-center font-black"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-[#6B8075] pt-1">
                    <span>Masa berlaku: 10 menit</span>
                    <button
                      type="button"
                      onClick={handleRequestOtp}
                      disabled={resendCooldown > 0 || loading}
                      className="text-[#184530] font-bold hover:underline disabled:opacity-50 disabled:no-underline cursor-pointer"
                    >
                      {resendCooldown > 0
                        ? `Kirim ulang (${resendCooldown}s)`
                        : "Kirim Ulang OTP"}
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] disabled:opacity-50 text-[#B8F55C] text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer border border-[#234235]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#B8F55C]" />
                        <span>Memvalidasi OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Masuk ke Dashboard Operator</span>
                        <ArrowRight className="w-4 h-4 text-[#B8F55C]" />
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep("email");
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="w-full py-2 text-xs text-[#556A60] hover:text-[#11231B] transition-colors cursor-pointer"
                  >
                    ← Ganti Alamat Email
                  </button>
                </div>
              </form>
            )}

            {/* Back to Public Web */}
            <div className="pt-4 border-t border-[#EEF3EF] text-center">
              <Link
                href="/"
                className="text-xs text-[#556A60] hover:text-[#11231B] font-semibold transition-colors"
              >
                &larr; Kembali ke Website Utama AsKing
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 sm:px-8 py-6 text-center text-xs text-[#6B8075]">
        &copy; {new Date().getFullYear()} AsKing Customer Manager • Internal Operator Environment
      </footer>
    </div>
  );
}
