"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { AsKingLogo } from "../components/Navbar";
import { useTranslation } from "@/lib/i18n/LanguageContext";
import { QRCodeSVG } from "qrcode.react";
import {
  User,
  Mail,
  ShieldCheck,
  Calendar,
  LogOut,
  CheckCircle2,
  KeyRound,
  Copy,
  Check,
  Loader2,
  AlertCircle,
  Sparkles,
  ArrowUpRight,
  Fingerprint,
  Globe,
  CreditCard,
  Zap,
  Clock,
  ExternalLink,
  ChevronDown,
  X,
  Building2,
  QrCode,
  Send,
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const { t, language, toggleLanguage } = useTranslation();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);

  // Billing / Payment state
  const [paymentData, setPaymentData] = useState(null);
  const [loadingPayment, setLoadingPayment] = useState(true);

  // Edit profile state
  const [fullName, setFullName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameUpdateMessage, setNameUpdateMessage] = useState(null);

  // Change password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  // Upgrade Modal State
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("pro"); // "pro" | "advance"
  const [paymentAccordion, setPaymentAccordion] = useState("bca"); // "bca" | "qris"
  const [copiedBca, setCopiedBca] = useState(false);
  const [showQrConfirmation, setShowQrConfirmation] = useState(false);

  useEffect(() => {
    async function loadUser() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
        setLoadingPayment(false);
        return;
      }

      try {
        const supabase = createClient();
        const {
          data: { user: currentUser },
          error,
        } = await supabase.auth.getUser();

        if (error || !currentUser) {
          router.push("/login");
          return;
        }

        setUser(currentUser);
        setFullName(currentUser.user_metadata?.full_name || "");

        // Fetch or initialize tb_payment
        try {
          const { data: payment, error: pError } = await supabase
            .from("tb_payment")
            .select("*")
            .eq("uid", currentUser.id)
            .maybeSingle();

          if (payment) {
            setPaymentData(payment);
          } else {
            // Auto initialize default Free Trial record
            const nowMs = Date.now();
            const expiredMs = nowMs + 15 * 24 * 60 * 60 * 1000;
            const newPayment = {
              uid: currentUser.id,
              jenis_plan: 0,
              note_plan: "free trial",
              datetime_payment: nowMs,
              datetime_expired: expiredMs,
              request_budget: 50,
              status: "active",
            };

            const { data: inserted } = await supabase
              .from("tb_payment")
              .insert(newPayment)
              .select()
              .maybeSingle();

            setPaymentData(inserted || newPayment);
          }
        } catch (payErr) {
          console.warn("Error fetching payment record:", payErr);
        }
      } catch (err) {
        console.error("Failed to load user profile:", err);
        router.push("/login");
      } finally {
        setLoading(false);
        setLoadingPayment(false);
      }
    }

    loadUser();
  }, [router]);

  const handleCopyId = () => {
    if (!user?.id) return;
    navigator.clipboard.writeText(user.id);
    setCopiedId(true);
    setTimeout(() => setCopiedId(false), 2000);
  };

  const handleCopyBca = () => {
    navigator.clipboard.writeText("2631261801");
    setCopiedBca(true);
    setTimeout(() => setCopiedBca(false), 2000);
  };

  const handleUpdateName = async (e) => {
    e.preventDefault();
    setNameUpdateMessage(null);
    if (!fullName.trim()) return;

    setIsUpdatingName(true);
    try {
      const supabase = createClient();
      const { data, error } = await supabase.auth.updateUser({
        data: { full_name: fullName.trim() },
      });

      if (error) throw error;
      setUser(data.user);
      setNameUpdateMessage({
        type: "success",
        text: t("profile.name_updated_success"),
      });
    } catch (err) {
      setNameUpdateMessage({
        type: "error",
        text: err.message || "Failed to update profile name.",
      });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({
        type: "error",
        text: language === "id" ? "Kata sandi minimal 6 karakter." : "New password must be at least 6 characters.",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({
        type: "error",
        text: language === "id" ? "Konfirmasi kata sandi tidak cocok." : "Passwords do not match.",
      });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      setPasswordMessage({
        type: "success",
        text: t("profile.password_updated_success"),
      });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMessage({
        type: "error",
        text: err.message || "Failed to change password.",
      });
    } finally {
      setIsUpdatingPassword(false);
    }
  };

  const handleSignOut = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAF7] flex flex-col items-center justify-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#184530]" />
        <p className="text-xs font-semibold text-[#556A60]">{t("profile.loading_profile")}</p>
      </div>
    );
  }

  if (!isSupabaseConfigured()) {
    return (
      <div className="min-h-screen bg-[#F8FAF7] p-8 flex flex-col items-center justify-center">
        <div className="max-w-lg w-full rounded-3xl bg-white border border-[#DEE7DF] p-8 shadow-xl space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-[#11231B]">Supabase Not Configured</h1>
          <p className="text-xs text-[#556A60] leading-relaxed">
            Please setup your <code className="px-1.5 py-0.5 rounded bg-[#EBF1EB] font-mono text-[#184530]">.env.local</code> file with your real Supabase URL and Anon Key to access the live profile.
          </p>
          <div className="pt-2 flex gap-3 justify-center">
            <Link
              href="/"
              className="px-5 py-2.5 rounded-full bg-[#12281F] text-[#B8F55C] text-xs font-bold shadow-xs hover:bg-[#1C3B2E]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const userInitial = (user?.user_metadata?.full_name || user?.email || "U")
    .charAt(0)
    .toUpperCase();

  const createdDate = user?.created_at
    ? new Date(user.created_at).toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "Recently";

  // Plan info calculation
  const planType = paymentData?.jenis_plan ?? 0;
  const isPro = planType === 1;
  const isAdvance = planType === 2;
  const planName = isAdvance
    ? t("profile.plan_advance_business")
    : isPro
      ? t("profile.plan_pro_business")
      : t("profile.plan_free_trial");

  const startMs = paymentData?.datetime_payment ? Number(paymentData.datetime_payment) : Date.now();
  const expiredMs = paymentData?.datetime_expired ? Number(paymentData.datetime_expired) : Date.now() + 15 * 24 * 60 * 60 * 1000;
  const nowMs = Date.now();
  const isExpired = nowMs > expiredMs;
  const daysRemaining = Math.max(0, Math.ceil((expiredMs - nowMs) / (1000 * 60 * 60 * 24)));

  const startDateFormatted = new Date(startMs).toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const expiredDateFormatted = new Date(expiredMs).toLocaleDateString(language === "id" ? "id-ID" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const requestBudget = paymentData?.request_budget ?? 50;

  // WhatsApp Message Payload & URL
  const whatsappNumber = "6287769005240";
  const selectedPlanTitle = selectedPlan === "pro" ? "Pro Business (1 Bulan)" : "Advance Business";
  const selectedPlanPrice = selectedPlan === "pro" ? "Rp 74.500 (Diskon 50% Promo Terbatas)" : "Coming Soon";
  const customerName = fullName || user?.user_metadata?.full_name || "User AsKing";
  const customerEmail = user?.email || "";
  const paymentDateStr = new Date().toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const whatsappMessage = `Halo Admin AsKing, saya telah melakukan pembayaran:

• Nama: ${customerName}
• Email: ${customerEmail}
• Paket: ${selectedPlanTitle}
• Harga: ${selectedPlanPrice}
• Metode: Transfer Bank BCA (2631261801 a.n. Ahmad Fadil)
• Tanggal: ${paymentDateStr}

Saya lampirkan bukti transfer pembayarannya (silakan cek lampiran gambar). Mohon untuk segera diverifikasi dan diaktifkan. Terima kasih!`;

  const whatsappUrl = `https://api.whatsapp.com/send/?phone=${whatsappNumber}&text=${encodeURIComponent(
    whatsappMessage
  )}&type=phone_number&app_absent=0`;

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col justify-between text-[#11231B]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#DEE7DF]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center">
              <AsKingLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
            </Link>
          </div>

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

            <Link
              href="/"
              className="hidden sm:inline-flex text-xs font-semibold text-[#4A5F54] hover:text-[#11231B] px-3 py-2 transition-colors"
            >
              {t("profile.view_landing")}
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t("profile.sign_out")}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Profile Content */}
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 sm:px-8 py-10 space-y-8">
        {/* User Hero Banner Card */}
        <div className="rounded-3xl bg-white border border-[#DEE7DF] p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            {/* Avatar Pill */}
            <div className="w-20 h-20 rounded-3xl bg-[#12281F] text-[#B8F55C] text-2xl font-extrabold flex items-center justify-center shadow-lg border border-[#234235] shrink-0">
              {userInitial}
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-black text-[#11231B] tracking-tight">
                  {user?.user_metadata?.full_name || "User Account"}
                </h1>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 font-bold text-[11px]">
                  <CheckCircle2 className="w-3 h-3 text-[#22C55E]" />
                  <span>{t("profile.verified_badge")}</span>
                </span>
              </div>

              <p className="text-xs text-[#556A60] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#6B8075]" />
                {user?.email}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-[#8EA096] pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {t("profile.member_since", { date: createdDate })}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Fingerprint className="w-3 h-3" />
                  {t("profile.user_id")}: {user?.id?.slice(0, 8)}...
                  <button
                    type="button"
                    onClick={handleCopyId}
                    className="p-0.5 hover:text-[#11231B] cursor-pointer"
                    title="Copy full User ID"
                  >
                    {copiedId ? (
                      <Check className="w-3 h-3 text-[#22C55E]" />
                    ) : (
                      <Copy className="w-3 h-3" />
                    )}
                  </button>
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 self-stretch sm:self-auto">
            <Link
              href="/#features"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-full bg-[#12281F] text-[#B8F55C] hover:bg-[#1C3B2E] text-xs font-bold transition-all shadow-xs"
            >
              <span>{t("profile.explore_features")}</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SECTION: STATUS BILLING & SUBSCRIPTION */}
        {/* ========================================================================= */}
        <div className="rounded-3xl bg-white border border-[#DEE7DF] p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#EEF3EF] pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#12281F] text-[#B8F55C] flex items-center justify-center shadow-xs">
                <CreditCard className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-[#11231B]">
                  {t("profile.billing_title")}
                </h2>
                <p className="text-xs text-[#556A60]">
                  {t("profile.billing_desc")}
                </p>
              </div>
            </div>

            {/* Action Button to Open Upgrade Modal */}
            <button
              type="button"
              onClick={() => {
                setShowQrConfirmation(false);
                setIsUpgradeModalOpen(true);
              }}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-[#184530] hover:bg-[#12281F] text-[#B8F55C] text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer shrink-0"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#B8F55C]" />
              <span>{isPro ? t("profile.renew_plan_btn") : t("profile.upgrade_plan_btn")}</span>
            </button>
          </div>

          {/* Billing Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Card 1: Active Plan */}
            <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2">
              <span className="text-[11px] font-semibold text-[#6B8075] uppercase tracking-wider block">
                Paket Aktif
              </span>
              <div className="flex items-center justify-between">
                <span className="text-base font-black text-[#11231B]">
                  {planName}
                </span>
              </div>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100/80 text-emerald-800 border border-emerald-200">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                {isExpired ? t("profile.plan_status_expired") : t("profile.plan_status_active")}
              </span>
            </div>

            {/* Card 2: AI Request Budget */}
            <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2">
              <span className="text-[11px] font-semibold text-[#6B8075] uppercase tracking-wider block">
                {t("profile.plan_ai_budget")}
              </span>
              <div className="text-base font-black text-[#11231B] flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-600" />
                <span>{requestBudget} Requests</span>
              </div>
              <span className="text-[10px] text-[#556A60] block leading-tight">
                {t("profile.plan_ai_budget_desc")}
              </span>
            </div>

            {/* Card 3: Activated Date */}
            <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2">
              <span className="text-[11px] font-semibold text-[#6B8075] uppercase tracking-wider block">
                {t("profile.plan_started")}
              </span>
              <div className="text-sm font-bold text-[#11231B] flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#6B8075]" />
                <span>{startDateFormatted}</span>
              </div>
              <span className="text-[10px] text-[#8FA599] block">
                1 Akun Desktop
              </span>
            </div>

            {/* Card 4: Expiration Date & Remaining Days */}
            <div className="p-4 rounded-2xl bg-[#F8FAF7] border border-[#DEE7DF] space-y-2">
              <span className="text-[11px] font-semibold text-[#6B8075] uppercase tracking-wider block">
                {t("profile.plan_expires")}
              </span>
              <div className="text-sm font-bold text-[#11231B] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-purple-600" />
                <span>{expiredDateFormatted}</span>
              </div>
              <span
                className={`inline-flex items-center text-[10px] font-bold px-2 py-0.5 rounded-full ${isExpired
                  ? "bg-rose-100 text-rose-700"
                  : "bg-purple-100 text-purple-800"
                  }`}
              >
                {isExpired
                  ? t("profile.plan_expired_badge")
                  : t("profile.plan_remaining_days", { days: daysRemaining })}
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Column 1: Personal Information */}
          <div className="rounded-3xl bg-white border border-[#DEE7DF] p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-[#EEF3EF] pb-4">
              <div className="w-8 h-8 rounded-xl bg-[#E5EFE7] text-[#184530] flex items-center justify-center">
                <User className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#11231B]">{t("profile.personal_info_title")}</h3>
                <p className="text-xs text-[#556A60]">{t("profile.personal_info_desc")}</p>
              </div>
            </div>

            {nameUpdateMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${nameUpdateMessage.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border border-rose-200 text-rose-700"
                  }`}
              >
                {nameUpdateMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )}
                <span>{nameUpdateMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleUpdateName} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2D3E35]">
                  {t("profile.full_name_label")}
                </label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2D3E35]">
                  {t("profile.email_label")}
                </label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F0F4F1] border border-[#DEE7DF] text-[#6B8075] cursor-not-allowed"
                />
                <p className="text-[10.5px] text-[#8EA096]">
                  {t("profile.email_note")}
                </p>
              </div>

              <button
                type="submit"
                disabled={isUpdatingName}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isUpdatingName ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t("profile.saving")}</span>
                  </>
                ) : (
                  <span>{t("profile.save_changes")}</span>
                )}
              </button>
            </form>
          </div>

          {/* Column 2: Security & Password */}
          <div className="rounded-3xl bg-white border border-[#DEE7DF] p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center gap-2.5 border-b border-[#EEF3EF] pb-4">
              <div className="w-8 h-8 rounded-xl bg-[#E5EFE7] text-[#184530] flex items-center justify-center">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-[#11231B]">{t("profile.security_title")}</h3>
                <p className="text-xs text-[#556A60]">{t("profile.security_desc")}</p>
              </div>
            </div>

            {passwordMessage && (
              <div
                className={`p-3 rounded-xl text-xs flex items-center gap-2 ${passwordMessage.type === "success"
                  ? "bg-emerald-50 border border-emerald-200 text-emerald-800"
                  : "bg-rose-50 border border-rose-200 text-rose-700"
                  }`}
              >
                {passwordMessage.type === "success" ? (
                  <CheckCircle2 className="w-4 h-4 text-[#22C55E]" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-500" />
                )}
                <span>{passwordMessage.text}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2D3E35]">
                  {t("profile.new_password")}
                </label>
                <input
                  type="password"
                  required
                  placeholder={t("profile.new_password_placeholder")}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2D3E35]">
                  {t("profile.confirm_new_password")}
                </label>
                <input
                  type="password"
                  required
                  placeholder={t("profile.confirm_password_placeholder")}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F]"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingPassword}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-xs font-bold transition-all shadow-xs active:scale-98 cursor-pointer disabled:opacity-50"
              >
                {isUpdatingPassword ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>{t("profile.updating_password")}</span>
                  </>
                ) : (
                  <span>{t("profile.update_password")}</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* ========================================================================= */}
      {/* UPGRADE MODAL POPUP */}
      {/* ========================================================================= */}
      {isUpgradeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white rounded-3xl border border-[#DEE7DF] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="bg-[#12281F] text-white p-6 sm:p-7 flex items-center justify-between border-b border-[#234235]">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#B8F55C]" />
                  <h3 className="text-lg sm:text-xl font-black text-white tracking-tight">
                    {t("profile.modal_upgrade_title")}
                  </h3>
                </div>
                <p className="text-xs text-[#A5B8AD] leading-relaxed">
                  {t("profile.modal_upgrade_subtitle")}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsUpgradeModalOpen(false)}
                className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
                title="Tutup Modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 sm:p-7 space-y-6 max-h-[75vh] overflow-y-auto">
              {!showQrConfirmation ? (
                <>
                  {/* Step 1: Select Plan */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#11231B]">
                      {t("profile.modal_select_plan")}
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {/* Pro Business Option */}
                      <div
                        onClick={() => setSelectedPlan("pro")}
                        className={`p-4 rounded-2xl border-2 transition-all cursor-pointer relative ${selectedPlan === "pro"
                          ? "bg-[#F2F7F3] border-[#184530] shadow-xs"
                          : "bg-white border-[#DEE7DF] hover:border-[#CFE2D3]"
                          }`}
                      >
                        <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
                          <span className="text-xs font-black text-[#11231B]">
                            {t("profile.modal_pro_title")}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 border border-rose-200">
                            🔥 {t("profile.modal_pro_discount_badge")}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-[#8FA599] line-through font-medium">
                            {t("profile.modal_pro_original_price")}
                          </span>
                          <span className="text-lg font-black text-[#184530]">
                            {t("profile.modal_pro_price")}
                            <span className="text-xs font-normal text-[#556A60]">
                              {t("profile.modal_pro_period")}
                            </span>
                          </span>
                        </div>
                        <ul className="text-[11px] text-[#556A60] mt-2 space-y-1">
                          <li className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>1 Akun Desktop Penuh</span>
                          </li>
                          <li className="flex items-center gap-1.5">
                            <Check className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>AI Customer Agent Otomatis</span>
                          </li>
                        </ul>
                      </div>

                      {/* Advance Business Option (Coming Soon) */}
                      <div className="p-4 rounded-2xl border border-[#DEE7DF] bg-[#F8FAF7] opacity-75 relative cursor-not-allowed">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-black text-[#6B8075]">
                            {t("profile.modal_advance_title")}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5EFE7] text-[#184530]">
                            Coming Soon
                          </span>
                        </div>
                        <div className="text-sm font-bold text-[#8FA599] mt-1">
                          Coming Soon
                        </div>
                        <p className="text-[11px] text-[#8FA599] mt-2">
                          Multi-user, custom Gemini API key & integrasi internal.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Step 2: Payment Method Accordion */}
                  <div className="space-y-3">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#11231B]">
                      {t("profile.modal_payment_method")}
                    </h4>

                    {/* Accordion 1: BCA Transfer (Active) */}
                    <div className="rounded-2xl border border-[#DEE7DF] overflow-hidden">
                      <button
                        type="button"
                        onClick={() => setPaymentAccordion("bca")}
                        className="w-full p-4 bg-[#F8FAF7] hover:bg-[#F2F7F3] flex items-center justify-between text-left transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 flex items-center justify-center font-black text-xs">
                            BCA
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#11231B] block">
                              {t("profile.modal_bca_title")}
                            </span>
                            <span className="text-[10px] text-[#556A60]">
                              Transfer Manual & Verifikasi Cepat
                            </span>
                          </div>
                        </div>
                        <ChevronDown
                          className={`w-4 h-4 text-[#556A60] transition-transform ${paymentAccordion === "bca" ? "rotate-180" : ""
                            }`}
                        />
                      </button>

                      {paymentAccordion === "bca" && (
                        <div className="p-4 bg-white border-t border-[#DEE7DF] space-y-3">
                          <div className="p-3.5 rounded-xl bg-[#F2F7F3] border border-[#DEE7DF] space-y-2">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-[#556A60] font-medium">
                                {t("profile.modal_bca_acc_num")}:
                              </span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-black text-[#11231B] text-sm sm:text-base">
                                  2631261801
                                </span>
                                <button
                                  type="button"
                                  onClick={handleCopyBca}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-[#DEE7DF] hover:bg-[#EAF3EC] text-[#184530] text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                                >
                                  {copiedBca ? (
                                    <>
                                      <Check className="w-3 h-3 text-emerald-600" />
                                      <span>{t("profile.modal_bca_copied")}</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="w-3 h-3" />
                                      <span>{t("profile.modal_bca_copy_btn")}</span>
                                    </>
                                  )}
                                </button>
                              </div>
                            </div>

                            <div className="flex items-center justify-between text-xs pt-1 border-t border-[#DEE7DF]">
                              <span className="text-[#556A60] font-medium">
                                {t("profile.modal_bca_acc_name")}:
                              </span>
                              <span className="font-bold text-[#11231B]">
                                Ahmad Fadil
                              </span>
                            </div>
                          </div>

                          {/* Important Account Verification Note */}
                          <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
                            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                            <span>{t("profile.modal_bca_note")}</span>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Accordion 2: QRIS (Coming Soon) */}
                    <div className="rounded-2xl border border-[#DEE7DF] bg-[#F8FAF7] opacity-75">
                      <div className="w-full p-4 flex items-center justify-between text-left">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-[#E5EFE7] text-[#184530] flex items-center justify-center font-bold text-xs">
                            <QrCode className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-[#11231B] block">
                              {t("profile.modal_qris_title")}
                            </span>
                            <span className="text-[10px] text-[#556A60]">
                              Pembayaran Otomatis GoPay, OVO, ShopeePay
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#E5EFE7] text-[#184530]">
                          {t("profile.modal_qris_coming_soon")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Confirmation Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => setShowQrConfirmation(true)}
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#184530] hover:bg-[#12281F] text-[#B8F55C] font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t("profile.modal_confirm_btn")}</span>
                    </button>
                  </div>
                </>
              ) : (
                /* STEP 3: QR CODE CONFIRMATION SCREEN */
                <div className="space-y-6 text-center py-2">
                  <div className="space-y-2">
                    <h4 className="text-base font-black text-[#11231B]">
                      {t("profile.modal_qr_title")}
                    </h4>
                    <p className="text-xs text-[#556A60] max-w-md mx-auto leading-relaxed">
                      {t("profile.modal_qr_desc")}
                    </p>
                  </div>

                  {/* QR Code Graphic */}
                  <div className="flex justify-center my-4">
                    <div className="p-4 rounded-3xl bg-white border-2 border-[#184530] shadow-lg inline-block">
                      <QRCodeSVG
                        value={whatsappUrl}
                        size={210}
                        level="M"
                        includeMargin={true}
                        className="w-48 h-48 sm:w-52 sm:h-52"
                      />
                    </div>
                  </div>

                  {/* Direct WhatsApp Link Button */}
                  <div className="space-y-3 pt-2">
                    <a
                      href={whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3.5 px-6 rounded-2xl bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold text-xs sm:text-sm inline-flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
                    >
                      <Send className="w-4 h-4" />
                      <span>{t("profile.modal_open_wa_btn")}</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>

                    <button
                      type="button"
                      onClick={() => setShowQrConfirmation(false)}
                      className="text-xs font-semibold text-[#556A60] hover:text-[#11231B] underline cursor-pointer"
                    >
                      ← Kembali ke Pilihan Pembayaran
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 sm:px-8 py-6 text-center text-xs text-[#6B8075] border-t border-[#EEF3EF]">
        &copy; {new Date().getFullYear()} {t("footer.copyright")}
      </footer>
    </div>
  );
}
