import { NextResponse } from "next/server";
import * as XLSX from "xlsx";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(request: Request) {
  try {
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

    if (!fileName.endsWith(".xlsx") && !fileName.endsWith(".xls")) {
      return NextResponse.json(
        {
          success: false,
          message: "File harus berformat .xlsx atau .xls.",
        },
        { status: 400 }
      );
    }

    // Membaca file Excel
    const buffer = await file.arrayBuffer();

    const workbook = XLSX.read(buffer, {
      type: "array",
    });

    // Ambil sheet pertama
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

    // Ubah Excel menjadi array object
    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(
  worksheet,
  {
    defval: "",
    raw: true,
  }
);

    if (rows.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "File Excel tidak memiliki data.",
        },
        { status: 400 }
      );
    }

    // Ambil seluruh kelas dari database
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
      console.error("Error mengambil kelas:", classesError);

      return NextResponse.json(
        {
          success: false,
          message: "Gagal mengambil data kelas dari database.",
        },
        { status: 500 }
      );
    }

    // Membuat daftar siswa yang akan dimasukkan
    const students = [];

    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];

      const nis = String(row["NIS"] ?? "").trim();
      const nisn = String(row["NISN"] ?? "").trim();
      const fullName = String(row["Nama Lengkap"] ?? "").trim();
      const className = String(row["Kelas"] ?? "").trim();
      const gender = String(row["Jenis Kelamin"] ?? "").trim();
      const birthPlace = String(row["Tempat Lahir"] ?? "").trim();

      const birthDateValue = row["Tanggal Lahir"];

let birthDate: string | null = null;

if (birthDateValue) {
  // Jika Excel menyimpan tanggal sebagai angka serial
  if (typeof birthDateValue === "number") {
    const excelDate = XLSX.SSF.parse_date_code(birthDateValue);

    if (excelDate) {
      const year = excelDate.y;
      const month = String(excelDate.m).padStart(2, "0");
      const day = String(excelDate.d).padStart(2, "0");

      birthDate = `${year}-${month}-${day}`;
    }
  } else {
    // Jika tanggal sudah berupa teks
    const dateString = String(birthDateValue).trim();

    if (dateString) {
      birthDate = dateString;
    }
  }
}

      // Lewati baris yang benar-benar kosong
      if (!nis && !nisn && !fullName && !className) {
        continue;
      }

      // Validasi data wajib
      if (!nis || !nisn || !fullName || !className) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Data pada baris ${index + 2} tidak lengkap. ` +
              `NIS, NISN, Nama Lengkap, dan Kelas wajib diisi.`,
          },
          { status: 400 }
        );
      }

      // Normalisasi nama kelas
      const normalizedClassName = className
        .toUpperCase()
        .replace(/\s+/g, " ")
        .trim();

      // Cari kelas yang sesuai
      const matchedClass = classes?.find((item: any) => {
        const grade = String(item.grade ?? "")
          .toUpperCase()
          .trim();

        const majorCode = String(item.majors?.code ?? "")
          .toUpperCase()
          .trim();

        const classNumber = String(item.class_number ?? "")
          .trim();

        const databaseClassName =
          `${grade} ${majorCode} ${classNumber}`;

        return databaseClassName === normalizedClassName;
      });

      if (!matchedClass) {
        return NextResponse.json(
          {
            success: false,
            message:
              `Kelas "${className}" pada baris ${index + 2} ` +
              `tidak ditemukan di database.`,
          },
          { status: 400 }
        );
      }

      students.push({
        class_id: matchedClass.id,
        nis,
        nisn,
        full_name: fullName,
        gender: gender || null,
        birth_place: birthPlace || null,
        birth_date: birthDate || null,
        is_active: true,
      });
    }

    if (students.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Tidak ada data siswa yang dapat diimport.",
        },
        { status: 400 }
      );
    }

    // Simpan ke database
    const { data, error } = await supabaseAdmin
      .from("students")
      .insert(students)
      .select();

    if (error) {
      console.error("Error insert siswa:", error);

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
      message: `${data.length} siswa berhasil diimport.`,
      total: data.length,
    });

  } catch (error) {
    console.error("Import Excel Error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan saat memproses file Excel.",
      },
      { status: 500 }
    );
  }
}