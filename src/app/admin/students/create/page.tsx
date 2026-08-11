"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type ClassItem = {
  id: string;
  name: string;
};

export default function CreateStudentPage() {
  const router = useRouter();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingClasses, setLoadingClasses] = useState(true);

  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);

  const [form, setForm] = useState({
    nis: "",
    nisn: "",
    full_name: "",
    class_id: "",
    gender: "",
    birth_place: "",
    birth_date: "",
  });

  // =====================================================
  // LOAD DATA KELAS
  // =====================================================

  useEffect(() => {
    async function loadClasses() {
      try {
        const response = await fetch(
          "/api/admin/students/classes"
        );

        const result = await response.json();

        if (!response.ok || !result.success) {
          setMessage(
            result.message ||
              "Gagal mengambil data kelas."
          );

          setSuccess(false);

          return;
        }

        setClasses(result.data);
      } catch (error) {
        console.error(error);

        setMessage(
          "Gagal mengambil data kelas."
        );

        setSuccess(false);
      } finally {
        setLoadingClasses(false);
      }
    }

    loadClasses();
  }, []);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // =====================================================
  // HANDLE SUBMIT
  // =====================================================

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");
    setSuccess(null);

    try {
      const response = await fetch(
        "/api/admin/students",
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
        setSuccess(false);

        setMessage(
          result.message ||
            "Gagal menambahkan siswa."
        );

        return;
      }

      setSuccess(true);

      setMessage(
        "Data siswa berhasil ditambahkan."
      );

      setTimeout(() => {
        router.push("/admin/students");
        router.refresh();
      }, 700);
    } catch (error) {
      console.error(error);

      setSuccess(false);

      setMessage(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100">
      {/* =================================================
          SIDEBAR
      ================================================= */}

      <Sidebar />

      {/* =================================================
          AREA KONTEN UTAMA
      ================================================= */}

      <div className="ml-[330px] min-h-screen">
        {/* HEADER */}

        <Header />

        {/* CONTENT */}

        <main className="p-8">
          {/* =================================================
              JUDUL HALAMAN
          ================================================= */}

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900">
              Tambah Siswa
            </h1>

            <p className="text-gray-500 mt-1">
              Tambahkan data siswa secara manual.
            </p>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <div className="bg-white rounded-xl shadow p-8 w-full max-w-5xl">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* =================================================
                  DATA SISWA
              ================================================= */}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* NIS */}

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    NIS
                  </label>

                  <input
                    type="text"
                    name="nis"
                    value={form.nis}
                    onChange={handleChange}
                    placeholder="Masukkan NIS"
                    required
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
                  />
                </div>

                {/* NISN */}

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    NISN
                  </label>

                  <input
                    type="text"
                    name="nisn"
                    value={form.nisn}
                    onChange={handleChange}
                    placeholder="Masukkan NISN"
                    required
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
                  />
                </div>

                {/* NAMA LENGKAP */}

                <div className="md:col-span-2">
                  <label className="block font-medium text-gray-700 mb-2">
                    Nama Lengkap
                  </label>

                  <input
                    type="text"
                    name="full_name"
                    value={form.full_name}
                    onChange={handleChange}
                    placeholder="Masukkan nama lengkap"
                    required
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
                  />
                </div>

                {/* KELAS */}

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Kelas
                  </label>

                  <select
                    name="class_id"
                    value={form.class_id}
                    onChange={handleChange}
                    required
                    disabled={loadingClasses}
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
                    <option value="">
                      {loadingClasses
                        ? "Memuat kelas..."
                        : "Pilih Kelas"}
                    </option>

                    {classes.map((item) => (
                      <option
                        key={item.id}
                        value={item.id}
                      >
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* JENIS KELAMIN */}

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Jenis Kelamin
                  </label>

                  <select
                    name="gender"
                    value={form.gender}
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
                    <option value="">
                      Pilih Jenis Kelamin
                    </option>

                    <option value="L">
                      Laki-laki
                    </option>

                    <option value="P">
                      Perempuan
                    </option>
                  </select>
                </div>

                {/* TEMPAT LAHIR */}

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Tempat Lahir
                  </label>

                  <input
                    type="text"
                    name="birth_place"
                    value={form.birth_place}
                    onChange={handleChange}
                    placeholder="Contoh: Depok"
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
                  />
                </div>

                {/* TANGGAL LAHIR */}

                <div>
                  <label className="block font-medium text-gray-700 mb-2">
                    Tanggal Lahir
                  </label>

                  <input
                    type="date"
                    name="birth_date"
                    value={form.birth_date}
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
                  />
                </div>
              </div>

              {/* =================================================
                  PESAN
              ================================================= */}

              {message && (
                <div
                  className={`
                    rounded-lg
                    p-4
                    border
                    ${
                      success
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }
                  `}
                >
                  {message}
                </div>
              )}

              {/* =================================================
                  TOMBOL
              ================================================= */}

              <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
                {/* BATAL */}

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      "/admin/students"
                    )
                  }
                  className="
                    px-5
                    py-3
                    rounded-lg
                    border
                    border-gray-300
                    bg-white
                    text-gray-700
                    hover:bg-gray-50
                    transition
                  "
                >
                  Batal
                </button>

                {/* SIMPAN */}

                <button
                  type="submit"
                  disabled={loading}
                  className={`
                    px-6
                    py-3
                    rounded-lg
                    font-semibold
                    text-white
                    transition
                    ${
                      loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  `}
                >
                  {loading
                    ? "Menyimpan..."
                    : "Simpan Siswa"}
                </button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}