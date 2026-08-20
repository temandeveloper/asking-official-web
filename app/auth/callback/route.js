import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type"); // "signup" | "email" | "recovery" | "invite"
  const next = searchParams.get("next") || "/profile";
  const errorParam = searchParams.get("error");
  const errorCode = searchParams.get("error_code");

  const supabase = await createClient();

  // 1. Handle PKCE authorization code exchange
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      return redirectToDestination(request, origin, next);
    }
    console.warn("[Auth Callback] exchangeCodeForSession failed:", error.message);
  }

  // 2. Handle token_hash verification (Standard Supabase OTP / Email confirmation)
  if (token_hash && type) {
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      return redirectToDestination(request, origin, next);
    }
    console.warn("[Auth Callback] verifyOtp failed:", error.message);
  }

  // 3. Check if user already has an active session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirectToDestination(request, origin, next);
  }

  // 4. If error parameter was passed from Supabase (e.g. OTP already consumed/expired because of link scanner)
  if (errorCode === "otp_expired" || errorParam === "access_denied") {
    // If OTP was already consumed, the email is likely verified, direct to login with verified notice
    return NextResponse.redirect(`${origin}/login?verified=true`);
  }

  // 5. Fallback: If hash fragment exists (handled on client side), redirect to /login with verified indicator
  return NextResponse.redirect(`${origin}/login?verified=true`);
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
