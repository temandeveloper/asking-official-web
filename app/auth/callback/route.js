import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ensureUserPayment } from "@/lib/supabase/payment";

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
  const type = searchParams.get("type"); // "signup" | "email" | "recovery" | "invite" | "verify_email"
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
        await ensureUserPayment(supabase, data.user);
        try {
          await supabase.auth.updateUser({
            data: {
              email_verified: true,
              is_email_verified: true,
              asking_email_confirmed: true,
            },
          });
        } catch (e) {
          console.warn("[Auth Callback] updateUser metadata error:", e);
        }
      }
      const destination = isRecoveryFlow
        ? "/auth/reset-password"
        : `${next}${next.includes("?") ? "&" : "?"}verified=true`;
      return redirectToDestination(request, origin, destination);
    }
    console.warn("[Auth Callback] exchangeCodeForSession failed:", error.message);
    if (isRecoveryFlow) {
      return redirectToDestination(request, origin, "/auth/reset-password?error=expired");
    }
  }

  // 2. Handle token_hash verification (Standard Supabase OTP / Email confirmation)
  if (token_hash && type) {
    const otpType = type === "verify_email" ? "email" : type;
    const { data, error } = await supabase.auth.verifyOtp({
      type: otpType,
      token_hash,
    });
    if (!error) {
      if (data?.user && !isRecoveryFlow) {
        await ensureUserPayment(supabase, data.user);
        try {
          await supabase.auth.updateUser({
            data: {
              email_verified: true,
              is_email_verified: true,
              asking_email_confirmed: true,
            },
          });
        } catch (e) {
          console.warn("[Auth Callback] updateUser metadata error:", e);
        }
      }
      const destination = isRecoveryFlow
        ? "/auth/reset-password"
        : `${next}${next.includes("?") ? "&" : "?"}verified=true`;
      return redirectToDestination(request, origin, destination);
    }
    console.warn("[Auth Callback] verifyOtp failed:", error.message);
    if (isRecoveryFlow) {
      return redirectToDestination(request, origin, "/auth/reset-password?error=expired");
    }
  }

  // 3. Check if user already has an active session (for regular OAuth / redirect navigation)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    if (!isRecoveryFlow) {
      await ensureUserPayment(supabase, user);
    }
    return redirectToDestination(request, origin, isRecoveryFlow ? "/auth/reset-password" : next);
  }

  // 4. If error parameter was passed from Supabase (e.g. OTP already consumed/expired because of link scanner)
  if (isRecoveryFlow) {
    return redirectToDestination(request, origin, "/auth/reset-password?error=expired");
  }

  if (errorCode === "otp_expired" || errorParam === "access_denied") {
    // If OTP was already consumed, direct to login with verified notice
    return NextResponse.redirect(`${origin}/login?verified=true`);
  }

  // 5. Fallback
  return NextResponse.redirect(`${origin}/login`);
}

function getSafeRedirectPath(requestedPath) {
  return ALLOWED_REDIRECT_PATHS.has(requestedPath) ? requestedPath : "/profile";
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
