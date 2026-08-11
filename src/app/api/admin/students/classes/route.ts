import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("classes")
      .select(`
        id,
        grade,
        class_number,
        majors (
          code,
          name
        )
      `)
      .order("grade")
      .order("class_number");

    if (error) {
      console.error("Gagal mengambil kelas:", error);

      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: 500 }
      );
    }

    const classes = (data ?? []).map((item: any) => ({
      id: item.id,
      name: `${item.grade} ${item.majors?.code ?? ""} ${item.class_number}`,
    }));

    return NextResponse.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data kelas.",
      },
      { status: 500 }
    );
  }
}