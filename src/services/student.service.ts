import { supabaseAdmin } from "@/lib/supabase-admin";

export async function getStudents() {
  const { data, error } = await supabaseAdmin
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
    .order("full_name", {
      ascending: true,
    });

  if (error) {
    console.error("Gagal mengambil data siswa:", error);
    return [];
  }

  return data ?? [];
}