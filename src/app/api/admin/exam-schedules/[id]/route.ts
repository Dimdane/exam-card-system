import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

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
      data,
      error,
    } = await supabaseAdmin
      .from("exam_schedules")
      .update({
        exam_date,
        start_time,
        end_time,
        subject,
        class_id,
      })
      .eq("id", id)
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
        "Jadwal berhasil diperbarui.",
      data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal memperbarui jadwal.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const {
      error,
    } = await supabaseAdmin
      .from("exam_schedules")
      .delete()
      .eq("id", id);

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
        "Jadwal berhasil dihapus.",
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal menghapus jadwal.",
      },
      { status: 500 }
    );
  }
}