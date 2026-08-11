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

    if (error) {
      console.error(
        "Gagal mencari siswa:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message: "Terjadi kesalahan saat mencari data.",
        },
        { status: 500 }
      );
    }

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

    const kelas = data.classes;

    const className = kelas
      ? `${kelas.grade} ${
          kelas.majors?.code ?? ""
        } ${kelas.class_number}`
      : "-";

    return NextResponse.json({
      success: true,
      data: {
        id: data.id,
        nis: data.nis,
        nisn: data.nisn,
        full_name: data.full_name,
        status_kartu: data.status_kartu,
        class_name: className,
      },
    });
  } catch (error) {
    console.error(error);

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