import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { PRICING_CONFIG } from "@/lib/config/pricing";

const ALLOWED_REDIRECT_PATHS = new Set([
  "/",
  "/login",
  "/profile",
  "/auth/desktop",
  "/auth/reset-password",
]);

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type"); // "signup" | "email" | "recovery" | "invite"
  const next = getSafeRedirectPath(searchParams.get("next"));
  const isRecoveryFlow = type === "recovery" || next === "/auth/reset-password";
  const errorParam = searchParams.get("error");
  const errorCode = searchParams.get("error_code");

  const supabase = await createClient();

  // 1. Handle PKCE authorization code exchange
  if (code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      if (data?.user && !isRecoveryFlow) {
        await ensureUserPayment(supabase, data.user.id);
      }
      return redirectToDestination(request, origin, isRecoveryFlow ? "/auth/reset-password" : next);
    }
    console.warn("[Auth Callback] exchangeCodeForSession failed:", error.message);
    if (isRecoveryFlow) {
      return redirectToDestination(request, origin, "/auth/reset-password?error=expired");
    }
  }

  // 2. Handle token_hash verification (Standard Supabase OTP / Email confirmation)
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      if (data?.user && !isRecoveryFlow) {
        await ensureUserPayment(supabase, data.user.id);
      }
      return redirectToDestination(request, origin, isRecoveryFlow ? "/auth/reset-password" : next);
    }
    console.warn("[Auth Callback] verifyOtp failed:", error.message);
    if (isRecoveryFlow) {
      return redirectToDestination(request, origin, "/auth/reset-password?error=expired");
    }
  }

  // 3. Check if user already has an active session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (!isRecoveryFlow) {
      await ensureUserPayment(supabase, user.id);
    }
    return redirectToDestination(request, origin, isRecoveryFlow ? "/auth/reset-password" : next);
  }

  // 4. If error parameter was passed from Supabase (e.g. OTP already consumed/expired because of link scanner)
  if (isRecoveryFlow) {
    return redirectToDestination(request, origin, "/auth/reset-password?error=expired");
  }

  if (errorCode === "otp_expired" || errorParam === "access_denied") {
    // If OTP was already consumed, the email is likely verified, direct to login with verified notice
    return NextResponse.redirect(`${origin}/login?verified=true`);
  }

  // 5. Fallback: If hash fragment exists (handled on client side), redirect to /login with verified indicator
  return NextResponse.redirect(`${origin}/login?verified=true`);
}

function getSafeRedirectPath(requestedPath) {
  return ALLOWED_REDIRECT_PATHS.has(requestedPath) ? requestedPath : "/profile";
}

async function ensureUserPayment(supabase, userId) {
  if (!userId) return;
  try {
    const { data, error } = await supabase
      .from("tb_payment")
      .select("id")
      .eq("uid", userId)
      .maybeSingle();

    if (!data && !error) {
      const nowMs = Date.now();
      const expiredMs = nowMs + 15 * 24 * 60 * 60 * 1000;
      const basePrice = Number(String(PRICING_CONFIG.proOriginalPrice).replace(/\D/g, "")) || 199000;
      const discount = Number(PRICING_CONFIG.proDiscountPercent) || 60;
      const price = Number(PRICING_CONFIG.proRawAmount) || 79000;

      await supabase.from("tb_payment").insert({
        uid: userId,
        jenis_plan: 0,
        note_plan: "free trial",
        datetime_payment: nowMs,
        datetime_expired: expiredMs,
        request_budget: 300,
        status: "active",
        base_price: basePrice,
        discount: discount,
        price: price,
      });
    }
  } catch (err) {
    console.error("[Auth Callback] ensureUserPayment error:", err);
  }
}

function redirectToDestination(request, origin, next) {
  const forwardedHost = request.headers.get("x-forwarded-host");
  const isLocalEnv = process.env.NODE_ENV === "development";

  if (isLocalEnv) {
    return NextResponse.redirect(`${origin}${next}`);
  } else if (forwardedHost) {
    return NextResponse.redirect(`https://${forwardedHost}${next}`);
  } else {
    return NextResponse.redirect(`${origin}${next}`);
  }
}
