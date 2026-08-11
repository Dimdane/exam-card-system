import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

function createSessionToken(adminId: string) {
  const secret =
    process.env.AUTH_SECRET ||
    "smk-ekonomika-exam-card-secret";

  const timestamp = Date.now().toString();

  const payload = `${adminId}.${timestamp}`;

  const signature = crypto
    .createHmac("sha256", secret)
    .update(payload)
    .digest("hex");

  return `${payload}.${signature}`;
}

export async function POST(
  request: Request
) {
  try {
    const body = await request.json();

    const username =
      body.username?.trim();

    const password =
      body.password;

    if (!username || !password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username dan password wajib diisi.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // CARI ADMIN
    // =====================================================

    const {
      data: admin,
      error,
    } = await supabaseAdmin
      .from("admins")
      .select(`
        id,
        username,
        password,
        full_name,
        role,
        is_active
      `)
      .eq("username", username)
      .maybeSingle();

    if (error) {
      console.error(
        "Login database error:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Terjadi kesalahan saat mengakses database.",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // ADMIN TIDAK DITEMUKAN
    // =====================================================

    if (!admin) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username atau password salah.",
        },
        { status: 401 }
      );
    }

    // =====================================================
    // CEK STATUS ADMIN
    // =====================================================

    if (admin.is_active === false) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Akun admin tidak aktif.",
        },
        { status: 403 }
      );
    }

    // =====================================================
    // CEK PASSWORD
    // =====================================================

    if (password !== admin.password) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Username atau password salah.",
        },
        { status: 401 }
      );
    }

    // =====================================================
    // BUAT SESSION
    // =====================================================

    const sessionToken =
      createSessionToken(admin.id);

    const response =
      NextResponse.json({
        success: true,
        message: "Login berhasil.",
        data: {
          id: admin.id,
          username: admin.username,
          full_name: admin.full_name,
          role: admin.role,
        },
      });

    // =====================================================
    // COOKIE SESSION
    // =====================================================

    response.cookies.set(
      "admin_session",
      sessionToken,
      {
        httpOnly: true,
        secure:
          process.env.NODE_ENV ===
          "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 8,
      }
    );

    return response;
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}