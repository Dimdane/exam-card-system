import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
    // =====================================================
    // 1. AMBIL FILE
    // =====================================================

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "File Excel belum dipilih.",
        },
        { status: 400 }
      );
    }

    const fileName = file.name.toLowerCase();

    if (
      !fileName.endsWith(".xlsx") &&
      !fileName.endsWith(".xls")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "File harus berformat .xlsx atau .xls.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // 2. BACA FILE EXCEL
    // =====================================================

    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer, {
      type: "array",
    });

    const sheetName = workbook.SheetNames[0];

    if (!sheetName) {
      return NextResponse.json(
        {
          success: false,
          message: "Sheet Excel tidak ditemukan.",
        },
        { status: 400 }
      );
    }

    const worksheet = workbook.Sheets[sheetName];

    const rows = XLSX.utils.sheet_to_json<
      Record<string, unknown>
    >(worksheet, {
      defval: "",
      raw: true,
    });

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "File Excel tidak memiliki data.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // 3. AMBIL DATA KELAS
    // =====================================================

    const { data: classes, error: classesError } =
      await supabaseAdmin
        .from("classes")
        .select(`
          id,
          grade,
          class_number,
          majors (
            code
          )
        `);

    if (classesError) {
      console.error(
        "Error mengambil kelas:",
        classesError
      );

      return NextResponse.json(
        {
          success: false,
          message:
            "Gagal mengambil data kelas dari database.",
        },
        { status: 500 }
      );
    }

    // =====================================================
    // 4. SIAPKAN DATA SISWA
    // =====================================================

    const students = [];

    for (
      let index = 0;
      index < rows.length;
      index++
    ) {
      const row = rows[index];

      // ---------------------------------------------------
      // DATA DASAR
      // ---------------------------------------------------

      const nis = String(
        row["NIS"] ?? ""
      ).trim();

      const nisn = String(
        row["NISN"] ?? ""
      ).trim();

      const fullName = String(
        row["Nama Lengkap"] ?? ""
      ).trim();

      const className = String(
        row["Kelas"] ?? ""
      ).trim();

      const gender = String(
        row["Jenis Kelamin"] ?? ""
      )
        .trim()
        .toUpperCase();

      const birthPlace = String(
        row["Tempat Lahir"] ?? ""
      ).trim();

      // ---------------------------------------------------
      // TANGGAL LAHIR
      // ---------------------------------------------------

      const birthDateValue =
        row["Tanggal Lahir"];

      let birthDate: string | null = null;

      if (birthDateValue) {
        if (
          typeof birthDateValue === "number"
        ) {
          const excelDate =
            XLSX.SSF.parse_date_code(
              birthDateValue
            );

          if (excelDate) {
            const year = excelDate.y;
            const month = String(
              excelDate.m
            ).padStart(2, "0");

            const day = String(
              excelDate.d
            ).padStart(2, "0");

            birthDate =
              `${year}-${month}-${day}`;
          }
        } else {
          const dateString = String(
            birthDateValue
          ).trim();

          if (dateString) {
            birthDate = dateString;
          }
        }
      }

      // ---------------------------------------------------
      // STATUS AKTIF
      // ---------------------------------------------------

      const activeValue = String(
        row["Status Aktif"] ?? "YA"
      )
        .trim()
        .toUpperCase();

      let isActive = true;

      if (
        activeValue === "TIDAK" ||
        activeValue === "TIDAK AKTIF" ||
        activeValue === "NONAKTIF" ||
        activeValue === "0" ||
        activeValue === "FALSE"
      ) {
        isActive = false;
      }

      // ---------------------------------------------------
      // STATUS KARTU
      // ---------------------------------------------------

      const statusValue = String(
        row["Status Kartu"] ?? "BELUM"
      )
        .trim()
        .toUpperCase();

      const statusKartu =
        statusValue === "SIAP"
          ? "SIAP"
          : "BELUM";

      // ---------------------------------------------------
      // DATA UJIAN
      // ---------------------------------------------------

      const nomorUjianValue =
        row["Nomor Ujian"];

      const lembarUjianValue =
        row["Lembar Ujian"];

      const passwordUjianValue =
        row["Password Ujian"];

      const nomorUjian =
        nomorUjianValue !== undefined &&
        nomorUjianValue !== null &&
        String(nomorUjianValue).trim() !== ""
          ? String(nomorUjianValue).trim()
          : null;

      const lembarUjian =
        lembarUjianValue !== undefined &&
        lembarUjianValue !== null &&
        String(lembarUjianValue).trim() !== ""
          ? String(lembarUjianValue).trim()
          : null;

      const passwordUjian =
        passwordUjianValue !== undefined &&
        passwordUjianValue !== null &&
        String(passwordUjianValue).trim() !== ""
          ? String(passwordUjianValue).trim()
          : null;

      // ===================================================
      // LEWATI BARIS KOSONG
      // ===================================================

      if (
        !nis &&
        !nisn &&
        !fullName &&
        !className
      ) {
        continue;
      }

      // ===================================================
      // VALIDASI DATA WAJIB
      // ===================================================

      if (
        !nis ||
        !nisn ||
        !fullName ||
        !className
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Data pada baris ${
                index + 2
              } tidak lengkap. ` +
              `NIS, NISN, Nama Lengkap, dan Kelas wajib diisi.`,
          },
          { status: 400 }
        );
      }

      // ===================================================
      // VALIDASI JENIS KELAMIN
      // ===================================================

      if (
        gender &&
        gender !== "L" &&
        gender !== "P"
      ) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Jenis kelamin pada baris ${
                index + 2
              } harus L atau P.`,
          },
          { status: 400 }
        );
      }

      // ===================================================
      // NORMALISASI NAMA KELAS
      // ===================================================

      const normalizedClassName =
        className
          .toUpperCase()
          .replace(/\s+/g, " ")
          .trim();

      // ===================================================
      // CARI KELAS
      // ===================================================

      const matchedClass =
        classes?.find((item: any) => {
          const grade = String(
            item.grade ?? ""
          )
            .toUpperCase()
            .trim();

          const majorCode = String(
            item.majors?.code ?? ""
          )
            .toUpperCase()
            .trim();

          const classNumber = String(
            item.class_number ?? ""
          ).trim();

          const databaseClassName =
            `${grade} ${majorCode} ${classNumber}`;

          return (
            databaseClassName ===
            normalizedClassName
          );
        });

      if (!matchedClass) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Kelas "${className}" pada baris ${
                index + 2
              } tidak ditemukan di database.`,
          },
          { status: 400 }
        );
      }

      // ===================================================
      // MASUKKAN KE ARRAY
      // ===================================================

      students.push({
        class_id: matchedClass.id,

        nis,
        nisn,
        full_name: fullName,

        gender: gender || null,
        birth_place: birthPlace || null,
        birth_date: birthDate || null,

        is_active: isActive,

        // Status kartu
        status_kartu: statusKartu,

        // Data ujian
        nomor_ujian: nomorUjian,
        lembar_ujian: lembarUjian,
        password_ujian: passwordUjian,
      });
    }

    // =====================================================
    // 5. CEK DATA
    // =====================================================

    if (students.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Tidak ada data siswa yang dapat diimport.",
        },
        { status: 400 }
      );
    }

    // =====================================================
    // 6. INSERT KE DATABASE
    // =====================================================

    const { data, error } =
      await supabaseAdmin
        .from("students")
        .insert(students)
        .select();

    if (error) {
      console.error(
        "Error insert siswa:",
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

    // =====================================================
    // 7. RESPONSE
    // =====================================================

    return NextResponse.json({
      success: true,
      message: `${data.length} siswa berhasil diimport.`,
      total: data.length,
    });
  } catch (error) {
    console.error(
      "Import Excel Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Terjadi kesalahan saat memproses file Excel.",
      },
      { status: 500 }
    );
  }
}