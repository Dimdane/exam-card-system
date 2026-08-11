"use client";

import { useEffect, useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";

type ExamSettings = {
  id?: string;
  exam_name: string;
  academic_year: string;
  semester: string;
  school_name: string;
  exam_start_date: string;
  exam_end_date: string;
  server_link: string;
};

const defaultForm: ExamSettings = {
  exam_name: "",
  academic_year: "",
  semester: "Genap",
  school_name: "SMK EKONOMIKA",
  exam_start_date: "",
  exam_end_date: "",
  server_link: "",
};

export default function ExamSettingsPage() {
  const [form, setForm] =
    useState<ExamSettings>(defaultForm);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  async function loadSettings() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/exam-settings"
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal mengambil pengaturan ujian."
        );
        return;
      }

      if (result.data) {
        setForm({
          id: result.data.id,
          exam_name:
            result.data.exam_name || "",
          academic_year:
            result.data.academic_year || "",
          semester:
            result.data.semester || "Genap",
          school_name:
            result.data.school_name ||
            "SMK EKONOMIKA",
          exam_start_date:
            result.data.exam_start_date || "",
          exam_end_date:
            result.data.exam_end_date || "",
          server_link:
            result.data.server_link || "",
        });
      }
    } catch (error) {
      console.error(error);

      alert(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadSettings();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!form.exam_name.trim()) {
      alert("Nama ujian wajib diisi.");
      return;
    }

    if (!form.academic_year.trim()) {
      alert("Tahun pelajaran wajib diisi.");
      return;
    }

    try {
      setSaving(true);

      const response = await fetch(
        "/api/admin/exam-settings",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal menyimpan pengaturan."
        );
        return;
      }

      alert(
        "Pengaturan ujian berhasil disimpan."
      );

      await loadSettings();
    } catch (error) {
      console.error(error);

      alert(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <p className="text-gray-500">
          Memuat pengaturan ujian...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="bg-white border-b px-8 py-5">
        <BackToDashboard />
        <h1 className="text-2xl font-bold">
          Pengaturan Ujian
        </h1>

        <p className="text-gray-500 mt-1">
          Atur informasi ujian yang akan
          digunakan pada kartu peserta.
        </p>

      </div>

      <div className="p-8">

        <div className="
          max-w-4xl
          bg-white
          rounded-xl
          shadow
          p-8
        ">

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* Nama Ujian */}

            <div>

              <label className="block font-semibold mb-2">
                Nama Ujian
              </label>

              <input
                type="text"
                name="exam_name"
                value={form.exam_name}
                onChange={handleChange}
                placeholder="Contoh: Penilaian Sumatif Akhir Tahun"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>


            {/* Tahun + Semester */}

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            ">

              <div>

                <label className="block font-semibold mb-2">
                  Tahun Pelajaran
                </label>

                <input
                  type="text"
                  name="academic_year"
                  value={form.academic_year}
                  onChange={handleChange}
                  placeholder="2026/2027"
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-4
                    py-3
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

              </div>


              <div>

                <label className="block font-semibold mb-2">
                  Semester
                </label>

                <select
                  name="semester"
                  value={form.semester}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-4
                    py-3
                    bg-white
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                >

                  <option value="Ganjil">
                    Ganjil
                  </option>

                  <option value="Genap">
                    Genap
                  </option>

                </select>

              </div>

            </div>


            {/* Nama Sekolah */}

            <div>

              <label className="block font-semibold mb-2">
                Nama Sekolah
              </label>

              <input
                type="text"
                name="school_name"
                value={form.school_name}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  bg-gray-50
                "
              />

            </div>


            {/* Tanggal */}

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            ">

              <div>

                <label className="block font-semibold mb-2">
                  Tanggal Mulai Ujian
                </label>

                <input
                  type="date"
                  name="exam_start_date"
                  value={form.exam_start_date}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-4
                    py-3
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

              </div>


              <div>

                <label className="block font-semibold mb-2">
                  Tanggal Selesai Ujian
                </label>

                <input
                  type="date"
                  name="exam_end_date"
                  value={form.exam_end_date}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-4
                    py-3
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

              </div>

            </div>


            {/* Link Server */}

            <div>

              <label className="block font-semibold mb-2">
                Link Server Ujian
              </label>

              <input
                type="text"
                name="server_link"
                value={form.server_link}
                onChange={handleChange}
                placeholder="https://..."
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>


            {/* Tombol */}

            <div className="pt-4">

              <button
                type="submit"
                disabled={saving}
                className="
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-gray-400
                  text-white
                  px-7
                  py-3
                  rounded-lg
                  font-semibold
                "
              >
                {saving
                  ? "Menyimpan..."
                  : "Simpan Pengaturan"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}