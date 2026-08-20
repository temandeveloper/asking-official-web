"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { ClauseLogo } from "../components/Navbar";
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
} from "lucide-react";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(false);

  // Edit profile state
  const [fullName, setFullName] = useState("");
  const [isUpdatingName, setIsUpdatingName] = useState(false);
  const [nameUpdateMessage, setNameUpdateMessage] = useState(null);

  // Change password state
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);

  useEffect(() => {
    async function loadUser() {
      if (!isSupabaseConfigured()) {
        setLoading(false);
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
      } catch (err) {
        console.error("Failed to load user profile:", err);
        router.push("/login");
      } finally {
        setLoading(false);
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
      setNameUpdateMessage({ type: "success", text: "Name updated successfully!" });
    } catch (err) {
      setNameUpdateMessage({ type: "error", text: err.message || "Failed to update profile name." });
    } finally {
      setIsUpdatingName(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPasswordMessage(null);

    if (newPassword.length < 6) {
      setPasswordMessage({ type: "error", text: "New password must be at least 6 characters." });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordMessage({ type: "error", text: "Passwords do not match." });
      return;
    }

    setIsUpdatingPassword(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;
      setPasswordMessage({ type: "success", text: "Password changed successfully!" });
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setPasswordMessage({ type: "error", text: err.message || "Failed to change password." });
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
        <p className="text-xs font-semibold text-[#556A60]">Loading your profile...</p>
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
    ? new Date(user.created_at).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    : "Recently";

  return (
    <div className="min-h-screen bg-[#F8FAF7] flex flex-col justify-between text-[#11231B]">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-[#DEE7DF]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="group flex items-center">
              <ClauseLogo className="w-8 h-8 group-hover:scale-105 transition-transform" />
            </Link>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-[#E5EFE7] text-[#184530] text-xs font-bold border border-[#CFE2D3]">
              <Sparkles className="w-3.5 h-3.5 text-[#184530]" />
              <span>Clause Workspace</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex text-xs font-semibold text-[#4A5F54] hover:text-[#11231B] px-3 py-2 transition-colors"
            >
              View Landing Page
            </Link>
            <button
              onClick={handleSignOut}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
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
                  Verified Email
                </span>
              </div>

              <p className="text-xs text-[#556A60] flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#6B8075]" />
                {user?.email}
              </p>

              <div className="flex items-center gap-4 text-[11px] text-[#8EA096] pt-1 flex-wrap">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Member since {createdDate}
                </span>
                <span className="flex items-center gap-1 font-mono">
                  <Fingerprint className="w-3 h-3" />
                  ID: {user?.id?.slice(0, 8)}...
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
              <span>Explore Features</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
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
                <h3 className="text-sm font-bold text-[#11231B]">Personal Profile</h3>
                <p className="text-xs text-[#556A60]">Update your display name and contact identity</p>
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
                <label className="block text-xs font-bold text-[#2D3E35]">Full Name</label>
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2D3E35]">Email Address</label>
                <input
                  type="email"
                  disabled
                  value={user?.email || ""}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F0F4F1] border border-[#DEE7DF] text-[#6B8075] cursor-not-allowed"
                />
                <p className="text-[10.5px] text-[#8EA096]">
                  Email address is verified through Supabase Auth.
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
                    <span>Saving...</span>
                  </>
                ) : (
                  <span>Save Changes</span>
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
                <h3 className="text-sm font-bold text-[#11231B]">Security & Password</h3>
                <p className="text-xs text-[#556A60]">Update your login password</p>
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
                <label className="block text-xs font-bold text-[#2D3E35]">New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#F8FAF7] border border-[#DEE7DF] text-[#11231B] focus:outline-none focus:border-[#12281F]"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-[#2D3E35]">Confirm New Password</label>
                <input
                  type="password"
                  required
                  placeholder="Repeat new password"
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
                    <span>Updating...</span>
                  </>
                ) : (
                  <span>Update Password</span>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl w-full mx-auto px-6 sm:px-8 py-6 text-center text-xs text-[#6B8075] border-t border-[#EEF3EF]">
        &copy; {new Date().getFullYear()} Clause Inc. Supabase Authentication Active.
      </footer>
    </div>
  );
}
