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

    return NextResponse.json({
      success: true,
      data: results,
      total: results.length,
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
    } = body;

    if (!uid) {
      return NextResponse.json(
        { success: false, message: "Field UID wajib diisi." },
        { status: 400 }
      );
    }

    // Update using RPC update_operator_payment
    const { data: updated, error } = await supabase.rpc("update_operator_payment", {
      p_uid: uid,
      p_jenis_plan: jenis_plan !== undefined ? Number(jenis_plan) : null,
      p_note_plan: note_plan !== undefined ? String(note_plan) : null,
      p_datetime_payment: datetime_payment !== undefined ? Number(datetime_payment) : null,
      p_datetime_expired: datetime_expired !== undefined ? Number(datetime_expired) : null,
      p_request_budget: request_budget !== undefined ? Number(request_budget) : null,
      p_status: status !== undefined ? String(status).toLowerCase() : null,
    });

    if (error) {
      console.error("[Operator Payments PUT] Error:", error.message);
      // Fallback direct update
      const { data: fallbackUpdated, error: fallbackError } = await supabase
        .from("tb_payment")
        .update({
          jenis_plan: Number(jenis_plan),
          datetime_payment: Number(datetime_payment),
          datetime_expired: Number(datetime_expired),
          request_budget: Number(request_budget),
          status: String(status).toLowerCase(),
          note_plan: String(note_plan),
          updated_at: new Date().toISOString(),
        })
        .eq("uid", uid)
        .select()
        .maybeSingle();

      if (fallbackError) {
        return NextResponse.json(
          { success: false, message: fallbackError.message },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        data: fallbackUpdated,
        message: "Data langganan berhasil diperbarui.",
      });
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
