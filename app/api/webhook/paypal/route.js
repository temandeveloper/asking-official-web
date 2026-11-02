import { NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import {
  sendLicenseDeliveryEmail,
  sendTopUpConfirmationEmail,
} from "@/lib/email/licenseMailer";

/**
 * Returns the PayPal API Base URL based on environment.
 */
function getPayPalBaseUrl() {
  const mode = (process.env.PAYPAL_MODE || "live").trim().toLowerCase();
  return mode === "sandbox"
    ? "https://api-m.sandbox.paypal.com"
    : "https://api-m.paypal.com";
}

/**
 * Returns the PayPal IPN validation URL based on environment.
 */
function getPayPalIpnUrl() {
  const mode = (process.env.PAYPAL_MODE || "live").trim().toLowerCase();
  return mode === "sandbox"
    ? "https://ipnpb.sandbox.paypal.com/cgi-bin/webscr"
    : "https://ipnpb.paypal.com/cgi-bin/webscr";
}

/**
 * Retrieves a PayPal OAuth2 Access Token using Client ID and Secret.
 */
async function getPayPalAccessToken() {
  const clientId = process.env.PAYPAL_CLIENT_ID?.trim();
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET?.trim();

  if (!clientId || !clientSecret) {
    return null;
  }

  try {
    const authString = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
    const response = await fetch(`${getPayPalBaseUrl()}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: `Basic ${authString}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[PayPal Webhook] Failed to fetch PayPal OAuth token:", errorText);
      return null;
    }

    const data = await response.json();
    return data.access_token || null;
  } catch (err) {
    console.error("[PayPal Webhook] Exception fetching PayPal OAuth token:", err);
    return null;
  }
}

/**
 * Validates the PayPal webhook signature via PayPal's official REST API endpoint.
 * Documentation: https://developer.paypal.com/docs/api/webhooks/v1/#verify-webhook-signature
 */
async function verifyPayPalWebhookSignature(request, rawBody, webhookId) {
  const authAlgo = request.headers.get("paypal-auth-algo");
  const certUrl = request.headers.get("paypal-cert-url");
  const transmissionId = request.headers.get("paypal-transmission-id");
  const transmissionSig = request.headers.get("paypal-transmission-sig");
  const transmissionTime = request.headers.get("paypal-transmission-time");

  // In development or if webhookId is not yet configured, allow bypass with warning
  if (!webhookId || !authAlgo || !transmissionSig) {
    if (process.env.NODE_ENV === "production" && webhookId) {
      return false;
    }
    console.warn(
      "[PayPal Webhook] ⚠️ DEV MODE: Signature verification bypassed (missing headers or PAYPAL_WEBHOOK_ID)."
    );
    return true;
  }

  const accessToken = await getPayPalAccessToken();
  if (!accessToken) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[PayPal Webhook] CRITICAL: Cannot verify signature because PayPal access token could not be obtained."
      );
      return false;
    }
    return true;
  }

  try {
    let parsedBody;
    try {
      parsedBody = JSON.parse(rawBody);
    } catch {
      return false;
    }

    const verificationPayload = {
      auth_algo: authAlgo,
      cert_url: certUrl,
      transmission_id: transmissionId,
      transmission_sig: transmissionSig,
      transmission_time: transmissionTime,
      webhook_id: webhookId,
      webhook_event: parsedBody,
    };

    const verifyRes = await fetch(
      `${getPayPalBaseUrl()}/v1/notifications/verify-webhook-signature`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(verificationPayload),
      }
    );

    if (!verifyRes.ok) {
      const errText = await verifyRes.text();
      console.warn("[PayPal Webhook] Verify endpoint returned error:", errText);
      return false;
    }

    const verifyData = await verifyRes.json();
    return verifyData.verification_status === "SUCCESS";
  } catch (err) {
    console.error("[PayPal Webhook] Signature verification exception:", err);
    return false;
  }
}

/**
 * Validates a legacy PayPal IPN (Instant Payment Notification) message.
 */
async function verifyPayPalIpn(rawBody) {
  try {
    const verificationBody = `cmd=_notify-validate&${rawBody}`;
    const res = await fetch(getPayPalIpnUrl(), {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "User-Agent": "AsKing-PayPal-IPN-Verifier",
      },
      body: verificationBody,
    });

    const text = await res.text();
    return text.trim() === "VERIFIED";
  } catch (err) {
    console.error("[PayPal IPN] Verification error:", err);
    return false;
  }
}

/**
 * Fetches order details from PayPal Orders API v2 to enrich customer information
 * (e.g., when PAYMENT.CAPTURE.COMPLETED does not include the full payer object).
 */
async function fetchPayPalOrderDetails(orderId, accessToken) {
  if (!orderId || !accessToken) return null;

  try {
    const res = await fetch(`${getPayPalBaseUrl()}/v2/checkout/orders/${orderId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) {
      console.warn(`[PayPal Webhook] Unable to fetch order ${orderId}:`, res.status);
      return null;
    }

    return await res.json();
  } catch (err) {
    console.error(`[PayPal Webhook] Error fetching order ${orderId}:`, err);
    return null;
  }
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
 * Shared execution core for both REST Webhook and IPN payments
 */
async function processSuccessfulPayment({
  refId,
  captureId,
  orderId,
  customerEmail,
  customerName,
  amountValue,
  currency,
  rawPayload,
  isTopUpOrder,
  topUpQty = 1,
  source = "paypal",
}) {
  const supabase = getAdminSupabase();
  const cleanEmail = customerEmail.trim().toLowerCase();

  // =========================================================================
  // FLOW A: TOP UP AI CREDIT
  // =========================================================================
  if (isTopUpOrder) {
    const creditsPerPack = Number(process.env.TOPUP_AI_CREDITS_PER_PACK) || 1500;
    const creditsToAdd = topUpQty * creditsPerPack;

    console.log(
      `[PayPal TopUp] Processing Top Up AI Credit for ${cleanEmail}: ${creditsToAdd} credits (${topUpQty} pack(s)), refId: ${refId}`
    );

    let targetPayment = null;
    let targetUid = null;

    const { data: payByEmail } = await supabase
      .from("tb_payment")
      .select("id, uid, user_email, request_budget, payment_payload, activation_code, status")
      .ilike("user_email", cleanEmail)
      .maybeSingle();

    if (payByEmail) {
      targetPayment = payByEmail;
      targetUid = payByEmail.uid;
    }

    if (!targetPayment) {
      let page = 1;
      while (!targetUid && page <= 5) {
        const { data: listRes } = await supabase.auth.admin.listUsers({ page, perPage: 100 });
        const users = listRes?.users || [];
        if (users.length === 0) break;
        const foundAuthUser = users.find((u) => u.email?.trim().toLowerCase() === cleanEmail);
        if (foundAuthUser) {
          targetUid = foundAuthUser.id;
          const { data: payByUid } = await supabase
            .from("tb_payment")
            .select("id, uid, user_email, request_budget, payment_payload, activation_code, status")
            .eq("uid", targetUid)
            .maybeSingle();
          if (payByUid) {
            targetPayment = payByUid;
          }
          break;
        }
        page++;
      }
    }

    if (!targetPayment || !targetUid) {
      console.warn(
        `[PayPal TopUp] ⚠️ User with email ${cleanEmail} not found. RefId: ${refId}. Marked as pending_account.`
      );
      return NextResponse.json({
        success: true,
        status: "pending_account",
        message: `Akun dengan email ${cleanEmail} belum terdaftar di AsKing. Top up (${creditsToAdd} kredit) dicatat dengan status pending_account.`,
        ref_id: refId,
        customer_email: cleanEmail,
        credits_pending: creditsToAdd,
      });
    }

    const currentPayload =
      targetPayment.payment_payload && typeof targetPayment.payment_payload === "object"
        ? targetPayment.payment_payload
        : {};
    const topupHistory = Array.isArray(currentPayload.topup_history)
      ? currentPayload.topup_history
      : [];

    const alreadyProcessed = topupHistory.find(
      (entry) => entry.refId === refId || entry.paypalCaptureId === captureId
    );

    if (alreadyProcessed) {
      console.log(
        `[PayPal TopUp] Transaction with refId ${refId} already processed for user ${targetUid} (idempotent).`
      );
      return NextResponse.json({
        success: true,
        message: "Top up already processed (idempotent).",
        type: "topup",
        user_id: targetUid,
        ref_id: refId,
        current_budget: targetPayment.request_budget,
      });
    }

    const currentBudget = Math.max(0, Number(targetPayment.request_budget) || 0);
    const newBudget = currentBudget + creditsToAdd;

    const newHistoryEntry = {
      refId,
      paypalCaptureId: captureId,
      paypalOrderId: orderId,
      timestamp: Date.now(),
      isoDate: new Date().toISOString(),
      qty: topUpQty,
      creditsAdded: creditsToAdd,
      previousBudget: currentBudget,
      newBudget,
      amountPaid: Number(amountValue) || 0,
      currency,
      source,
    };

    const updatedPayload = {
      ...currentPayload,
      topup_history: [...topupHistory, newHistoryEntry],
      last_topup_refId: refId,
      last_topup_at: newHistoryEntry.isoDate,
    };

    const { error: updateError } = await supabase
      .from("tb_payment")
      .update({
        request_budget: newBudget,
        payment_payload: updatedPayload,
        datetime_payment: Date.now(),
        updated_at: new Date().toISOString(),
      })
      .eq("uid", targetUid);

    if (updateError) {
      console.error("[PayPal TopUp] ❌ Failed to update request_budget:", updateError);
      return NextResponse.json(
        {
          success: false,
          message: "Failed to persist updated request_budget.",
          error: updateError.message,
        },
        { status: 500 }
      );
    }

    console.log(
      `[PayPal TopUp] ✅ Successfully added ${creditsToAdd} credits to user ${targetUid} (${cleanEmail}). New balance: ${newBudget}`
    );

    let emailResult = { sent: false };
    try {
      emailResult = await sendTopUpConfirmationEmail({
        customerEmail: cleanEmail,
        customerName,
        creditsAdded,
        newTotalCredits: newBudget,
        refId,
      });
    } catch (emailErr) {
      console.error("[PayPal TopUp] Email sending exception:", emailErr);
      emailResult = { sent: false, error: emailErr.message };
    }

    return NextResponse.json({
      success: true,
      message: "AI credit top up completed successfully via PayPal.",
      type: "topup",
      user_id: targetUid,
      customer_email: cleanEmail,
      credits_added: creditsToAdd,
      previous_balance: currentBudget,
      new_balance: newBudget,
      ref_id: refId,
      email_sent: Boolean(emailResult?.sent),
      email_message_id: emailResult?.messageId || null,
    });
  }

  // =========================================================================
  // FLOW B: PRODUCT ACTIVATION LICENSE
  // =========================================================================
  const { data: existingPaymentRecord } = await supabase
    .from("tb_payment")
    .select("id, uid, activation_code, status, payment_payload")
    .ilike("user_email", cleanEmail)
    .maybeSingle();

  if (
    existingPaymentRecord?.payment_payload?.paypal_ref_id === refId ||
    existingPaymentRecord?.payment_payload?.resource?.id === refId ||
    existingPaymentRecord?.payment_payload?.txn_id === refId ||
    existingPaymentRecord?.payment_payload?.id === refId
  ) {
    console.log(
      `[PayPal Webhook] Transaction with refId ${refId} already processed (idempotent).`
    );
    return NextResponse.json({
      success: true,
      message: "Webhook already processed (idempotent).",
      activation_code: existingPaymentRecord.activation_code,
    });
  }

  const activationCode = generateActivationCode();
  console.log(`[PayPal] Generated activation code: ${activationCode} for ${cleanEmail}`);

  const { user: authUser, isNew } = await getOrCreateSupabaseUser(
    supabase,
    cleanEmail,
    activationCode,
    {
      full_name: customerName || "",
      source: `${source}_checkout`,
    }
  );

  console.log(
    `[PayPal] Supabase Auth User ID: ${authUser.id} (${isNew ? "New User Created" : "Existing User Updated"})`
  );

  const nowMs = Date.now();
  const enrichedPayload = {
    ...(typeof rawPayload === "object" ? rawPayload : { raw: rawPayload }),
    paypal_ref_id: refId,
    paypal_capture_id: captureId,
    paypal_order_id: orderId,
    source,
  };

  const paymentData = {
    uid: authUser.id,
    activation_code: activationCode,
    deviceid: null,
    payment_payload: enrichedPayload,
    request_budget: 1500, // 1,500 initial AI credits for new license
    jenis_plan: 2, // 2 = Pro+ Business (Lifetime / Sekali Bayar)
    note_plan: `Lisensi Sekali Bayar (PayPal ${currency} ${amountValue})`,
    status: "active",
    base_price: 1240000,
    discount: 88,
    price: Number(amountValue) || 145000,
    user_email: cleanEmail,
    user_name: customerName || null,
    datetime_payment: nowMs,
    datetime_expired: null, // Lifetime
    business_requirement: `PayPal Ref: ${refId} | Currency: ${currency}`,
    updated_at: new Date().toISOString(),
  };

  const { data: savedPayment, error: saveError } = await supabase
    .from("tb_payment")
    .upsert(paymentData, { onConflict: "uid" })
    .select("id, uid, activation_code, status, request_budget, note_plan")
    .single();

  if (saveError) {
    console.error("[PayPal] ❌ Failed to save tb_payment record:", saveError);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to persist payment record.",
        error: saveError.message,
      },
      { status: 500 }
    );
  }

  console.log(
    `[PayPal] ✅ tb_payment saved for user ${authUser.id}:`,
    savedPayment.activation_code
  );

  let emailResult = { sent: false };
  try {
    emailResult = await sendLicenseDeliveryEmail({
      customerEmail: cleanEmail,
      customerName,
      activationCode,
      language: "en",
      paymentProvider: "paypal",
      transactionId: refId || captureId || orderId,
    });
    console.log(
      `[PayPal] Email dispatch result for ${cleanEmail}:`,
      emailResult?.sent ? "SUCCESS" : "FAILED",
      emailResult?.messageId || emailResult?.error || ""
    );
  } catch (emailErr) {
    console.error("[PayPal] Email sending exception:", emailErr);
    emailResult = { sent: false, error: emailErr.message };
  }

  return NextResponse.json({
    success: true,
    message: "License generated, user registered, and payment record created via PayPal.",
    activation_code: activationCode,
    user_id: authUser.id,
    is_new_user: isNew,
    email_sent: Boolean(emailResult?.sent),
    email_message_id: emailResult?.messageId || null,
    ref_id: refId,
  });
}

/**
 * Webhook handler for PayPal Payment Links, Hosted Buttons, & IPN notifications
 * Endpoint: POST /api/webhook/paypal
 */
export async function POST(request) {
  try {
    const contentType = request.headers.get("content-type") || "";
    const rawBody = await request.text();

    // =========================================================================
    // HANDLER 1: LEGACY IPN NOTIFICATION (Form-UrlEncoded)
    // =========================================================================
    if (contentType.includes("application/x-www-form-urlencoded")) {
      console.log("[PayPal IPN] Incoming IPN notification received.");

      const isVerified = await verifyPayPalIpn(rawBody);
      if (!isVerified) {
        console.warn("[PayPal IPN] ❌ IPN verification failed.");
        return new NextResponse("IPN Verification Failed", { status: 400 });
      }

      const params = new URLSearchParams(rawBody);
      const paymentStatus = params.get("payment_status");
      const txnType = params.get("txn_type");

      // Only handle completed payments
      if (paymentStatus !== "Completed") {
        console.log(`[PayPal IPN] Ignored status: ${paymentStatus} (${txnType})`);
        return new NextResponse("IPN status ignored", { status: 200 });
      }

      const txnId = params.get("txn_id");
      const payerEmail = params.get("payer_email");
      const firstName = params.get("first_name") || "";
      const lastName = params.get("last_name") || "";
      const fullName = [firstName, lastName].filter(Boolean).join(" ");
      const mcGross = params.get("mc_gross") || "0";
      const mcCurrency = params.get("mc_currency") || "USD";
      const itemName = (params.get("item_name") || "").toLowerCase();

      const isTopUpOrder =
        itemName.includes("top up") ||
        itemName.includes("topup") ||
        itemName.includes("ai credit");

      return await processSuccessfulPayment({
        refId: txnId,
        captureId: txnId,
        orderId: params.get("parent_txn_id") || null,
        customerEmail: payerEmail,
        customerName: fullName,
        amountValue: mcGross,
        currency: mcCurrency,
        rawPayload: Object.fromEntries(params.entries()),
        isTopUpOrder,
        topUpQty: Number(params.get("quantity")) || 1,
        source: "paypal_ipn",
      });
    }

    // =========================================================================
    // HANDLER 2: MODERN REST WEBHOOK (JSON Payload)
    // =========================================================================
    let payload;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid JSON payload" },
        { status: 400 }
      );
    }

    const { event_type: eventType, resource } = payload || {};

    if (!eventType || !resource) {
      return NextResponse.json(
        { success: false, message: "Payload does not contain valid event_type or resource." },
        { status: 400 }
      );
    }

    // 1. Signature Verification
    const webhookId = process.env.PAYPAL_WEBHOOK_ID?.trim();
    if (process.env.NODE_ENV === "production" && webhookId) {
      const isValid = await verifyPayPalWebhookSignature(request, rawBody, webhookId);
      if (!isValid) {
        console.warn(`[PayPal Webhook] ❌ Invalid signature for event: ${payload.id}`);
        return NextResponse.json(
          { success: false, message: "Invalid PayPal webhook signature" },
          { status: 401 }
        );
      }
    } else {
      console.log(`[PayPal Webhook] Processing event: ${eventType} (ID: ${payload.id})`);
    }

    // 2. Supported event types
    const supportedEvents = [
      "PAYMENT.CAPTURE.COMPLETED",
      "CHECKOUT.ORDER.COMPLETED",
      "CHECKOUT.ORDER.APPROVED",
      "PAYMENT.SALE.COMPLETED",
    ];

    if (!supportedEvents.includes(eventType)) {
      console.log(`[PayPal Webhook] Ignored non-payment event: ${eventType}`);
      return NextResponse.json({
        success: true,
        message: `Event received but ignored (${eventType}).`,
      });
    }

    // 3. Extract transaction IDs
    const captureId = resource.id;
    const relatedOrderId =
      resource.supplementary_data?.related_ids?.order_id ||
      (payload.resource_type === "order" ? resource.id : null);
    const refId = captureId || relatedOrderId || payload.id;

    // 4. Resolve customer email, name, and purchase amount
    let customerEmail =
      resource.payer?.email_address ||
      resource.subscriber?.email_address ||
      resource.custom_id;

    let customerName = "";
    if (resource.payer?.name) {
      const { given_name, surname } = resource.payer.name;
      customerName = [given_name, surname].filter(Boolean).join(" ");
    }

    let orderDetails = null;
    if (!customerEmail && relatedOrderId) {
      const accessToken = await getPayPalAccessToken();
      if (accessToken) {
        orderDetails = await fetchPayPalOrderDetails(relatedOrderId, accessToken);
        if (orderDetails?.payer) {
          customerEmail = orderDetails.payer.email_address;
          if (!customerName && orderDetails.payer.name) {
            const { given_name, surname } = orderDetails.payer.name;
            customerName = [given_name, surname].filter(Boolean).join(" ");
          }
        }
      }
    }

    customerEmail = customerEmail?.trim()?.toLowerCase();

    if (!customerEmail) {
      console.error(
        `[PayPal Webhook] ❌ Unable to extract customer email for refId: ${refId}. OrderId: ${relatedOrderId}`
      );
      return NextResponse.json(
        {
          success: false,
          message: "Unable to extract customer email from PayPal payload or Orders API.",
          ref_id: refId,
        },
        { status: 400 }
      );
    }

    const amountValue =
      resource.amount?.value ||
      orderDetails?.purchase_units?.[0]?.amount?.value ||
      0;
    const currency =
      resource.amount?.currency_code ||
      orderDetails?.purchase_units?.[0]?.amount?.currency_code ||
      "USD";

    const items =
      resource.purchase_units?.[0]?.items ||
      orderDetails?.purchase_units?.[0]?.items ||
      [];
    const description = (
      resource.description ||
      resource.custom_id ||
      orderDetails?.purchase_units?.[0]?.description ||
      ""
    ).toLowerCase();

    let topUpQty = 0;
    for (const item of items) {
      const title = (item.name || "").trim().toLowerCase();
      if (
        title.includes("top up ai credit") ||
        title.includes("topup ai credit") ||
        title.includes("ai credit")
      ) {
        topUpQty += Number(item.quantity) || 1;
      }
    }

    if (topUpQty === 0 && (description.includes("top up") || description.includes("topup"))) {
      topUpQty = 1;
    }

    return await processSuccessfulPayment({
      refId,
      captureId,
      orderId: relatedOrderId,
      customerEmail,
      customerName,
      amountValue,
      currency,
      rawPayload: payload,
      isTopUpOrder: topUpQty > 0,
      topUpQty,
      source: "paypal_webhook",
    });
  } catch (error) {
    console.error("[PayPal Webhook] Uncaught handler error:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error processing PayPal webhook.",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
