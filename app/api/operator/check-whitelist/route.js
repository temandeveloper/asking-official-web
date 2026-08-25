import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  try {
    const body = await request.json();
    const rawEmail = body?.email;

    if (!rawEmail || typeof rawEmail !== "string") {
      return NextResponse.json(
        { authorized: false, message: "Email operator wajib diisi." },
        { status: 400 }
      );
    }

    const email = rawEmail.trim().toLowerCase();

    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { authorized: false, message: "Konfigurasi Supabase tidak ditemukan di server." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Query tb_operator table dynamically from database (tanpa hardcode)
    const { data: operator, error } = await supabase
      .from("tb_operator")
      .select("id, email, name, role")
      .ilike("email", email)
      .maybeSingle();

    if (error) {
      console.error("[Operator Whitelist Check] Database query error:", error.message);
      return NextResponse.json(
        { authorized: false, message: "Gagal memeriksa database operator: " + error.message },
        { status: 500 }
      );
    }

    if (!operator) {
      return NextResponse.json(
        { authorized: false, message: "Akses ditolak: Email tidak terdaftar dalam database operator AsKing." },
        { status: 403 }
      );
    }

    return NextResponse.json({
      authorized: true,
      operator,
    });
  } catch (err) {
    console.error("[Operator Check] Uncaught error:", err);
    return NextResponse.json(
      { authorized: false, message: "Terjadi kesalahan internal server." },
      { status: 500 }
    );
  }
}
