import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get("keyword");

    if (!keyword || !keyword.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Silakan masukkan NIS atau NISN.",
        },
        { status: 400 }
      );
    }

    const search = keyword.trim();

    // =====================================================
    // CARI SISWA BERDASARKAN NIS / NISN
    // =====================================================

    const { data, error } = await supabaseAdmin
      .from("students")
      .select(`
        id,
        nis,
        nisn,
        full_name,
        status_kartu,
        classes (
          grade,
          class_number,
          majors (
            code,
            name
          )
        )
      `)
      .or(`nis.eq.${search},nisn.eq.${search}`)
      .maybeSingle();

    // =====================================================
    // ERROR DATABASE
    // =====================================================

    if (error) {
      console.error(
        "Gagal mencari siswa:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Terjadi kesalahan saat mencari data.",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // SISWA TIDAK DITEMUKAN
    // =====================================================

    if (!data) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Data siswa tidak ditemukan. Silakan periksa kembali NIS/NISN Anda.",
        },
        { status: 404 }
      );
    }

    // =====================================================
    // FORMAT DATA KELAS
    // =====================================================

    const kelas = Array.isArray(data.classes)
      ? data.classes[0]
      : data.classes;

    const major = Array.isArray(kelas?.majors)
      ? kelas.majors[0]
      : kelas?.majors;

    const className = kelas
      ? `${kelas.grade ?? ""} ${
          major?.code ?? ""
        } ${kelas.class_number ?? ""}`.trim()
      : "-";

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      data: {
        id: data.id,

        nis: data.nis,

        nisn: data.nisn,

        full_name: data.full_name,

        status_kartu: data.status_kartu,

        class_name: className,

        major_name: major?.name ?? "",
      },
    });
  } catch (error) {
    console.error(
      "Check Card API Error:",
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