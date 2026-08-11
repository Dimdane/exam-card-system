import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("students")
      .select(`
        id,
        nis,
        nisn,
        full_name,
        is_active,
        status_kartu,
        classes (
          grade,
          class_number,
          majors (
            code
          )
        )
      `)
      .order("full_name", {
        ascending: true,
      });

    if (error) {
      console.error("Gagal mengambil status kartu:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      data: data ?? [],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data status kartu.",
      },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();

    const { id, status_kartu } = body;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID siswa tidak ditemukan.",
        },
        { status: 400 }
      );
    }

    if (!["BELUM", "SIAP"].includes(status_kartu)) {
      return NextResponse.json(
        {
          success: false,
          message: "Status kartu tidak valid.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("students")
      .update({
        status_kartu,
      })
      .eq("id", id)
      .select("id, status_kartu")
      .single();

    if (error) {
      console.error("Gagal mengubah status:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Status kartu berhasil diperbarui.",
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}