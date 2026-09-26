import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getSupabase() {
  return createClient(supabaseUrl, supabaseAnonKey);
}

// Verify operator authorization dynamically from tb_operator database
async function verifyOperator(request, supabase) {
  const emailHeader = request.headers.get("x-operator-email");

  if (!emailHeader) {
    return { authorized: false, message: "Header otentikasi operator tidak ditemukan." };
  }

  const email = emailHeader.trim().toLowerCase();

  // Dynamic Whitelist check in tb_operator table (no hardcode)
  const { data: operator, error } = await supabase
    .from("tb_operator")
    .select("email, name, role")
    .ilike("email", email)
    .maybeSingle();

  if (error || !operator) {
    return {
      authorized: false,
      message: "Akses ditolak: Email operator tidak terdaftar dalam database.",
    };
  }

  return { authorized: true, operator };
}

// GET: Fetch all tb_payment records with optional search & filter
export async function GET(request) {
  try {
    const supabase = getSupabase();
    const authCheck = await verifyOperator(request, supabase);

    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const searchQuery = searchParams.get("q") || "";
    const statusFilter = searchParams.get("status") || "all";
    const planFilter = searchParams.get("plan");

    // Fetch payments via RPC get_operator_payments() to include user_email and user_name
    const { data: payments, error } = await supabase.rpc("get_operator_payments");

    if (error) {
      console.error("[Operator Payments GET] RPC Error:", error.message);
      // Fallback direct table select if RPC has issue
      const { data: directPayments, error: directError } = await supabase
        .from("tb_payment")
        .select("*");

      if (directError) {
        return NextResponse.json(
          { success: false, message: directError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: directPayments || [],
        total: (directPayments || []).length,
      });
    }

    let results = payments || [];

    // Filter by status
    if (statusFilter && statusFilter !== "all") {
      results = results.filter((p) => (p.status || "").toLowerCase() === statusFilter.toLowerCase());
    }

    // Filter by plan
    if (planFilter !== null && planFilter !== undefined && planFilter !== "" && planFilter !== "all") {
      results = results.filter((p) => String(p.jenis_plan) === String(planFilter));
    }

    // Filter by search query (UID, email, name, note)
    if (searchQuery.trim()) {
      const qLower = searchQuery.trim().toLowerCase();
      results = results.filter((p) => {
        const uidMatch = (p.uid || "").toLowerCase().includes(qLower);
        const emailMatch = (p.user_email || "").toLowerCase().includes(qLower);
        const nameMatch = (p.user_name || "").toLowerCase().includes(qLower);
        const noteMatch = (p.note_plan || "").toLowerCase().includes(qLower);
        return uidMatch || emailMatch || nameMatch || noteMatch;
      });
    }

    const limitParam = searchParams.get("limit");
    const offsetParam = searchParams.get("offset");
    const total = results.length;
    let paginatedResults = results;

    if (limitParam !== null && limitParam !== undefined) {
      const limit = parseInt(limitParam, 10);
      const offset = offsetParam ? parseInt(offsetParam, 10) : 0;
      if (!isNaN(limit) && limit > 0) {
        paginatedResults = results.slice(offset, offset + limit);
      }
    }

    return NextResponse.json({
      success: true,
      data: paginatedResults,
      total,
      count: paginatedResults.length,
    });
  } catch (err) {
    console.error("[Operator Payments GET] Server error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}

// PUT: Update / Approve a tb_payment record
export async function PUT(request) {
  try {
    const supabase = getSupabase();
    const authCheck = await verifyOperator(request, supabase);

    if (!authCheck.authorized) {
      return NextResponse.json(
        { success: false, message: authCheck.message },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      uid,
      jenis_plan,
      datetime_payment,
      datetime_expired,
      request_budget,
      status,
      note_plan,
      base_price,
      discount,
      price,
      business_requirement,
    } = body;

    if (!uid) {
      return NextResponse.json(
        { success: false, message: "Field UID wajib diisi." },
        { status: 400 }
      );
    }

    // Safely parse parameters so null, 0, or empty string are handled correctly
    const expMs =
      datetime_expired !== undefined && datetime_expired !== null && datetime_expired !== ""
        ? Number(datetime_expired)
        : null;
    const parsedExpired = expMs !== null && !isNaN(expMs) && expMs > 0 ? expMs : null;

    const payMs =
      datetime_payment !== undefined && datetime_payment !== null && datetime_payment !== ""
        ? Number(datetime_payment)
        : null;
    const parsedPayment = payMs !== null && !isNaN(payMs) && payMs > 0 ? payMs : null;

    const budgetNum =
      request_budget !== undefined && request_budget !== null && request_budget !== ""
        ? Number(request_budget)
        : null;
    const parsedBudget = budgetNum !== null && !isNaN(budgetNum) && budgetNum >= 0 ? budgetNum : null;

    const parsedPlan =
      jenis_plan !== undefined && jenis_plan !== null && !isNaN(Number(jenis_plan))
        ? Number(jenis_plan)
        : null;

    const parsedBasePrice =
      base_price !== undefined && base_price !== null && !isNaN(Number(base_price))
        ? Number(base_price)
        : null;

    const parsedDiscount =
      discount !== undefined && discount !== null && !isNaN(Number(discount))
        ? Number(discount)
        : null;

    const parsedPrice =
      price !== undefined && price !== null && !isNaN(Number(price))
        ? Number(price)
        : null;

    const parsedStatus =
      status !== undefined && status !== null ? String(status).toLowerCase() : null;

    const parsedNote =
      note_plan !== undefined && note_plan !== null ? String(note_plan) : null;

    const parsedBusinessRequirement =
      business_requirement !== undefined
        ? business_requirement !== null
          ? String(business_requirement)
          : ""
        : null;

    // Update atomically using RPC update_operator_payment (SECURITY DEFINER)
    const { data: updated, error } = await supabase.rpc("update_operator_payment", {
      p_uid: uid,
      p_jenis_plan: parsedPlan,
      p_note_plan: parsedNote,
      p_datetime_payment: parsedPayment,
      p_datetime_expired: parsedExpired,
      p_request_budget: parsedBudget,
      p_status: parsedStatus,
      p_base_price: parsedBasePrice,
      p_discount: parsedDiscount,
      p_price: parsedPrice,
      p_business_requirement: parsedBusinessRequirement,
    });

    if (error) {
      console.error("[Operator Payments PUT] RPC Error:", error.message);
      return NextResponse.json(
        { success: false, message: `Gagal memperbarui data: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: updated,
      message: "Data langganan berhasil diperbarui.",
    });
  } catch (err) {
    console.error("[Operator Payments PUT] Server error:", err);
    return NextResponse.json(
      { success: false, message: "Internal server error." },
      { status: 500 }
    );
  }
}
