"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { AsKingLogo } from "@/app/components/Navbar";
import {
  ShieldCheck,
  Mail,
  ArrowRight,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Lock,
  Inbox,
  Sparkles,
} from "lucide-react";

export default function OperatorLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email"); // 'email' | 'link_sent'

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
          .catch(() => {});
      }
    });
  }, [router]);

  // Request Magic Login Link for Whitelisted Operator
  const handleRequestLoginLink = async (e) => {
    if (e && e.preventDefault) e.preventDefault();
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

      // 2. Dispatch Magic Link via Supabase Auth directly redirecting to /operator
      const supabase = createClient();
      const redirectUrl = `${window.location.origin}/auth/callback?next=/operator`;

      const { error: linkError } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          emailRedirectTo: redirectUrl,
          shouldCreateUser: false,
        },
      });

      if (linkError) {
        // If user record doesn't exist in auth yet, allow signInWithOtp to initialize
        const { error: retryError } = await supabase.auth.signInWithOtp({
          email: cleanEmail,
          options: {
            emailRedirectTo: redirectUrl,
            shouldCreateUser: true,
          },
        });
        if (retryError) throw retryError;
      }

      // Store operator email in localStorage for fast lookup
      if (typeof window !== "undefined") {
        localStorage.setItem("asking_operator_email", cleanEmail);
      }

      setSuccessMsg(
        `Tautan masuk aman telah dikirimkan ke ${cleanEmail}. Silakan periksa inbox email Anda.`
      );
      setStep("link_sent");
      startCooldown();
    } catch (err) {
      console.error("Operator login link error:", err);
      setError(err.message || "Gagal mengirimkan tautan masuk operator.");
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
              <div className="w-14 h-14 rounded-2xl bg-[#E5EFE7] border border-[#CFE2D3] text-[#184530] flex items-center justify-center mx-auto shadow-2xs">
                {step === "email" ? (
                  <Lock className="w-6 h-6 text-[#184530]" />
                ) : (
                  <Inbox className="w-7 h-7 text-[#184530]" />
                )}
              </div>

              <h1 className="text-2xl sm:text-3xl font-black text-[#11231B] tracking-tight pt-1">
                {step === "email" ? "Login Operator" : "Tautan Masuk Terkirim"}
              </h1>
              <p className="text-xs text-[#556A60] leading-relaxed max-w-xs mx-auto">
                {step === "email"
                  ? "Sistem autentikasi tanpa password. Masukkan email operator yang terdaftar di database."
                  : `Tautan akses aman telah dikirim ke ${email}. Klik tautan di email Anda untuk masuk.`}
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
            {successMsg && step === "email" && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-start gap-2.5 animate-in slide-in-from-top-2 duration-150">
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5 text-emerald-600" />
                <span className="leading-relaxed font-medium">{successMsg}</span>
              </div>
            )}

            {/* STEP 1: EMAIL INPUT */}
            {step === "email" ? (
              <form onSubmit={handleRequestLoginLink} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-[#2D3E35]">
                    Email Operator Terdaftar
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8075]" />
                    <input
                      type="email"
                      required
                      placeholder="operator@godiscus.com"
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
                      <span>Kirim Tautan Akses Masuk</span>
                      <ArrowRight className="w-4 h-4 text-[#B8F55C]" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* STEP 2: LINK SENT STATE */
              <div className="space-y-5 animate-in fade-in duration-200">
                {/* Target Email Box */}
                <div className="flex items-center justify-between p-3.5 rounded-2xl bg-[#F0F5F1] border border-[#DEE7DF]">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-white text-[#184530] flex items-center justify-center shadow-2xs shrink-0">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-[10px] uppercase font-bold text-[#6B8075] tracking-wider">
                        Email Penerima
                      </span>
                      <span className="block text-xs font-mono font-bold text-[#11231B] truncate">
                        {email}
                      </span>
                    </div>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10.5px] font-bold shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>Terkirim</span>
                  </span>
                </div>

                {/* Instructions Box */}
                <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2.5 text-left">
                  <p className="text-xs font-bold text-[#11231B]">
                    Langkah Masuk Portal:
                  </p>
                  <div className="space-y-2 text-xs text-[#4A5F54]">
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#12281F] text-[#B8F55C] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        1
                      </span>
                      <span className="leading-relaxed">
                        Buka kotak masuk (inbox) atau folder spam email Anda.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#12281F] text-[#B8F55C] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        2
                      </span>
                      <span className="leading-relaxed">
                        Klik tombol atau tautan <strong>"Masuk ke Portal Operator"</strong>.
                      </span>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-[#12281F] text-[#B8F55C] text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        3
                      </span>
                      <span className="leading-relaxed">
                        Anda akan otomatis dialihkan langsung ke Dashboard Operator AsKing.
                      </span>
                    </div>
                  </div>
                </div>

                {/* Resend & Change Email Actions */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    onClick={handleRequestLoginLink}
                    disabled={resendCooldown > 0 || loading}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] disabled:opacity-50 text-[#B8F55C] text-xs font-bold shadow-md transition-all active:scale-98 cursor-pointer border border-[#234235]"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin text-[#B8F55C]" />
                        <span>Mengirim ulang...</span>
                      </>
                    ) : resendCooldown > 0 ? (
                      <span>Kirim Ulang Tautan ({resendCooldown}s)</span>
                    ) : (
                      <>
                        <span>Kirim Ulang Tautan Masuk</span>
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
                    className="w-full py-2 text-xs text-[#556A60] hover:text-[#11231B] transition-colors cursor-pointer text-center"
                  >
                    ← Gunakan Email Operator Lain
                  </button>
                </div>
              </div>
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
