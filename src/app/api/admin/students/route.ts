import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      nis,
      nisn,
      full_name,
      class_id,
      gender,
      birth_place,
      birth_date,
    } = body;

    // Validasi data wajib
    if (!nis || !nisn || !full_name || !class_id) {
      return NextResponse.json(
        {
          success: false,
          message: "NIS, NISN, Nama Lengkap, dan Kelas wajib diisi.",
        },
        { status: 400 }
      );
    }

    // Cek NIS sudah digunakan
    const { data: existingNis } = await supabaseAdmin
      .from("students")
      .select("id")
      .eq("nis", nis)
      .maybeSingle();

    if (existingNis) {
      return NextResponse.json(
        {
          success: false,
          message: `NIS ${nis} sudah terdaftar.`,
        },
        { status: 400 }
      );
    }

    // Cek NISN sudah digunakan
    const { data: existingNisn } = await supabaseAdmin
      .from("students")
      .select("id")
      .eq("nisn", nisn)
      .maybeSingle();

    if (existingNisn) {
      return NextResponse.json(
        {
          success: false,
          message: `NISN ${nisn} sudah terdaftar.`,
        },
        { status: 400 }
      );
    }

    // Simpan siswa
    const { data, error } = await supabaseAdmin
      .from("students")
      .insert({
        nis: String(nis).trim(),
        nisn: String(nisn).trim(),
        full_name: String(full_name).trim(),
        class_id,
        gender: gender || null,
        birth_place: birth_place || null,
        birth_date: birth_date || null,
        is_active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Gagal menambahkan siswa:", error);

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
      message: "Data siswa berhasil ditambahkan.",
      data,
    });
  } catch (error) {
    console.error("Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan pada server.",
      },
      { status: 500 }
    );
  }
}