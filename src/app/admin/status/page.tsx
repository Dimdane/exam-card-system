"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type Student = {
  id: string;
  nis: string;
  nisn: string;
  full_name: string;
  is_active: boolean;
  status_kartu: "BELUM" | "SIAP";
  classes?: {
    grade: string;
    class_number: number;
    majors?: {
      code: string;
    };
  };
};

export default function StatusPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const [search, setSearch] = useState("");

  // =====================================================
  // LOAD DATA SISWA
  // =====================================================

  async function loadStudents() {
    try {
      setLoading(true);

      const response = await fetch("/api/admin/status");

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message || "Gagal mengambil data siswa."
        );

        return;
      }

      setStudents(result.data);
    } catch (error) {
      console.error(error);

      alert("Tidak dapat mengambil data siswa.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

  // =====================================================
  // UBAH STATUS KARTU
  // =====================================================

  async function changeStatus(
    id: string,
    status: "BELUM" | "SIAP"
  ) {
    try {
      setUpdating(id);

      const response = await fetch(
        "/api/admin/status",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            id,
            status_kartu: status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal mengubah status."
        );

        return;
      }

      // Update tampilan langsung tanpa reload
      setStudents((prev) =>
        prev.map((student) =>
          student.id === id
            ? {
                ...student,
                status_kartu: status,
              }
            : student
        )
      );
    } catch (error) {
      console.error(error);

      alert(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setUpdating(null);
    }
  }

  // =====================================================
  // FILTER PENCARIAN
  // =====================================================

  const filteredStudents = students.filter(
    (student) => {
      const keyword =
        search.toLowerCase().trim();

      if (!keyword) {
        return true;
      }

      return (
        student.nis
          .toLowerCase()
          .includes(keyword) ||
        student.nisn
          .toLowerCase()
          .includes(keyword) ||
        student.full_name
          .toLowerCase()
          .includes(keyword)
      );
    }
  );

  // =====================================================
  // STATISTIK
  // =====================================================

  const totalStudents = students.length;

  const totalSiap = students.filter(
    (student) =>
      student.status_kartu === "SIAP"
  ).length;

  const totalBelum = students.filter(
    (student) =>
      student.status_kartu === "BELUM"
  ).length;

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100">

      {/* SIDEBAR */}
      <Sidebar />

      {/* =================================================
          MAIN CONTENT
      ================================================= */}

      <main className="ml-[330px] min-h-screen">

        {/* HEADER */}
        <Header />

        {/* =================================================
            CONTENT
        ================================================= */}

        <div className="p-8">

          {/* =================================================
              JUDUL
          ================================================= */}

          <div className="mb-6">

            <h1 className="text-3xl font-bold text-gray-900">
              Status Kartu Ujian
            </h1>

            <p className="text-gray-500 mt-1">
              Atur siswa yang sudah dapat
              mencetak kartu ujian.
            </p>

          </div>

          {/* =================================================
              STATISTIK
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-5
              mb-6
            "
          >

            {/* TOTAL SISWA */}

            <div
              className="
                bg-white
                rounded-xl
                shadow-sm
                border
                border-gray-200
                p-6
              "
            >

              <p className="text-gray-500">
                Total Siswa
              </p>

              <p className="text-3xl font-bold mt-2 text-gray-900">
                {totalStudents}
              </p>

              <p className="text-sm text-gray-400 mt-2">
                Seluruh siswa terdaftar
              </p>

            </div>

            {/* KARTU SIAP */}

            <div
              className="
                bg-green-50
                rounded-xl
                shadow-sm
                border
                border-green-100
                p-6
              "
            >

              <p className="text-green-700">
                Kartu Siap
              </p>

              <p
                className="
                  text-3xl
                  font-bold
                  text-green-700
                  mt-2
                "
              >
                {totalSiap}
              </p>

              <p className="text-sm text-green-600 mt-2">
                Siswa dapat mencetak kartu
              </p>

            </div>

            {/* BELUM SIAP */}

            <div
              className="
                bg-red-50
                rounded-xl
                shadow-sm
                border
                border-red-100
                p-6
              "
            >

              <p className="text-red-700">
                Belum Siap
              </p>

              <p
                className="
                  text-3xl
                  font-bold
                  text-red-700
                  mt-2
                "
              >
                {totalBelum}
              </p>

              <p className="text-sm text-red-600 mt-2">
                Siswa perlu ditindaklanjuti
              </p>

            </div>

          </div>

          {/* =================================================
              TABEL
          ================================================= */}

          <div
            className="
              bg-white
              rounded-xl
              shadow-sm
              border
              border-gray-200
              p-6
            "
          >

            {/* HEADER TABEL */}

            <div
              className="
                flex
                flex-col
                md:flex-row
                md:items-center
                md:justify-between
                gap-4
                mb-6
              "
            >

              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Daftar Status Kartu
                </h2>

                <p className="text-sm text-gray-500 mt-1">
                  Kelola status kartu ujian setiap siswa.
                </p>
              </div>

              {/* SEARCH */}

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Cari NIS, NISN, atau Nama..."
                className="
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  w-full
                  md:w-96
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                "
              />

            </div>

            {/* =================================================
                TABLE WRAPPER
            ================================================= */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[850px]">

                <thead>

                  <tr className="border-b border-gray-200">

                    <th className="text-left py-4 px-3 text-gray-700">
                      No
                    </th>

                    <th className="text-left py-4 px-3 text-gray-700">
                      NIS
                    </th>

                    <th className="text-left py-4 px-3 text-gray-700">
                      NISN
                    </th>

                    <th className="text-left py-4 px-3 text-gray-700">
                      Nama
                    </th>

                    <th className="text-left py-4 px-3 text-gray-700">
                      Kelas
                    </th>

                    <th className="text-center py-4 px-3 text-gray-700">
                      Status
                    </th>

                    <th className="text-center py-4 px-3 text-gray-700">
                      Aksi
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {/* LOADING */}

                  {loading ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="
                          text-center
                          py-12
                          text-gray-400
                        "
                      >
                        Memuat data siswa...
                      </td>

                    </tr>

                  ) : filteredStudents.length === 0 ? (

                    /* DATA KOSONG */

                    <tr>

                      <td
                        colSpan={7}
                        className="
                          text-center
                          py-12
                          text-gray-400
                        "
                      >
                        {search
                          ? "Data siswa tidak ditemukan."
                          : "Belum ada data siswa."
                        }
                      </td>

                    </tr>

                  ) : (

                    /* DATA SISWA */

                    filteredStudents.map(
                      (student, index) => {

                        const kelas =
                          student.classes;

                        const namaKelas =
                          kelas
                            ? `${kelas.grade} ${
                                kelas.majors?.code ??
                                ""
                              } ${
                                kelas.class_number
                              }`.trim()
                            : "-";

                        return (

                          <tr
                            key={student.id}
                            className="
                              border-b
                              border-gray-100
                              hover:bg-gray-50
                            "
                          >

                            {/* NO */}

                            <td className="py-4 px-3">
                              {index + 1}
                            </td>

                            {/* NIS */}

                            <td className="py-4 px-3">
                              {student.nis}
                            </td>

                            {/* NISN */}

                            <td className="py-4 px-3">
                              {student.nisn}
                            </td>

                            {/* NAMA */}

                            <td className="py-4 px-3 font-medium text-gray-900">
                              {student.full_name}
                            </td>

                            {/* KELAS */}

                            <td className="py-4 px-3">
                              {namaKelas}
                            </td>

                            {/* STATUS */}

                            <td className="py-4 px-3 text-center">

                              {student.status_kartu ===
                              "SIAP" ? (

                                <span
                                  className="
                                    inline-flex
                                    items-center
                                    px-3
                                    py-1.5
                                    rounded-full
                                    text-sm
                                    font-semibold
                                    bg-green-100
                                    text-green-700
                                  "
                                >
                                  ✓ Siap
                                </span>

                              ) : (

                                <span
                                  className="
                                    inline-flex
                                    items-center
                                    px-3
                                    py-1.5
                                    rounded-full
                                    text-sm
                                    font-semibold
                                    bg-red-100
                                    text-red-700
                                  "
                                >
                                  ✕ Belum
                                </span>

                              )}

                            </td>

                            {/* AKSI */}

                            <td className="py-4 px-3 text-center">

                              {student.status_kartu ===
                              "BELUM" ? (

                                <button
                                  type="button"
                                  onClick={() =>
                                    changeStatus(
                                      student.id,
                                      "SIAP"
                                    )
                                  }
                                  disabled={
                                    updating ===
                                    student.id
                                  }
                                  className="
                                    bg-green-600
                                    hover:bg-green-700
                                    text-white
                                    px-4
                                    py-2
                                    rounded-lg
                                    text-sm
                                    font-semibold
                                    transition
                                    disabled:bg-gray-400
                                    disabled:cursor-not-allowed
                                  "
                                >
                                  {updating ===
                                  student.id
                                    ? "..."
                                    : "Set Siap"}
                                </button>

                              ) : (

                                <button
                                  type="button"
                                  onClick={() =>
                                    changeStatus(
                                      student.id,
                                      "BELUM"
                                    )
                                  }
                                  disabled={
                                    updating ===
                                    student.id
                                  }
                                  className="
                                    bg-red-600
                                    hover:bg-red-700
                                    text-white
                                    px-4
                                    py-2
                                    rounded-lg
                                    text-sm
                                    font-semibold
                                    transition
                                    disabled:bg-gray-400
                                    disabled:cursor-not-allowed
                                  "
                                >
                                  {updating ===
                                  student.id
                                    ? "..."
                                    : "Set Belum"}
                                </button>

                              )}

                            </td>

                          </tr>

                        );
                      }
                    )

                  )}

                </tbody>

              </table>

            </div>

          </div>

        </div>

      </main>

    </div>
  );
}