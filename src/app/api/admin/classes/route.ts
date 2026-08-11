import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    const {
      data,
      error,
    } = await supabaseAdmin
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
      .order("grade", {
        ascending: true,
      })
      .order("class_number", {
        ascending: true,
      });

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

    const result = (data || []).map(
      (item: any) => ({
        id: item.id,

        name: `${item.grade} ${
          item.majors?.code || ""
        } ${item.class_number}`,
      })
    );

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal mengambil data kelas.",
      },
      { status: 500 }
    );
  }
}