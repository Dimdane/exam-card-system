import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

// =====================================================
// GET DATA SISWA
// =====================================================

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const { data, error } =
      await supabaseAdmin
        .from("students")
        .select(`
          id,
          nis,
          nisn,
          full_name,
          gender,
          birth_place,
          birth_date,
          is_active,
          status_kartu,
          nomor_ujian,
          lembar_ujian,
          password_ujian,
          class_id
        `)
        .eq("id", id)
        .single();

    if (error || !data) {
      console.error(
        "Gagal mengambil siswa:",
        error
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Data siswa tidak ditemukan.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
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


// =====================================================
// UPDATE DATA SISWA
// =====================================================

export async function PUT(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    const body = await request.json();

    const {
      nis,
      nisn,
      full_name,
      class_id,
      gender,
      birth_place,
      birth_date,
      is_active,

      status_kartu,
      nomor_ujian,
      lembar_ujian,
      password_ujian,
    } = body;

    // =================================================
    // VALIDASI DATA WAJIB
    // =================================================

    if (
      !nis ||
      !nisn ||
      !full_name ||
      !class_id
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "NIS, NISN, Nama Lengkap, dan Kelas wajib diisi.",
        },
        { status: 400 }
      );
    }

    // =================================================
    // VALIDASI STATUS KARTU
    // =================================================

    if (
      status_kartu &&
      !["BELUM", "SIAP"].includes(
        status_kartu
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Status kartu tidak valid.",
        },
        { status: 400 }
      );
    }

    // =================================================
    // CEK NIS
    // =================================================

    const {
      data: existingNis,
    } = await supabaseAdmin
      .from("students")
      .select("id")
      .eq(
        "nis",
        String(nis).trim()
      )
      .neq("id", id)
      .maybeSingle();

    if (existingNis) {
      return NextResponse.json(
        {
          success: false,
          message:
            `NIS ${nis} sudah digunakan siswa lain.`,
        },
        { status: 400 }
      );
    }

    // =================================================
    // CEK NISN
    // =================================================

    const {
      data: existingNisn,
    } = await supabaseAdmin
      .from("students")
      .select("id")
      .eq(
        "nisn",
        String(nisn).trim()
      )
      .neq("id", id)
      .maybeSingle();

    if (existingNisn) {
      return NextResponse.json(
        {
          success: false,
          message:
            `NISN ${nisn} sudah digunakan siswa lain.`,
        },
        { status: 400 }
      );
    }

    // =================================================
    // UPDATE DATA
    // =================================================

    const { data, error } =
      await supabaseAdmin
        .from("students")
        .update({
          nis: String(nis).trim(),

          nisn: String(nisn).trim(),

          full_name:
            String(full_name).trim(),

          class_id,

          gender:
            gender || null,

          birth_place:
            birth_place || null,

          birth_date:
            birth_date || null,

          is_active:
            typeof is_active ===
            "boolean"
              ? is_active
              : true,

          // STATUS KARTU
          status_kartu:
            status_kartu || "BELUM",

          // DATA UJIAN
          nomor_ujian:
            nomor_ujian
              ? String(
                  nomor_ujian
                ).trim()
              : null,

          lembar_ujian:
            lembar_ujian
              ? String(
                  lembar_ujian
                ).trim()
              : null,

          password_ujian:
            password_ujian
              ? String(
                  password_ujian
                ).trim()
              : null,
        })
        .eq("id", id)
        .select()
        .single();

    if (error) {
      console.error(
        "Gagal mengupdate siswa:",
        error
      );

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
        "Data siswa berhasil diperbarui.",
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


// =====================================================
// DELETE DATA SISWA
// =====================================================

export async function DELETE(
  request: Request,
  { params }: Params
) {
  try {
    const { id } = await params;

    // =================================================
    // CEK SISWA
    // =================================================

    const {
      data: student,
      error: findError,
    } = await supabaseAdmin
      .from("students")
      .select(
        "id, full_name"
      )
      .eq("id", id)
      .single();

    if (
      findError ||
      !student
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

    // =================================================
    // HAPUS SISWA
    // =================================================

    const { error } =
      await supabaseAdmin
        .from("students")
        .delete()
        .eq("id", id);

    if (error) {
      console.error(
        "Gagal menghapus siswa:",
        error
      );

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
        `Data siswa ${student.full_name} berhasil dihapus.`,
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