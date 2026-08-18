"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type ClassItem = {
  id: string;
  name: string;
};

export default function EditStudentPage() {
  const router = useRouter();
  const params = useParams();

  const id = params.id as string;

  const [classes, setClasses] =
    useState<ClassItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [success, setSuccess] =
    useState<boolean | null>(null);

  const [form, setForm] = useState({
    nis: "",
    nisn: "",
    full_name: "",
    class_id: "",
    gender: "",
    birth_place: "",
    birth_date: "",
    is_active: true,

    status_kartu: "BELUM",
    nomor_ujian: "",
    lembar_ujian: "",
    password_ujian: "",
  });

  // =====================================================
  // LOAD DATA
  // =====================================================

  useEffect(() => {
    async function loadData() {
      try {
        // =================================================
        // AMBIL DATA KELAS
        // =================================================

        const classResponse =
          await fetch(
            "/api/admin/students/classes"
          );

        const classResult =
          await classResponse.json();

        if (
          !classResponse.ok ||
          !classResult.success
        ) {
          setMessage(
            classResult.message ||
              "Gagal mengambil data kelas."
          );

          setSuccess(false);

          return;
        }

        setClasses(
          classResult.data
        );

        // =================================================
        // AMBIL DATA SISWA
        // =================================================

        const studentResponse =
          await fetch(
            `/api/admin/students/${id}`
          );

        const studentResult =
          await studentResponse.json();

        if (
          !studentResponse.ok ||
          !studentResult.success
        ) {
          setMessage(
            studentResult.message ||
              "Data siswa tidak ditemukan."
          );

          setSuccess(false);

          return;
        }

        const student =
          studentResult.data;

        // =================================================
        // MASUKKAN DATA KE FORM
        // =================================================

        setForm({
          nis:
            student.nis || "",

          nisn:
            student.nisn || "",

          full_name:
            student.full_name || "",

          class_id:
            student.class_id || "",

          gender:
            student.gender || "",

          birth_place:
            student.birth_place || "",

          birth_date:
            student.birth_date || "",

          is_active:
            student.is_active ?? true,

          status_kartu:
            student.status_kartu ||
            "BELUM",

          nomor_ujian:
            student.nomor_ujian || "",

          lembar_ujian:
            student.lembar_ujian || "",

          password_ujian:
            student.password_ujian || "",
        });
      } catch (error) {
        console.error(error);

        setMessage(
          "Gagal mengambil data siswa."
        );

        setSuccess(false);
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadData();
    }
  }, [id]);

  // =====================================================
  // HANDLE CHANGE
  // =====================================================

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) => {
    const {
      name,
      value,
    } = e.target;

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

    setSaving(true);
    setMessage("");
    setSuccess(null);

    try {
      const response =
        await fetch(
          `/api/admin/students/${id}`,
          {
            method: "PUT",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify(form),
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setSuccess(false);

        setMessage(
          result.message ||
            "Gagal memperbarui data siswa."
        );

        return;
      }

      setSuccess(true);

      setMessage(
        "Data siswa berhasil diperbarui."
      );

      setTimeout(() => {
        router.push(
          "/admin/students"
        );

        router.refresh();
      }, 700);
    } catch (error) {
      console.error(error);

      setSuccess(false);

      setMessage(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setSaving(false);
    }
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Sidebar />

        <div className="ml-[330px] min-h-screen">
          <Header />

          <main className="p-8">
            <div className="bg-white rounded-xl shadow p-8">
              <p className="text-gray-500">
                Memuat data siswa...
              </p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // =====================================================
  // HALAMAN EDIT
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <Sidebar />

      {/* AREA KONTEN */}

      <div className="ml-[330px] min-h-screen">

        <Header />

        <main className="p-8">

          {/* =================================================
              JUDUL
          ================================================= */}

          <div className="mb-6">

            <h1 className="text-3xl font-bold text-gray-900">
              Edit Siswa
            </h1>

            <p className="text-gray-500 mt-1">
              Perbarui data siswa SMK Ekonomika.
            </p>

          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <div className="bg-white rounded-xl shadow p-8 w-full max-w-5xl">

            <form
              onSubmit={handleSubmit}
              className="space-y-8"
            >

              {/* =================================================
                  DATA SISWA
              ================================================= */}

              <section>

                <div className="mb-5">

                  <h2 className="text-xl font-bold text-gray-800">
                    Data Siswa
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Informasi identitas dan kelas siswa.
                  </p>

                </div>

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

                  {/* NAMA */}

                  <div className="md:col-span-2">

                    <label className="block font-medium text-gray-700 mb-2">
                      Nama Lengkap
                    </label>

                    <input
                      type="text"
                      name="full_name"
                      value={form.full_name}
                      onChange={handleChange}
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
                        Pilih Kelas
                      </option>

                      {classes.map(
                        (item) => (
                          <option
                            key={item.id}
                            value={item.id}
                          >
                            {item.name}
                          </option>
                        )
                      )}

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
                      value={
                        form.birth_date || ""
                      }
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

              </section>

              {/* =================================================
                  STATUS
              ================================================= */}

              <section className="border-t border-gray-200 pt-8">

                <div className="mb-5">

                  <h2 className="text-xl font-bold text-gray-800">
                    Status
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Atur status siswa dan kartu ujian.
                  </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* STATUS SISWA */}

                  <div>

                    <label className="block font-medium text-gray-700 mb-2">
                      Status Siswa
                    </label>

                    <select
                      name="is_active"
                      value={
                        form.is_active
                          ? "true"
                          : "false"
                      }
                      onChange={(e) =>
                        setForm(
                          (prev) => ({
                            ...prev,
                            is_active:
                              e.target.value ===
                              "true",
                          })
                        )
                      }
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

                      <option value="true">
                        Aktif
                      </option>

                      <option value="false">
                        Tidak Aktif
                      </option>

                    </select>

                  </div>

                  {/* STATUS KARTU */}

                  <div>

                    <label className="block font-medium text-gray-700 mb-2">
                      Status Kartu
                    </label>

                    <select
                      name="status_kartu"
                      value={
                        form.status_kartu
                      }
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

                      <option value="BELUM">
                        BELUM
                      </option>

                      <option value="SIAP">
                        SIAP
                      </option>

                    </select>

                  </div>

                </div>

              </section>

              {/* =================================================
                  DATA UJIAN
              ================================================= */}

              <section className="border-t border-gray-200 pt-8">

                <div className="mb-5">

                  <h2 className="text-xl font-bold text-gray-800">
                    Data Ujian
                  </h2>

                  <p className="text-sm text-gray-500 mt-1">
                    Informasi yang digunakan untuk kartu ujian.
                  </p>

                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* NOMOR UJIAN */}

                  <div>

                    <label className="block font-medium text-gray-700 mb-2">
                      Nomor Ujian
                    </label>

                    <input
                      type="text"
                      name="nomor_ujian"
                      value={
                        form.nomor_ujian
                      }
                      onChange={handleChange}
                      placeholder="Contoh: 001"
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

                  {/* LEMBAR UJIAN */}

                  <div>

                    <label className="block font-medium text-gray-700 mb-2">
                      Lembar Ujian
                    </label>

                    <input
                      type="text"
                      name="lembar_ujian"
                      value={
                        form.lembar_ujian
                      }
                      onChange={handleChange}
                      placeholder="Contoh: A"
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

                  {/* PASSWORD */}

                  <div className="md:col-span-2">

                    <label className="block font-medium text-gray-700 mb-2">
                      Password Ujian
                    </label>

                    <input
                      type="text"
                      name="password_ujian"
                      value={
                        form.password_ujian
                      }
                      onChange={handleChange}
                      placeholder="Masukkan password ujian"
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

                    <p className="text-xs text-gray-400 mt-2">
                      Password ini dapat digunakan
                      pada kartu atau akses ujian siswa.
                    </p>

                  </div>

                </div>

              </section>

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

                <button
                  type="submit"
                  disabled={saving}
                  className={`
                    px-6
                    py-3
                    rounded-lg
                    font-semibold
                    text-white
                    transition
                    ${
                      saving
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-blue-600 hover:bg-blue-700"
                    }
                  `}
                >
                  {saving
                    ? "Menyimpan..."
                    : "Simpan Perubahan"}
                </button>

              </div>

            </form>

          </div>

        </main>

      </div>

    </div>
  );
}