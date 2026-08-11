import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("exam_settings")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);

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
      data: data || null,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil pengaturan ujian.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      exam_name,
      academic_year,
      semester,
      school_name,
      exam_start_date,
      exam_end_date,
      server_link,
    } = body;

    if (!exam_name || !academic_year) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Nama ujian dan tahun pelajaran wajib diisi.",
        },
        { status: 400 }
      );
    }

    const { data: existing } =
      await supabaseAdmin
        .from("exam_settings")
        .select("id")
        .limit(1)
        .maybeSingle();

    let data;
    let error;

    if (existing) {
      const result = await supabaseAdmin
        .from("exam_settings")
        .update({
          exam_name,
          academic_year,
          semester,
          school_name:
            school_name || "SMK EKONOMIKA",
          exam_start_date:
            exam_start_date || null,
          exam_end_date:
            exam_end_date || null,
          server_link:
            server_link || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", existing.id)
        .select()
        .single();

      data = result.data;
      error = result.error;
    } else {
      const result = await supabaseAdmin
        .from("exam_settings")
        .insert({
          exam_name,
          academic_year,
          semester,
          school_name:
            school_name || "SMK EKONOMIKA",
          exam_start_date:
            exam_start_date || null,
          exam_end_date:
            exam_end_date || null,
          server_link:
            server_link || null,
        })
        .select()
        .single();

      data = result.data;
      error = result.error;
    }

    if (error) {
      console.error(error);

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
      message:
        "Pengaturan ujian berhasil disimpan.",
      data,
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