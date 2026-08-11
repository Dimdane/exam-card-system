import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import Link from "next/link";
import DeleteStudentButton from "@/components/DeleteStudentButton";

import { getStudents } from "@/services/student.service";
export const dynamic = "force-dynamic";
export default async function StudentPage() {
  const students = await getStudents();

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          AREA KONTEN
      ===================================================== */}

      <div className="ml-[330px] min-h-screen">

        {/* HEADER */}

        <Header />

        {/* =================================================
            MAIN CONTENT
        ================================================= */}

        <main className="p-8">

          {/* =================================================
              JUDUL + TOMBOL TAMBAH
          ================================================= */}

          <div
            className="
              flex
              items-center
              justify-between
              mb-6
            "
          >

            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Data Siswa
              </h1>

              <p className="text-gray-500 mt-1">
                Daftar siswa SMK Ekonomika
              </p>
            </div>

            <div className="flex items-center gap-3">
  <Link
    href="/admin/import"
    className="
      inline-flex
      items-center
      justify-center
      bg-green-600
      hover:bg-green-700
      text-white
      px-5
      py-3
      rounded-lg
      font-semibold
      transition
    "
  >
    Import Data
  </Link>

  <Link
    href="/admin/students/create"
    className="
      inline-flex
      items-center
      justify-center
      bg-blue-600
      hover:bg-blue-700
      text-white
      px-5
      py-3
      rounded-lg
      font-semibold
      transition
      shadow-sm
    "
  >
    + Tambah Siswa
  </Link>
</div>

          </div>

          {/* =================================================
              TABEL DATA SISWA
          ================================================= */}

          <div
            className="
              bg-white
              rounded-xl
              shadow-sm
              border
              border-gray-100
              p-6
            "
          >

            {/* SEARCH */}

            <div className="mb-6">

              <input
                type="text"
                placeholder="Cari Nama / NIS..."
                className="
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  w-full
                  max-w-sm
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                "
              />

            </div>

            {/* =================================================
                TABLE
            ================================================= */}

            <div className="overflow-x-auto">

              <table className="w-full min-w-[900px]">

                {/* HEADER TABLE */}

                <thead>

                  <tr
                    className="
                      border-b
                      border-gray-200
                    "
                  >

                    <th
                      className="
                        text-left
                        py-4
                        px-3
                        font-semibold
                        text-gray-700
                      "
                    >
                      No
                    </th>

                    <th
                      className="
                        text-left
                        py-4
                        px-3
                        font-semibold
                        text-gray-700
                      "
                    >
                      NIS
                    </th>

                    <th
                      className="
                        text-left
                        py-4
                        px-3
                        font-semibold
                        text-gray-700
                      "
                    >
                      NISN
                    </th>

                    <th
                      className="
                        text-left
                        py-4
                        px-3
                        font-semibold
                        text-gray-700
                      "
                    >
                      Nama
                    </th>

                    <th
                      className="
                        text-left
                        py-4
                        px-3
                        font-semibold
                        text-gray-700
                      "
                    >
                      Kelas
                    </th>

                    <th
                      className="
                        text-left
                        py-4
                        px-3
                        font-semibold
                        text-gray-700
                      "
                    >
                      Status
                    </th>

                    <th
                      className="
                        text-center
                        py-4
                        px-3
                        font-semibold
                        text-gray-700
                      "
                    >
                      Aksi
                    </th>

                  </tr>

                </thead>

                {/* BODY TABLE */}

                <tbody>

                  {students.length === 0 ? (

                    <tr>

                      <td
                        colSpan={7}
                        className="
                          text-center
                          py-12
                          text-gray-400
                        "
                      >
                        Belum ada data siswa
                      </td>

                    </tr>

                  ) : (

                    students.map(
                      (
                        student: any,
                        index: number
                      ) => {

                        const kelas =
                          student.classes;

                        const jurusan =
                          kelas?.majors?.code ??
                          "";

                        const namaKelas =
                          kelas
                            ? `${kelas.grade} ${jurusan} ${kelas.class_number}`
                            : "-";

                        return (

                          <tr
                            key={student.id}
                            className="
                              border-b
                              border-gray-100
                              hover:bg-gray-50
                              transition
                            "
                          >

                            {/* NO */}

                            <td
                              className="
                                py-4
                                px-3
                                text-gray-700
                              "
                            >
                              {index + 1}
                            </td>

                            {/* NIS */}

                            <td
                              className="
                                py-4
                                px-3
                                text-gray-700
                              "
                            >
                              {student.nis}
                            </td>

                            {/* NISN */}

                            <td
                              className="
                                py-4
                                px-3
                                text-gray-700
                              "
                            >
                              {student.nisn}
                            </td>

                            {/* NAMA */}

                            <td
                              className="
                                py-4
                                px-3
                                font-medium
                                text-gray-800
                              "
                            >
                              {student.full_name}
                            </td>

                            {/* KELAS */}

                            <td
                              className="
                                py-4
                                px-3
                                text-gray-700
                              "
                            >
                              {namaKelas}
                            </td>

                            {/* STATUS */}

                            <td
                              className="
                                py-4
                                px-3
                              "
                            >

                              {student.is_active ? (

                                <span
                                  className="
                                    inline-flex
                                    items-center
                                    px-3
                                    py-1
                                    rounded-full
                                    text-sm
                                    font-medium
                                    bg-green-100
                                    text-green-700
                                  "
                                >
                                  Aktif
                                </span>

                              ) : (

                                <span
                                  className="
                                    inline-flex
                                    items-center
                                    px-3
                                    py-1
                                    rounded-full
                                    text-sm
                                    font-medium
                                    bg-gray-100
                                    text-gray-600
                                  "
                                >
                                  Tidak Aktif
                                </span>

                              )}

                            </td>

                            {/* AKSI */}

                            <td
                              className="
                                py-4
                                px-3
                                text-center
                                whitespace-nowrap
                              "
                            >

                              <Link
                                href={`/admin/students/${student.id}/edit`}
                                className="
                                  text-blue-600
                                  hover:text-blue-800
                                  font-medium
                                  mr-4
                                "
                              >
                                Edit
                              </Link>

                              <DeleteStudentButton
                                id={student.id}
                                name={student.full_name}
                              />

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

        </main>

      </div>

    </div>
  );
}