import { PRICING_CONFIG } from "@/lib/config/pricing";

/**
 * Ensures that an authenticated user has an active tb_payment record.
 * Idempotent: if record exists, returns it; if not, initializes a 15-day free trial.
 *
 * @param {import("@supabase/supabase-js").SupabaseClient} supabase
 * @param {Object} user - Supabase user object containing at least id and user_metadata
 * @param {string} [overridePlan] - Optional plan override ("pro", "pro_plus", "free_trial")
 * @returns {Promise<Object|null>} The payment record or null on error
 */
export async function ensureUserPayment(supabase, user, overridePlan = null) {
  const userId = user?.id;
  if (!userId) return null;

  try {
    // 1. Check if user already has a payment record
    const { data: existing, error: fetchError } = await supabase
      .from("tb_payment")
      .select("*")
      .eq("uid", userId)
      .maybeSingle();

    if (existing) {
      return existing;
    }

    // 2. Determine selected plan from override, metadata, or fallback
    const rawPlan = overridePlan || user.user_metadata?.selected_plan || "free_trial";
    const selectedPlan = rawPlan === "pro_plus" ? "pro_plus" : rawPlan === "pro" ? "pro" : "free_trial";
    const isProPlus = selectedPlan === "pro_plus";
    const isPro = selectedPlan === "pro";

    const basePrice = Number(
      String(isProPlus ? PRICING_CONFIG.proPlusOriginalPrice : PRICING_CONFIG.proOriginalPrice).replace(/\D/g, "")
    ) || (isProPlus ? 2990000 : 199000);

    const discount = Number(
      isProPlus ? PRICING_CONFIG.proPlusDiscountPercent : PRICING_CONFIG.proDiscountPercent
    ) || (isProPlus ? 83 : 60);

    const price = Number(
      isProPlus ? PRICING_CONFIG.proPlusRawAmount : PRICING_CONFIG.proRawAmount
    ) || (isProPlus ? 499000 : 79000);

    const nowMs = Date.now();
    const expiredMs = nowMs + 15 * 24 * 60 * 60 * 1000;

    const newPayment = {
      uid: userId,
      jenis_plan: isPro || isProPlus ? (isProPlus ? 2 : 1) : 0,
      note_plan: `${isProPlus ? "pro+ business" : isPro ? "pro business" : "free trial"} - free trial`,
      datetime_payment: nowMs,
      datetime_expired: expiredMs,
      request_budget: 300,
      status: "active",
      base_price: basePrice,
      discount: discount,
      price: price,
    };

    const { data: inserted, error: insertError } = await supabase
      .from("tb_payment")
      .insert(newPayment)
      .select()
      .maybeSingle();

    if (insertError) {
      // Could happen if another process inserted concurrently (unique constraint on uid)
      console.warn("[ensureUserPayment] Insert error (likely concurrent insert):", insertError.message);
      const { data: refetched } = await supabase
        .from("tb_payment")
        .select("*")
        .eq("uid", userId)
        .maybeSingle();
      return refetched || newPayment;
    }

    return inserted || newPayment;
  } catch (err) {
    console.error("[ensureUserPayment] Unexpected error:", err);
    return null;
  }
}
