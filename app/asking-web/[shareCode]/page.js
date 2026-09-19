"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter, notFound } from "next/navigation";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/client";
import { TranslationProvider } from "../data/TranslationContext";
import { AskingProvider } from "../data/AskingContext";
import AskingShell from "../components/AskingShell";
import { Loader2 } from "lucide-react";

export default function RemoteAskingWebPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const shareCode = resolvedParams?.shareCode;

  if (!shareCode) {
    notFound();
  }

  const [session, setSession] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined" && window.__mockUserSession) {
      setSession(window.__mockUserSession);
      setCheckingAuth(false);
      return;
    }

    if (!isSupabaseConfigured()) {
      setCheckingAuth(false);
      return;
    }

    const supabase = createClient();
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        // Redirect to login with return URL
        const nextUrl = `/asking-web/${shareCode}`;
        router.replace(`/login?next=${encodeURIComponent(nextUrl)}`);
      } else {
        setSession(session);
        setCheckingAuth(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        const nextUrl = `/asking-web/${shareCode}`;
        router.replace(`/login?next=${encodeURIComponent(nextUrl)}`);
      } else {
        setSession(session);
      }
    });

    return () => subscription?.unsubscribe();
  }, [router, shareCode]);

  if (checkingAuth) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-[#F8FAF7] dark:bg-[#0C1712] text-[#11231B] dark:text-[#F2F7F4] gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-emerald-600 dark:text-[#B8F55C]" />
        <p className="text-xs font-semibold tracking-wide text-[#556A60] dark:text-[#A5B8AD]">
          Memverifikasi sesi akun...
        </p>
      </div>
    );
  }

  return (
    <TranslationProvider>
      <AskingProvider shareCode={shareCode} userSession={session}>
        <AskingShell />
      </AskingProvider>
    </TranslationProvider>
  );
}
