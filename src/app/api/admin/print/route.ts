import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const keyword = searchParams.get("keyword");

    // =====================================================
    // VALIDASI KEYWORD
    // =====================================================

    if (!keyword || !keyword.trim()) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Masukkan NIS, NISN, atau nama siswa.",
        },
        { status: 400 }
      );
    }

    const search = keyword.trim();

    // =====================================================
    // CARI SISWA
    // =====================================================

    const {
      data: students,
      error: studentError,
    } = await supabaseAdmin
      .from("students")
      .select(`
        id,
        nis,
        nisn,
        full_name,
        status_kartu,
        nomor_ujian,
        lembar_ujian,
        password_ujian,
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
      .or(
        `nis.ilike.%${search}%,nisn.ilike.%${search}%,full_name.ilike.%${search}%`
      )
      .limit(20);

    if (studentError) {
      console.error(
        "Student Error:",
        studentError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            studentError.message,
        },
        { status: 500 }
      );
    }

    // =====================================================
    // DATA SISWA TIDAK DITEMUKAN
    // =====================================================

    if (
      !students ||
      students.length === 0
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Data siswa tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    // =====================================================
    // AMBIL SETTING UJIAN TERBARU
    // =====================================================

    const {
      data: examSetting,
      error: examError,
    } = await supabaseAdmin
      .from("exam_settings")
      .select("*")
      .order("created_at", {
        ascending: false,
      })
      .limit(1)
      .maybeSingle();

    if (examError) {
      console.error(
        "Exam Setting Error:",
        examError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            examError.message,
        },
        { status: 500 }
      );
    }

    // =====================================================
    // AMBIL CLASS ID SISWA
    // =====================================================

    const classIds = students
      .map(
        (student: any) =>
          student.class_id
      )
      .filter(Boolean);

    // =====================================================
    // AMBIL JADWAL
    //
    // HANYA:
    // 1. exam_setting_id yang aktif
    // 2. class_id milik siswa
    // =====================================================

    let schedules: any[] = [];

    if (
      examSetting &&
      classIds.length > 0
    ) {
      const {
        data: scheduleData,
        error: scheduleError,
      } = await supabaseAdmin
        .from("exam_schedules")
        .select(`
          id,
          exam_setting_id,
          class_id,
          exam_date,
          start_time,
          end_time,
          subject
        `)
        .eq(
          "exam_setting_id",
          examSetting.id
        )
        .in(
          "class_id",
          classIds
        )
        .order("exam_date", {
          ascending: true,
        })
        .order("start_time", {
          ascending: true,
        });

      if (scheduleError) {
        console.error(
          "Schedule Error:",
          scheduleError
        );

        return NextResponse.json(
          {
            success: false,
            message:
              scheduleError.message,
          },
          { status: 500 }
        );
      }

      schedules =
        scheduleData || [];
    }

    // =====================================================
    // FORMAT DATA SISWA
    // =====================================================

    const result =
      students.map(
        (student: any) => {
          const kelas =
            student.classes;

          const className =
            kelas
              ? `${kelas.grade} ${
                  kelas.majors?.code ||
                  ""
                } ${
                  kelas.class_number
                }`
              : "-";

          // =================================================
          // PENTING:
          // HANYA JADWAL YANG class_id-nya SAMA
          // DENGAN class_id SISWA
          // =================================================

          const studentSchedules =
            schedules.filter(
              (schedule: any) =>
                String(
                  schedule.class_id
                ) ===
                String(
                  student.class_id
                )
            );

          return {
            id: student.id,

            nis: student.nis,

            nisn: student.nisn,

            full_name:
              student.full_name,

            status_kartu:
              student.status_kartu,

            nomor_ujian:
              student.nomor_ujian ||
              "-",

            lembar_ujian:
              student.lembar_ujian ||
              "-",

            password_ujian:
              student.password_ujian ||
              "-",

            class_id:
              student.class_id ||
              null,

            class_name:
              className,

            major_name:
              kelas?.majors?.name ||
              "",

            schedules:
              studentSchedules,
          };
        }
      );

    // =====================================================
    // RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,

      data: result,

      exam: examSetting,

      // Tidak digunakan oleh halaman kartu,
      // tetapi tetap dikosongkan agar response
      // tidak membingungkan.
      schedules: [],
    });

  } catch (error) {
    console.error(
      "Print API Error:",
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