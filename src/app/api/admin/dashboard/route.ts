import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  try {
    // =====================================================
    // TOTAL SISWA
    // =====================================================

    const {
      count: totalStudents,
      error: studentError,
    } = await supabaseAdmin
      .from("students")
      .select("*", {
        count: "exact",
        head: true,
      });

    if (studentError) {
      console.error(studentError);

      return NextResponse.json(
        {
          success: false,
          message: studentError.message,
        },
        { status: 500 }
      );
    }

    // =====================================================
    // KARTU SIAP
    // =====================================================

    const {
      count: readyCards,
      error: readyError,
    } = await supabaseAdmin
      .from("students")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status_kartu", "SIAP");

    if (readyError) {
      console.error(readyError);

      return NextResponse.json(
        {
          success: false,
          message: readyError.message,
        },
        { status: 500 }
      );
    }

    // =====================================================
    // KARTU BELUM SIAP
    // =====================================================

    const {
      count: notReadyCards,
      error: notReadyError,
    } = await supabaseAdmin
      .from("students")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status_kartu", "BELUM");

    if (notReadyError) {
      console.error(notReadyError);

      return NextResponse.json(
        {
          success: false,
          message:
            notReadyError.message,
        },
        { status: 500 }
      );
    }

    // =====================================================
    // TOTAL KELAS
    // =====================================================

    const {
      count: totalClasses,
      error: classError,
    } = await supabaseAdmin
      .from("classes")
      .select("*", {
        count: "exact",
        head: true,
      });

    if (classError) {
      console.error(classError);

      return NextResponse.json(
        {
          success: false,
          message: classError.message,
        },
        { status: 500 }
      );
    }

    // =====================================================
    // TOTAL JURUSAN
    // =====================================================

    const {
      count: totalMajors,
      error: majorError,
    } = await supabaseAdmin
      .from("majors")
      .select("*", {
        count: "exact",
        head: true,
      });

    if (majorError) {
      console.error(majorError);

      return NextResponse.json(
        {
          success: false,
          message: majorError.message,
        },
        { status: 500 }
      );
    }

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      data: {
        totalStudents:
          totalStudents || 0,

        readyCards:
          readyCards || 0,

        notReadyCards:
          notReadyCards || 0,

        totalClasses:
          totalClasses || 0,

        totalMajors:
          totalMajors || 0,
      },
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal mengambil data dashboard.",
      },
      { status: 500 }
    );
  }
}