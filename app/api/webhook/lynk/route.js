import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendLicenseDeliveryEmail } from "@/lib/email/licenseMailer";

/**
 * Validates the Lynk.id webhook signature using HMAC-SHA256 / SHA256 string hash.
 * Formula per Lynk.id Documentation:
 * signatureString = amount + ref_id + message_id + secret_key
 * calculatedSignature = sha256(signatureString)
 */
function validateLynkSignature(refId, amount, messageId, receivedSignature, secretKey) {
  if (!secretKey) return false;
  if (!receivedSignature) return false;

  const signatureString = `${amount}${refId}${messageId}${secretKey}`;
  const calculatedSignature = crypto
    .createHash("sha256")
    .update(signatureString, "utf8")
    .digest("hex");

  const calculatedBuf = Buffer.from(calculatedSignature, "utf8");
  const receivedBuf = Buffer.from(receivedSignature, "utf8");

  if (calculatedBuf.length !== receivedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(calculatedBuf, receivedBuf);
}

/**
 * Generates an unambiguous, easy-to-read activation code formatted as:
 * ASK-XXXX-XXXX-XXXX (e.g. ASK-8F2K-9X4M-7P2W).
 * Uses 31 unambiguous uppercase alphanumeric characters (no 0, O, 1, I, L).
 */
function generateActivationCode() {
  const chars = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
  const segment = (len) => {
    let res = "";
    const bytes = crypto.randomBytes(len);
    for (let i = 0; i < len; i++) {
      res += chars[bytes[i] % chars.length];
    }
    return res;
  };
  return `ASK-${segment(4)}-${segment(4)}-${segment(4)}`;
}

function getAdminSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !serviceKey) {
    throw new Error("Supabase credentials missing in environment variables.");
  }

  return createClient(supabaseUrl, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

/**
 * Ensures user exists in Supabase Auth (auth.users).
 * If user does not exist: creates user with activationCode as initial password and email_confirm = true.
 * If user exists: updates user password to activationCode so they can login immediately.
 */
async function getOrCreateSupabaseUser(supabase, email, password, metadata = {}) {
  const cleanEmail = email.trim().toLowerCase();

  // 1. Try creating user
  const { data: createData, error: createError } = await supabase.auth.admin.createUser({
    email: cleanEmail,
    password,
    email_confirm: true,
    user_metadata: metadata,
  });

  if (createData?.user) {
    return { user: createData.user, isNew: true };
  }

  // 2. If user already exists, find existing user and update password
  const isEmailTaken =
    createError &&
    (createError.message?.toLowerCase().includes("already") ||
      createError.status === 422 ||
      createError.code === "email_exists");

  if (isEmailTaken) {
    let existingUser = null;
    let page = 1;
    while (!existingUser && page <= 5) {
      const { data: listRes } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
      const users = listRes?.users || [];
      if (users.length === 0) break;
      existingUser = users.find((u) => u.email?.toLowerCase() === cleanEmail);
      page++;
    }

    if (existingUser) {
      const { data: updateData, error: updateError } = await supabase.auth.admin.updateUserById(
        existingUser.id,
        {
          password,
          email_confirm: true,
          user_metadata: { ...existingUser.user_metadata, ...metadata },
        }
      );
      if (updateError) throw updateError;
      return { user: updateData.user, isNew: false };
    }
  }

  throw createError || new Error("Failed to create or update Supabase auth user.");
}

/**
 * Webhook handler for Lynk.id payment notifications
 * Endpoint: POST /api/webhook/lynk
 */
export async function POST(request) {
  try {
    const rawBody = await request.text();
    let payload;

    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { event, data } = payload || {};
    const messageData = data?.message_data;
    const messageId = data?.message_id;
    const refId = messageData?.refId;
    const totals = messageData?.totals || {};
    const grandTotal = totals.grandTotal !== undefined ? totals.grandTotal : totals.totalPrice || 0;
    const customer = messageData?.customer || {};
    const customerEmail = customer.email?.trim();

    if (!refId) {
      return NextResponse.json(
        { success: false, message: "Payload does not contain valid refId." },
        { status: 400 }
      );
    }

    if (!customerEmail) {
      return NextResponse.json(
        { success: false, message: "Customer email is required in Lynk payload." },
        { status: 400 }
      );
    }

    // 1. Signature Verification
    const receivedSignature =
      request.headers.get("x-lynk-signature") ||
      request.headers.get("X-Lynk-Signature");
    const merchantKey = process.env.LYNK_MERCHANT_KEY;

    if (process.env.NODE_ENV === "production" || merchantKey) {
      if (!merchantKey) {
        console.error(
          "[Lynk Webhook] CRITICAL: LYNK_MERCHANT_KEY is not configured in environment variables."
        );
        return NextResponse.json(
          { success: false, message: "Server webhook configuration error." },
          { status: 500 }
        );
      }

      const isValid = validateLynkSignature(
        refId,
        String(grandTotal),
        messageId || "",
        receivedSignature,
        merchantKey
      );

      if (!isValid) {
        console.warn(`[Lynk Webhook] ❌ Invalid signature for refId: ${refId}`);
        return NextResponse.json(
          { success: false, message: "Invalid signature" },
          { status: 401 }
        );
      }
    } else {
      console.warn(
        `[Lynk Webhook] ⚠️ DEV MODE: Bypassing signature verification because LYNK_MERCHANT_KEY is not set.`
      );
    }

    // 2. Only handle successful payment events
    const isPaymentSuccess =
      event === "payment.received" ||
      data?.message_action === "SUCCESS" ||
      data?.message_code === "0";

    if (!isPaymentSuccess) {
      console.log(
        `[Lynk Webhook] Ignored non-payment event: ${event || data?.message_action}`
      );
      return NextResponse.json({
        success: true,
        message: "Event received but ignored (non-successful status).",
      });
    }

    const supabase = getAdminSupabase();

    // 3. Idempotency Check: check if this refId has already been recorded in tb_payment
    const { data: existingRecords } = await supabase
      .from("tb_payment")
      .select("id, uid, activation_code, status, payment_payload")
      .limit(50);

    const alreadyProcessed = existingRecords?.find(
      (r) =>
        r.payment_payload?.data?.message_data?.refId === refId ||
        r.payment_payload?.refId === refId
    );

    if (alreadyProcessed) {
      console.log(
        `[Lynk Webhook] Transaction with refId ${refId} already processed (idempotent).`
      );
      return NextResponse.json({
        success: true,
        message: "Webhook already processed (idempotent).",
        activation_code: alreadyProcessed.activation_code,
      });
    }

    // 4. Generate Unique Activation Code
    const activationCode = generateActivationCode();
    console.log(`[Lynk Webhook] Generated activation code: ${activationCode} for ${customerEmail}`);

    // 5. Register or Update User in Supabase Auth (auth.users)
    const { user: authUser, isNew } = await getOrCreateSupabaseUser(
      supabase,
      customerEmail,
      activationCode,
      {
        full_name: customer.name || "",
        phone: customer.phone || "",
        source: "lynk.id",
      }
    );

    console.log(
      `[Lynk Webhook] Supabase Auth User ID: ${authUser.id} (${isNew ? "New User Created" : "Existing User Updated"})`
    );

    // 6. Create or Update Record in tb_payment with valid NOT NULL uid
    const nowMs = Date.now();
    const paymentData = {
      uid: authUser.id, // Direct foreign key to auth.users(id)
      activation_code: activationCode,
      deviceid: null, // Initial device is unbound; locks to 1st machine on desktop login
      payment_payload: payload,
      request_budget: 1500, // 1,500 AI credits
      jenis_plan: 2, // 2 = Pro+ Business (Lifetime / Sekali Bayar)
      note_plan: "Lisensi Sekali Bayar (Lynk.id)",
      status: "active",
      base_price: 1240000,
      discount: 88,
      price: Number(grandTotal) || 145000,
      user_email: customerEmail,
      user_name: customer.name || null,
      datetime_payment: nowMs,
      datetime_expired: null, // Lifetime (no expiration date)
      business_requirement: customer.phone ? `No. HP Lynk: ${customer.phone}` : null,
      updated_at: new Date().toISOString(),
    };

    // Upsert onConflict "uid" so an existing user's row is promoted to lifetime seamlessly
    const { data: savedPayment, error: saveError } = await supabase
      .from("tb_payment")
      .upsert(paymentData, { onConflict: "uid" })
      .select("id, uid, activation_code, status, request_budget, note_plan")
      .single();

    if (saveError) {
      console.error("[Lynk Webhook] ❌ Failed to save tb_payment record:", saveError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to persist payment record.",
          error: saveError.message,
        },
        { status: 500 }
      );
    }

    console.log(`[Lynk Webhook] ✅ tb_payment saved for user ${authUser.id}:`, savedPayment.activation_code);

    // 7. Send License Delivery Email asynchronously
    sendLicenseDeliveryEmail({
      customerEmail,
      customerName: customer.name,
      activationCode,
    }).catch((emailErr) => {
      console.error("[Lynk Webhook] Background email error:", emailErr);
    });

    return NextResponse.json({
      success: true,
      message: "License generated, user registered, and payment record created.",
      activation_code: activationCode,
      user_id: authUser.id,
      is_new_user: isNew,
    });
  } catch (error) {
    console.error("[Lynk Webhook] Uncaught handler error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error processing webhook.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
