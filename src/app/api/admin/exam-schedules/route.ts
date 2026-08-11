import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const {
      data: examSetting,
      error: examError,
    } = await supabaseAdmin
      .from("exam_settings")
      .select("id")
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (examError) {
      return NextResponse.json(
        {
          success: false,
          message: examError.message,
        },
        { status: 500 }
      );
    }

    if (!examSetting) {
      return NextResponse.json({
        success: true,
        data: [],
      });
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("exam_schedules")
      .select(`
        id,
        exam_date,
        start_time,
        end_time,
        subject,
        class_id,
        classes (
          id,
          grade,
          class_number,
          majors (
            code,
            name
          )
        )
      `)
      .eq(
        "exam_setting_id",
        examSetting.id
      )
      .order("exam_date", {
        ascending: true,
      })
      .order("start_time", {
        ascending: true,
      });

    if (error) {
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
      data: data || [],
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal mengambil jadwal ujian.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      exam_date,
      start_time,
      end_time,
      subject,
      class_id,
    } = body;

    if (
      !exam_date ||
      !start_time ||
      !end_time ||
      !subject ||
      !class_id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tanggal, waktu, mata ujian, dan kelas wajib diisi.",
        },
        { status: 400 }
      );
    }

    const {
      data: examSetting,
      error: examError,
    } = await supabaseAdmin
      .from("exam_settings")
      .select("id")
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (examError || !examSetting) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Pengaturan ujian belum tersedia.",
        },
        { status: 400 }
      );
    }

    const {
      data,
      error,
    } = await supabaseAdmin
      .from("exam_schedules")
      .insert({
        exam_setting_id: examSetting.id,
        class_id,
        exam_date,
        start_time,
        end_time,
        subject,
      })
      .select()
      .single();

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
        "Jadwal berhasil ditambahkan.",
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