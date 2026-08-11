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

  async function loadStudents() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/status"
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal mengambil data siswa."
        );

        return;
      }

      setStudents(result.data);
    } catch (error) {
      console.error(error);

      alert(
        "Tidak dapat mengambil data siswa."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStudents();
  }, []);

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

  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen">

        <Header />

        <div className="p-8">

          {/* Judul */}
          <div className="mb-6">

            <h1 className="text-3xl font-bold">
              Status Kartu Ujian
            </h1>

            <p className="text-gray-500 mt-1">
              Atur siswa yang sudah dapat mencetak
              kartu ujian.
            </p>

          </div>

          {/* Statistik */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">

            <div className="bg-white rounded-xl shadow p-5">

              <p className="text-gray-500">
                Total Siswa
              </p>

              <p className="text-3xl font-bold mt-2">
                {students.length}
              </p>

            </div>

            <div className="bg-green-50 rounded-xl shadow p-5">

              <p className="text-green-700">
                Kartu Siap
              </p>

              <p className="text-3xl font-bold text-green-700 mt-2">
                {
                  students.filter(
                    (student) =>
                      student.status_kartu ===
                      "SIAP"
                  ).length
                }
              </p>

            </div>

            <div className="bg-red-50 rounded-xl shadow p-5">

              <p className="text-red-700">
                Belum Siap
              </p>

              <p className="text-3xl font-bold text-red-700 mt-2">
                {
                  students.filter(
                    (student) =>
                      student.status_kartu ===
                      "BELUM"
                  ).length
                }
              </p>

            </div>

          </div>

          {/* Tabel */}
          <div className="bg-white rounded-xl shadow p-5">

            <div className="mb-5">

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Cari NIS, NISN, atau Nama..."
                className="
                  border
                  rounded-lg
                  px-4
                  py-3
                  w-full
                  md:w-96
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b">

                    <th className="text-left py-3 px-2">
                      No
                    </th>

                    <th className="text-left py-3 px-2">
                      NIS
                    </th>

                    <th className="text-left py-3 px-2">
                      Nama
                    </th>

                    <th className="text-left py-3 px-2">
                      Kelas
                    </th>

                    <th className="text-center py-3 px-2">
                      Status
                    </th>

                    <th className="text-center py-3 px-2">
                      Aksi
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {loading ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="text-center py-10 text-gray-400"
                      >
                        Memuat data...
                      </td>

                    </tr>

                  ) : filteredStudents.length === 0 ? (

                    <tr>

                      <td
                        colSpan={6}
                        className="text-center py-10 text-gray-400"
                      >
                        Data siswa tidak ditemukan.
                      </td>

                    </tr>

                  ) : (

                    filteredStudents.map(
                      (student, index) => {

                        const kelas =
                          student.classes;

                        const namaKelas = kelas
                          ? `${kelas.grade} ${
                              kelas.majors?.code ??
                              ""
                            } ${
                              kelas.class_number
                            }`
                          : "-";

                        return (

                          <tr
                            key={student.id}
                            className="border-b hover:bg-gray-50"
                          >

                            <td className="py-4 px-2">
                              {index + 1}
                            </td>

                            <td className="py-4 px-2">
                              {student.nis}
                            </td>

                            <td className="py-4 px-2 font-medium">
                              {student.full_name}
                            </td>

                            <td className="py-4 px-2">
                              {namaKelas}
                            </td>

                            <td className="py-4 px-2 text-center">

                              {student.status_kartu ===
                              "SIAP" ? (

                                <span className="
                                  inline-flex
                                  px-3
                                  py-1
                                  rounded-full
                                  text-sm
                                  font-semibold
                                  bg-green-100
                                  text-green-700
                                ">
                                  ✓ Siap
                                </span>

                              ) : (

                                <span className="
                                  inline-flex
                                  px-3
                                  py-1
                                  rounded-full
                                  text-sm
                                  font-semibold
                                  bg-red-100
                                  text-red-700
                                ">
                                  ✕ Belum
                                </span>

                              )}

                            </td>

                            <td className="py-4 px-2 text-center">

                              {student.status_kartu ===
                              "BELUM" ? (

                                <button
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
                                    disabled:bg-gray-400
                                  "
                                >
                                  {updating ===
                                  student.id
                                    ? "..."
                                    : "Set Siap"}
                                </button>

                              ) : (

                                <button
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
                                    disabled:bg-gray-400
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