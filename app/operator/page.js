"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { AsKingLogo } from "@/app/components/Navbar";
import {
  ShieldCheck,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
  Edit3,
  Check,
  Copy,
  LogOut,
  RefreshCw,
  Sparkles,
  Zap,
  Users,
  CreditCard,
  Calendar,
  X,
  Save,
  Download,
  Loader2,
} from "lucide-react";

function msToDatetimeLocal(ms) {
  if (!ms || isNaN(Number(ms))) return "";
  const d = new Date(Number(ms));
  if (isNaN(d.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  const year = d.getFullYear();
  const month = pad(d.getMonth() + 1);
  const day = pad(d.getDate());
  const hours = pad(d.getHours());
  const minutes = pad(d.getMinutes());
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function datetimeLocalToMs(dtStr) {
  if (!dtStr) return 0;
  const d = new Date(dtStr);
  return isNaN(d.getTime()) ? 0 : d.getTime();
}

export default function OperatorDashboardPage() {
  const router = useRouter();

  const [operatorUser, setOperatorUser] = useState(null);
  const [operatorEmail, setOperatorEmail] = useState("");
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Payments State
  const [payments, setPayments] = useState([]);
  const [loadingPayments, setLoadingPayments] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [toastMsg, setToastMsg] = useState(null);

  // Filters & Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // 'all' | 'active' | 'pending' | 'expired'
  const [planFilter, setPlanFilter] = useState("all"); // 'all' | '0' | '1' | '2'

  // Edit Modal State
  const [editingRecord, setEditingRecord] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [copiedUid, setCopiedUid] = useState(null);

  // 1. Authenticate Operator Session dynamically
  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured()) {
        setLoadingAuth(false);
        return;
      }

      const supabase = createClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session?.user?.email) {
        router.push("/operator/login");
        return;
      }

      const email = session.user.email.toLowerCase().trim();

      // Verify Whitelist dynamically from database
      try {
        const res = await fetch("/api/operator/check-whitelist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });

        const data = await res.json();
        if (!res.ok || !data.authorized) {
          router.push("/operator/login");
          return;
        }

        setOperatorUser(data.operator || { email, name: "Operator", role: "operator" });
        setOperatorEmail(email);
        loadPayments(email);
      } catch (err) {
        console.error("Auth check failed:", err);
        router.push("/operator/login");
      } finally {
        setLoadingAuth(false);
      }
    }

    checkAuth();
  }, [router]);

  // 2. Load Payment Records from Supabase
  const loadPayments = async (emailOverride) => {
    const email = emailOverride || operatorEmail;
    if (!email) return;

    setLoadingPayments(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`/api/operator/payments`, {
        headers: {
          "x-operator-email": email,
        },
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal memuat data pembayaran.");
      }

      setPayments(json.data || []);
    } catch (err) {
      console.error("Failed to load payments:", err);
      setErrorMsg(err.message || "Gagal menghubungi server data pembayaran.");
    } finally {
      setLoadingPayments(false);
    }
  };

  const showToast = (msg, type = "success") => {
    setToastMsg({ text: msg, type });
    setTimeout(() => setToastMsg(null), 4000);
  };

  // 3. Quick 1-Click Approve Payment (+30 Days Pro Plan)
  const handleQuickApprove = async (record) => {
    if (!confirm(`Approve dan aktifkan paket Pro Business (+30 Hari, 1.000 AI Quota) untuk UID ${record.uid.slice(0, 8)}...?`)) {
      return;
    }

    const nowMs = Date.now();
    const expiredMs = nowMs + 30 * 24 * 60 * 60 * 1000;

    try {
      const res = await fetch("/api/operator/payments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-operator-email": operatorEmail,
        },
        body: JSON.stringify({
          uid: record.uid,
          jenis_plan: 1, // Pro Business
          note_plan: "pro business (approved)",
          datetime_payment: nowMs,
          datetime_expired: expiredMs,
          request_budget: 1000,
          status: "active",
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal approve payment.");
      }

      showToast(`Paket Pro Business untuk UID ${record.uid.slice(0, 8)}... berhasil di-approve!`);
      loadPayments();
    } catch (err) {
      console.error("Approve error:", err);
      showToast(err.message || "Gagal meng-approve paket.", "error");
    }
  };

  // 4. Save Edited Record from Modal
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingRecord) return;

    setIsUpdating(true);
    try {
      const res = await fetch("/api/operator/payments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-operator-email": operatorEmail,
        },
        body: JSON.stringify({
          uid: editingRecord.uid,
          user_email: editingRecord.user_email,
          user_name: editingRecord.user_name,
          jenis_plan: Number(editingRecord.jenis_plan),
          note_plan: editingRecord.note_plan,
          datetime_payment: Number(editingRecord.datetime_payment),
          datetime_expired: Number(editingRecord.datetime_expired),
          request_budget: Number(editingRecord.request_budget),
          status: editingRecord.status,
          base_price: Number(editingRecord.base_price ?? 199000),
          discount: Number(editingRecord.discount ?? 60),
          price: Number(editingRecord.price ?? 79000),
        }),
      });

      const json = await res.json();
      if (!res.ok || !json.success) {
        throw new Error(json.message || "Gagal memperbarui data.");
      }

      showToast("Data langganan berhasil diperbarui!");
      setEditingRecord(null);
      loadPayments();
    } catch (err) {
      console.error("Update error:", err);
      showToast(err.message || "Gagal menyimpan perubahan.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  // 5. Sign Out Operator
  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    if (typeof window !== "undefined") {
      localStorage.removeItem("asking_operator_email");
    }
    router.push("/operator/login");
  };

  const handleCopyUid = (uid) => {
    navigator.clipboard.writeText(uid);
    setCopiedUid(uid);
    setTimeout(() => setCopiedUid(null), 2000);
  };

  // Filtered Payments List
  const filteredPayments = useMemo(() => {
    return payments.filter((p) => {
      const matchSearch =
        !searchQuery.trim() ||
        (p.uid || "").toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (p.user_email || "").toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (p.user_name || "").toLowerCase().includes(searchQuery.toLowerCase().trim()) ||
        (p.note_plan || "").toLowerCase().includes(searchQuery.toLowerCase().trim());

      const matchStatus = statusFilter === "all" || (p.status || "active").toLowerCase() === statusFilter.toLowerCase();
      const matchPlan = planFilter === "all" || String(p.jenis_plan) === planFilter;

      return matchSearch && matchStatus && matchPlan;
    });
  }, [payments, searchQuery, statusFilter, planFilter]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = payments.length;
    const activePro = payments.filter((p) => p.jenis_plan === 1 && p.status === "active").length;
    const pending = payments.filter((p) => p.status === "pending").length;
    const totalAiBudget = payments.reduce((acc, p) => acc + (p.request_budget || 0), 0);

    return { total, activePro, pending, totalAiBudget };
  }, [payments]);

  // Export to CSV
  const handleExportCsv = () => {
    if (filteredPayments.length === 0) return;

    const headers = [
      "UID",
      "Nama Pelanggan",
      "Email",
      "Jenis Plan",
      "Tgl Payment",
      "Tgl Expired",
      "Request Budget",
      "Status",
    ];

    const rows = filteredPayments.map((p) => [
      p.uid,
      `"${p.user_name || "-"}"`,
      p.user_email || "-",
      p.jenis_plan === 1 ? "Pro Business" : p.jenis_plan === 2 ? "Advance Business" : "Free Trial",
      p.datetime_payment ? new Date(Number(p.datetime_payment)).toISOString() : "-",
      p.datetime_expired ? new Date(Number(p.datetime_expired)).toISOString() : "-",
      p.request_budget || 0,
      p.status || "active",
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(","), ...rows.map((e) => e.join(","))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `asking_payments_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loadingAuth) {
    return (
      <div className="min-h-screen bg-[#F8FAF7] flex items-center justify-center text-[#11231B]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#184530]" />
          <span className="text-xs font-semibold text-[#556A60]">Memverifikasi akses operator...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAF7] text-[#11231B] flex flex-col justify-between font-sans antialiased select-none">

      {/* Toast Notification */}
      {toastMsg && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl border text-xs font-bold shadow-2xl flex items-center gap-2 animate-in slide-in-from-top-3 duration-200 ${toastMsg.type === "error"
            ? "bg-rose-50 border-rose-200 text-rose-700"
            : "bg-[#12281F] border-[#234235] text-[#B8F55C]"
            }`}
        >
          {toastMsg.type === "error" ? (
            <AlertCircle className="w-4 h-4 text-rose-500" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-[#B8F55C]" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#DEE7DF]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="group flex items-center gap-3">
              <AsKingLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => loadPayments()}
              disabled={loadingPayments}
              className="p-2.5 rounded-full bg-white hover:bg-[#F2F7F3] text-[#184530] border border-[#DEE7DF] transition-all cursor-pointer shadow-2xs disabled:opacity-50"
              title="Refresh Data"
            >
              <RefreshCw className={`w-4 h-4 ${loadingPayments ? "animate-spin text-[#184530]" : ""}`} />
            </button>

            <button
              type="button"
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-8 py-8 space-y-8">

        {/* Metric Cards Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-3xl bg-white border border-[#DEE7DF] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#556A60]">
              <span className="text-xs font-bold uppercase tracking-wider">Total Pelanggan</span>
              <Users className="w-4 h-4 text-[#184530]" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#11231B] tracking-tight">
              {metrics.total}
            </div>
            <p className="text-[11px] text-[#6B8075]">Tercatat di database tb_payment</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#DEE7DF] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#556A60]">
              <span className="text-xs font-bold uppercase tracking-wider">Pelanggan Pro Aktif</span>
              <Sparkles className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#184530] tracking-tight">
              {metrics.activePro}
            </div>
            <p className="text-[11px] text-[#6B8075]">Paket berbayar yang aktif berjalan</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#DEE7DF] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#556A60]">
              <span className="text-xs font-bold uppercase tracking-wider">Menunggu Approval</span>
              <Clock className="w-4 h-4 text-amber-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-amber-700 tracking-tight">
              {metrics.pending}
            </div>
            <p className="text-[11px] text-[#6B8075]">Status pending pembayaran/upgrade</p>
          </div>

          <div className="p-5 rounded-3xl bg-white border border-[#DEE7DF] shadow-xs space-y-2">
            <div className="flex items-center justify-between text-[#556A60]">
              <span className="text-xs font-bold uppercase tracking-wider">Total Kuota AI</span>
              <Zap className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl sm:text-3xl font-black text-[#11231B] tracking-tight">
              {metrics.totalAiBudget.toLocaleString("id-ID")}
            </div>
            <p className="text-[11px] text-[#6B8075]">Alokasi request AI aktif di sistem</p>
          </div>
        </div>

        {/* Filter, Search, and Action Bar */}
        <div className="rounded-3xl bg-white border border-[#DEE7DF] p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">

            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#6B8075]" />
              <input
                type="text"
                placeholder="Cari berdasarkan UID, Email, atau Nama Pelanggan..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] placeholder-[#8EA096] focus:outline-none focus:border-[#12281F] transition-colors"
              />
            </div>

            {/* Filter Dropdowns & Export */}
            <div className="flex items-center gap-3 flex-wrap">
              {/* Status Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#556A60] font-semibold hidden sm:inline">Status:</span>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F] cursor-pointer"
                >
                  <option value="all">Semua Status</option>
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="expired">Expired</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>

              {/* Plan Filter */}
              <div className="flex items-center gap-1.5 text-xs">
                <span className="text-[#556A60] font-semibold hidden sm:inline">Plan:</span>
                <select
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-3 py-2 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F] cursor-pointer"
                >
                  <option value="all">Semua Plan</option>
                  <option value="0">Free Trial (0)</option>
                  <option value="1">Pro Business (1)</option>
                  <option value="2">Advance Business (2)</option>
                </select>
              </div>

              {/* Export CSV Button */}
              <button
                type="button"
                onClick={handleExportCsv}
                disabled={filteredPayments.length === 0}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#E5EFE7] hover:bg-[#D5E6D8] border border-[#CFE2D3] text-[#184530] text-xs font-bold transition-all shadow-2xs disabled:opacity-50 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="rounded-3xl bg-white border border-[#DEE7DF] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8FAF7] border-b border-[#DEE7DF] text-[#556A60] uppercase tracking-wider font-bold text-[10px]">
                <tr>
                  <th className="py-4 px-5">UID & Pelanggan</th>
                  <th className="py-4 px-5">Jenis Plan</th>
                  <th className="py-4 px-5">Harga & Diskon</th>
                  <th className="py-4 px-5">Tgl Payment</th>
                  <th className="py-4 px-5">Masa Berlaku (Expired)</th>
                  <th className="py-4 px-5">Request Budget</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#EEF3EF] text-[#11231B]">
                {loadingPayments ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#556A60]">
                      <Loader2 className="w-6 h-6 animate-spin text-[#184530] mx-auto mb-2" />
                      <span>Memuat data tabel tb_payment...</span>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center text-[#556A60]">
                      Tidak ada data pembayaran yang cocok dengan filter atau pencarian Anda.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((row) => {
                    const planBadge =
                      row.jenis_plan === 1
                        ? { label: "Pro Business", bg: "bg-[#E5EFE7] text-[#184530] border-[#CFE2D3]" }
                        : row.jenis_plan === 2
                          ? { label: "Advance Business", bg: "bg-blue-50 text-blue-800 border-blue-200" }
                          : { label: "Free Trial", bg: "bg-[#F0F4F1] text-[#556A60] border-[#DEE7DF]" };

                    const statusBadge =
                      row.status === "active"
                        ? { label: "Active", bg: "bg-emerald-50 text-emerald-800 border-emerald-200" }
                        : row.status === "pending"
                          ? { label: "Pending", bg: "bg-amber-50 text-amber-800 border-amber-200" }
                          : { label: "Expired", bg: "bg-rose-50 text-rose-800 border-rose-200" };

                    const paymentDate = row.datetime_payment
                      ? new Date(Number(row.datetime_payment)).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                      : "-";

                    const expiredDate = row.datetime_expired
                      ? new Date(Number(row.datetime_expired)).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                      : "-";

                    const now = Date.now();
                    const isExp = row.datetime_expired ? now > Number(row.datetime_expired) : false;
                    const daysLeft = row.datetime_expired
                      ? Math.max(0, Math.ceil((Number(row.datetime_expired) - now) / (1000 * 60 * 60 * 24)))
                      : 0;

                    return (
                      <tr
                        key={row.uid || row.id}
                        className="hover:bg-[#F8FAF7] transition-colors"
                      >
                        {/* UID & Customer Info */}
                        <td className="py-4 px-5">
                          <div className="space-y-1">
                            <div className="flex items-center gap-1.5">
                              <span className="font-mono text-[11px] text-[#11231B] font-bold">
                                {row.uid ? `${row.uid.slice(0, 10)}...` : "-"}
                              </span>
                              {row.uid && (
                                <button
                                  type="button"
                                  onClick={() => handleCopyUid(row.uid)}
                                  className="p-1 rounded hover:bg-[#EBF1EB] text-[#6B8075] hover:text-[#11231B] transition-colors cursor-pointer"
                                  title="Copy UID"
                                >
                                  {copiedUid === row.uid ? (
                                    <Check className="w-3 h-3 text-emerald-600" />
                                  ) : (
                                    <Copy className="w-3 h-3" />
                                  )}
                                </button>
                              )}
                            </div>
                            <div className="text-[11px] font-bold text-[#11231B]">
                              {row.user_name || "Tanpa Nama"}
                            </div>
                            <div className="text-[10.5px] text-[#556A60]">
                              {row.user_email || "-"}
                            </div>
                          </div>
                        </td>

                        {/* Plan Badge */}
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-bold border ${planBadge.bg}`}
                          >
                            {planBadge.label}
                          </span>
                        </td>

                        {/* Price & Discount Setup */}
                        <td className="py-4 px-5">
                          <div className="space-y-0.5">
                            <span className="font-mono font-black text-[#184530] text-xs block">
                              Rp {(row.price ?? 79000).toLocaleString("id-ID")}
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-[#6B8075] font-mono">
                              <span className="line-through text-[#8FA599]">
                                Rp {(row.base_price ?? 199000).toLocaleString("id-ID")}
                              </span>
                              <span className="text-emerald-700 font-bold">
                                (-{row.discount ?? 60}%)
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* Payment Date */}
                        <td className="py-4 px-5 font-mono text-[11px] text-[#556A60]">
                          {paymentDate}
                        </td>

                        {/* Expiration Date */}
                        <td className="py-4 px-5">
                          <div className="space-y-0.5">
                            <span className="font-mono text-[11px] text-[#556A60] block">
                              {expiredDate}
                            </span>
                            <span
                              className={`text-[10px] font-bold block ${isExp ? "text-rose-600" : "text-[#184530]"
                                }`}
                            >
                              {isExp ? "Telah Lewat" : `Sisa ${daysLeft} Hari`}
                            </span>
                          </div>
                        </td>

                        {/* Request Budget */}
                        <td className="py-4 px-5">
                          <span className="font-mono font-bold text-[#11231B] text-xs">
                            {(row.request_budget || 0).toLocaleString("id-ID")}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-5">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10.5px] font-bold border ${statusBadge.bg}`}
                          >
                            {statusBadge.label}
                          </span>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {/* Quick Approve Button if not active pro */}
                            {row.status === "pending" && (
                              <button
                                type="button"
                                onClick={() => handleQuickApprove(row)}
                                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 text-[11px] font-bold transition-all shadow-2xs cursor-pointer"
                                title="Approve Pro Plan (+30 Hari)"
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-700" />
                                <span>Approve</span>
                              </button>
                            )}

                            {/* Edit Button */}
                            <button
                              type="button"
                              onClick={() => setEditingRecord({ ...row })}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] text-[11px] font-bold transition-all shadow-xs cursor-pointer"
                            >
                              <Edit3 className="w-3.5 h-3.5" />
                              <span>Edit</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>

      {/* EDIT MODAL DRAWER */}
      {editingRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-150 select-none">
          <div className="relative w-full max-w-lg bg-white rounded-3xl border border-[#DEE7DF] shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">

            {/* Modal Header */}
            <div className="bg-[#12281F] text-white p-6 flex items-center justify-between border-b border-[#234235]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#18362B] text-[#B8F55C] border border-[#2A5241] flex items-center justify-center shadow-xs">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-white tracking-tight">
                    Edit Data Langganan Pelanggan
                  </h3>
                  <p className="text-xs text-[#A5B8AD] font-mono">
                    UID: {editingRecord.uid}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setEditingRecord(null)}
                className="p-2 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSaveEdit} className="p-6 sm:p-7 space-y-5 text-xs text-[#11231B]">

              {/* Customer Name & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#2D3E35]">Nama Pelanggan</label>
                  <input
                    type="text"
                    value={editingRecord.user_name || ""}
                    onChange={(e) => setEditingRecord({ ...editingRecord, user_name: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F]"
                    placeholder="Nama Lengkap"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#2D3E35]">Email Pelanggan</label>
                  <input
                    type="email"
                    value={editingRecord.user_email || ""}
                    onChange={(e) => setEditingRecord({ ...editingRecord, user_email: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F]"
                    placeholder="user@example.com"
                  />
                </div>
              </div>

              {/* Plan & Status Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#2D3E35]">Jenis Plan</label>
                  <select
                    value={editingRecord.jenis_plan}
                    onChange={(e) => setEditingRecord({ ...editingRecord, jenis_plan: Number(e.target.value) })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F] cursor-pointer"
                  >
                    <option value={0}>0 - Free Trial</option>
                    <option value={1}>1 - Pro Business</option>
                    <option value={2}>2 - Advance Business</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="font-bold text-[#2D3E35]">Status Billing</label>
                  <select
                    value={editingRecord.status}
                    onChange={(e) => setEditingRecord({ ...editingRecord, status: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F] cursor-pointer"
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="expired">Expired</option>
                    <option value="suspended">Suspended</option>
                  </select>
                </div>
              </div>

              {/* Request Budget with Quick Presets */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-[#2D3E35]">Request Budget (Kuota AI)</label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setEditingRecord({ ...editingRecord, request_budget: 1000 })}
                      className="px-2.5 py-1 rounded-lg bg-[#E5EFE7] text-[#184530] font-bold text-[10.5px] hover:bg-[#D5E6D8] cursor-pointer"
                    >
                      Set 1.000
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingRecord({ ...editingRecord, request_budget: (editingRecord.request_budget || 0) + 500 })}
                      className="px-2.5 py-1 rounded-lg bg-[#E5EFE7] text-[#184530] font-bold text-[10.5px] hover:bg-[#D5E6D8] cursor-pointer"
                    >
                      +500
                    </button>
                  </div>
                </div>
                <input
                  type="number"
                  value={editingRecord.request_budget || 0}
                  onChange={(e) => setEditingRecord({ ...editingRecord, request_budget: Number(e.target.value) })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] font-mono focus:outline-none focus:border-[#12281F]"
                />
              </div>

              {/* Pricing & Discount Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-bold text-[#2D3E35] text-[11px]">Base Price (Rp)</label>
                  <input
                    type="number"
                    value={editingRecord.base_price ?? 199000}
                    onChange={(e) => {
                      const bp = Number(e.target.value);
                      const discPercent = Number(editingRecord.discount ?? 60);
                      setEditingRecord({
                        ...editingRecord,
                        base_price: bp,
                        price: Math.max(0, Math.round(bp * (1 - discPercent / 100))),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] font-mono focus:outline-none focus:border-[#12281F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#2D3E35] text-[11px]">Discount (%)</label>
                  <input
                    type="number"
                    value={editingRecord.discount ?? 60}
                    onChange={(e) => {
                      const discPercent = Number(e.target.value);
                      const bp = Number(editingRecord.base_price ?? 199000);
                      setEditingRecord({
                        ...editingRecord,
                        discount: discPercent,
                        price: Math.max(0, Math.round(bp * (1 - discPercent / 100))),
                      });
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] font-mono focus:outline-none focus:border-[#12281F]"
                  />
                </div>
                <div className="space-y-1">
                  <label className="font-bold text-[#2D3E35] text-[11px]">Final Price (Rp)</label>
                  <input
                    type="number"
                    value={editingRecord.price ?? 79000}
                    onChange={(e) =>
                      setEditingRecord({ ...editingRecord, price: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#184530] font-black font-mono focus:outline-none focus:border-[#12281F]"
                  />
                </div>
              </div>

              {/* Dates with Datetime-Local Picker & Quick Presets */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Datetime Payment */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[#2D3E35]">Tgl Payment</label>
                    <button
                      type="button"
                      onClick={() => setEditingRecord({ ...editingRecord, datetime_payment: Date.now() })}
                      className="text-[10.5px] font-bold text-[#184530] hover:underline cursor-pointer"
                    >
                      Set Sekarang
                    </button>
                  </div>
                  <input
                    type="datetime-local"
                    value={msToDatetimeLocal(editingRecord.datetime_payment)}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        datetime_payment: datetimeLocalToMs(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#6B8075] block">
                    {editingRecord.datetime_payment
                      ? new Date(Number(editingRecord.datetime_payment)).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "-"}
                  </span>
                </div>

                {/* Datetime Expired */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <label className="font-bold text-[#2D3E35]">Tgl Expired</label>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() =>
                          setEditingRecord({
                            ...editingRecord,
                            datetime_expired:
                              (Number(editingRecord.datetime_expired) || Date.now()) + 30 * 86400000,
                          })
                        }
                        className="text-[10.5px] font-bold text-[#184530] hover:underline cursor-pointer"
                      >
                        +30 Hari
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingRecord({
                            ...editingRecord,
                            datetime_expired:
                              (Number(editingRecord.datetime_expired) || Date.now()) + 365 * 86400000,
                          })
                        }
                        className="text-[10.5px] font-bold text-[#184530] hover:underline cursor-pointer"
                      >
                        +1 Tahun
                      </button>
                    </div>
                  </div>
                  <input
                    type="datetime-local"
                    value={msToDatetimeLocal(editingRecord.datetime_expired)}
                    onChange={(e) =>
                      setEditingRecord({
                        ...editingRecord,
                        datetime_expired: datetimeLocalToMs(e.target.value),
                      })
                    }
                    className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F] cursor-pointer"
                  />
                  <span className="text-[10px] text-[#6B8075] block">
                    {editingRecord.datetime_expired
                      ? new Date(Number(editingRecord.datetime_expired)).toLocaleString("id-ID", {
                          dateStyle: "medium",
                          timeStyle: "short",
                        })
                      : "-"}
                  </span>
                </div>
              </div>

              {/* Note */}
              <div className="space-y-1">
                <label className="font-bold text-[#2D3E35]">Catatan Plan / Transaksi</label>
                <input
                  type="text"
                  value={editingRecord.note_plan || ""}
                  onChange={(e) => setEditingRecord({ ...editingRecord, note_plan: e.target.value })}
                  className="w-full px-3.5 py-2 rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F]"
                  placeholder="e.g. transfer manual BCA, order promo VIP"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EEF3EF]">
                <button
                  type="button"
                  onClick={() => setEditingRecord(null)}
                  className="px-4 py-2.5 rounded-full border border-[#DEE7DF] text-[#556A60] hover:bg-[#F2F7F3] font-bold transition-all cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#12281F] hover:bg-[#1C3B2E] text-[#B8F55C] font-bold transition-all shadow-md active:scale-98 disabled:opacity-50 cursor-pointer"
                >
                  {isUpdating ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-[#B8F55C]" />
                      <span>Menyimpan...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 text-[#B8F55C]" />
                      <span>Simpan Perubahan</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 sm:px-8 py-6 text-center text-xs text-[#6B8075] border-t border-[#DEE7DF]">
        &copy; {new Date().getFullYear()} AsKing Customer Manager • Internal Operator Environment
      </footer>
    </div>
  );
}
