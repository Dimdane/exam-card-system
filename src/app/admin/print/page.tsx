"use client";

import { useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";

type Schedule = {
  id: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  subject: string;
};

type Student = {
  id: string;
  nis: string;
  nisn: string;
  full_name: string;
  status_kartu: "BELUM" | "SIAP";
  nomor_ujian: string;
  lembar_ujian: string;
  password_ujian: string;

  class_id: string | null;
  class_name: string;
  major_name: string;

  schedules: Schedule[];
};

type Exam = {
  exam_name: string;
  academic_year: string;
  semester: string;
  school_name: string;
  server_link: string;
  exam_start_date?: string;
};

export default function PrintPage() {
  const [keyword, setKeyword] = useState("");

  const [students, setStudents] =
    useState<Student[]>([]);

  const [selectedStudent, setSelectedStudent] =
    useState<Student | null>(null);

  const [exam, setExam] =
    useState<Exam | null>(null);

  const [schedules, setSchedules] =
    useState<Schedule[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // CARI SISWA
  // =====================================================

  async function searchStudent() {
    if (!keyword.trim()) {
      setError(
        "Masukkan NIS, NISN, atau nama siswa."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setStudents([]);
      setSelectedStudent(null);
      setSchedules([]);

      const response = await fetch(
        "/api/admin/print?keyword=" +
          encodeURIComponent(keyword.trim())
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Data siswa tidak ditemukan."
        );
        return;
      }

      setStudents(result.data || []);

      setExam(result.exam || null);
    } catch (error) {
      console.error(error);

      setError(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  }

  // =====================================================
  // PILIH SISWA
  // =====================================================

  function selectStudent(student: Student) {
    if (student.status_kartu !== "SIAP") {
      alert(
        "Siswa ini belum mendapatkan izin untuk mencetak kartu."
      );

      return;
    }

    setSelectedStudent(student);

    // =================================================
    // PENTING:
    // Jadwal diambil dari siswa yang dipilih
    // =================================================

    setSchedules(
      student.schedules || []
    );
  }

  // =====================================================
  // FORMAT TANGGAL
  // =====================================================

  function formatDate(date?: string) {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(date + "T00:00:00");

    if (isNaN(parsedDate.getTime())) {
      return "-";
    }

    return parsedDate.toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  }

  // =====================================================
  // FORMAT JAM
  // =====================================================

  function formatTime(time?: string) {
    if (!time) {
      return "-";
    }

    return time.substring(0, 5);
  }

  // =====================================================
  // CETAK
  // =====================================================

  function printCard() {
    window.print();
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* =================================================
          AREA ADMIN
      ================================================= */}

      <div className="print:hidden">

        <div className="bg-white border-b px-8 py-5">
            <BackToDashboard />
          <h1 className="text-2xl font-bold">
            Cetak Kartu Ujian
          </h1>

          <p className="text-gray-500 mt-1">
            Cari siswa yang sudah mendapatkan izin
            mencetak kartu.
          </p>

        </div>

        <div className="p-8">

          {/* =================================================
              FORM PENCARIAN
          ================================================= */}

          <div className="bg-white rounded-xl shadow p-6">

            <div className="flex gap-3">

              <input
                type="text"
                value={keyword}
                onChange={(e) =>
                  setKeyword(e.target.value)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    searchStudent();
                  }
                }}
                placeholder="Masukkan NIS, NISN, atau nama siswa..."
                className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <button
                type="button"
                onClick={searchStudent}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-6 py-3 rounded-lg font-semibold"
              >
                {loading
                  ? "Mencari..."
                  : "Cari Siswa"}
              </button>

            </div>

            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4">
                {error}
              </div>
            )}

          </div>


          {/* =================================================
              HASIL PENCARIAN
          ================================================= */}

          {students.length > 0 && (

            <div className="bg-white rounded-xl shadow p-6 mt-6">

              <h2 className="text-xl font-bold mb-4">
                Hasil Pencarian
              </h2>

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead>

                    <tr className="border-b">

                      <th className="text-left py-3">
                        NIS
                      </th>

                      <th className="text-left py-3">
                        Nama
                      </th>

                      <th className="text-left py-3">
                        Kelas
                      </th>

                      <th className="text-center py-3">
                        Status
                      </th>

                      <th className="text-center py-3">
                        Aksi
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {students.map(
                      (student) => (

                        <tr
                          key={student.id}
                          className="border-b"
                        >

                          <td className="py-4">
                            {student.nis}
                          </td>

                          <td className="py-4 font-medium">
                            {student.full_name}
                          </td>

                          <td className="py-4">
                            {student.class_name}
                          </td>

                          <td className="py-4 text-center">

                            {student.status_kartu ===
                            "SIAP" ? (

                              <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                                Siap
                              </span>

                            ) : (

                              <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                                Belum
                              </span>

                            )}

                          </td>

                          <td className="py-4 text-center">

                            <button
                              type="button"
                              onClick={() =>
                                selectStudent(student)
                              }
                              disabled={
                                student.status_kartu !==
                                "SIAP"
                              }
                              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg text-sm"
                            >
                              Pilih
                            </button>

                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            </div>

          )}

        </div>

      </div>


      {/* =====================================================
          KARTU UJIAN
      ===================================================== */}

      {selectedStudent && (

        <div className="print-area">

          <div className="max-w-[210mm] mx-auto py-8 px-6 print:p-0">

            <div className="bg-white border border-gray-300 p-8 print:border-0">

              {/* =================================================
                  HEADER
              ================================================= */}

              <div className="flex items-center border-b-2 border-gray-800 pb-4 mb-5">

                <div className="w-28 shrink-0">

                  <img
                    src="/images/SMKEKNOM.jpeg"
                    alt="Logo SMK Ekonomika"
                    className="w-24 h-auto object-contain"
                  />

                </div>

                <div className="flex-1 text-center">

                  <h1 className="text-xl font-bold">
                    SMK EKONOMIKA
                  </h1>

                  <p className="text-base font-bold mt-1">
                    KARTU PESERTA UJIAN
                  </p>

                  <p className="text-sm">
                    Penilaian Sumatif Akhir Tahun{" "}
                    ({exam?.semester || "GENAP"})
                  </p>

                </div>

              </div>


              {/* =================================================
                  DATA PESERTA
              ================================================= */}

              <div className="grid grid-cols-2 gap-x-10 text-sm mb-6">

                <div className="space-y-3">

                  <div className="flex">

                    <span className="w-32">
                      Nomor Ujian
                    </span>

                    <span>:</span>

                    <strong className="ml-2">
                      {selectedStudent.nomor_ujian}
                    </strong>

                  </div>


                  <div className="flex">

                    <span className="w-32">
                      Nama Peserta
                    </span>

                    <span>:</span>

                    <strong className="ml-2">
                      {selectedStudent.full_name}
                    </strong>

                  </div>


                  <div className="flex">

                    <span className="w-32">
                      Kelas / Tingkat
                    </span>

                    <span>:</span>

                    <strong className="ml-2">
                      {selectedStudent.class_name}
                    </strong>

                  </div>

                </div>


                <div className="space-y-3">

                  <div className="flex">

                    <span className="w-32">
                      NIS
                    </span>

                    <span>:</span>

                    <strong className="ml-2">
                      {selectedStudent.nis}
                    </strong>

                  </div>


                  <div className="flex">

                    <span className="w-32">
                      NISN
                    </span>

                    <span>:</span>

                    <strong className="ml-2">
                      {selectedStudent.nisn}
                    </strong>

                  </div>


                  <div className="flex">

                    <span className="w-32">
                      Program Keahlian
                    </span>

                    <span>:</span>

                    <strong className="ml-2">
                      {selectedStudent.major_name ||
                        "-"}
                    </strong>

                  </div>

                </div>

              </div>


              {/* =================================================
                  DATA LOGIN
              ================================================= */}

              <div className="grid grid-cols-3 border border-gray-700 mb-5">

                <div className="border-r border-gray-700 p-3">

                  <p className="font-bold">
                    Lembar
                  </p>

                  <p className="mt-1">
                    {selectedStudent.lembar_ujian ||
                      "-"}
                  </p>

                </div>


                <div className="border-r border-gray-700 p-3">

                  <p className="font-bold">
                    Password
                  </p>

                  <p className="mt-1">
                    {selectedStudent.password_ujian ||
                      "-"}
                  </p>

                </div>


                <div className="p-3">

                  <p className="font-bold">
                    Link Server
                  </p>

                  <p className="mt-1 break-all">
                    {exam?.server_link || "-"}
                  </p>

                </div>

              </div>


              {/* =================================================
                  JADWAL UJIAN
              ================================================= */}

              <table className="w-full border-collapse text-sm">

                <thead>

                  <tr>

                    <th className="border border-gray-700 p-2 text-center">
                      HARI / TANGGAL
                    </th>

                    <th className="border border-gray-700 p-2 text-center">
                      WAKTU
                    </th>

                    <th className="border border-gray-700 p-2 text-center">
                      MATA UJIAN
                    </th>

                    <th className="border border-gray-700 p-2 text-center">
                      PARAF PENGAWAS
                    </th>

                  </tr>

                </thead>


                <tbody>

                  {schedules.length === 0 ? (

                    <tr>

                      <td
                        colSpan={4}
                        className="border border-gray-700 p-4 text-center"
                      >
                        Jadwal belum tersedia
                      </td>

                    </tr>

                  ) : (

                    schedules.map(
                      (schedule) => (

                        <tr key={schedule.id}>

                          <td className="border border-gray-700 p-2">
                            {formatDate(
                              schedule.exam_date
                            )}
                          </td>

                          <td className="border border-gray-700 p-2 text-center">

                            {formatTime(
                              schedule.start_time
                            )}

                            {" - "}

                            {formatTime(
                              schedule.end_time
                            )}

                          </td>

                          <td className="border border-gray-700 p-2">
                            {schedule.subject}
                          </td>

                          <td className="border border-gray-700 p-2 h-12">
                          </td>

                        </tr>

                      )
                    )

                  )}

                </tbody>

              </table>


              {/* =================================================
                  KETERANGAN
              ================================================= */}

              <div className="mt-5 text-xs">

                <p className="font-bold mb-1">
                  Keterangan:
                </p>

                <ol className="list-decimal ml-5 space-y-1">

                  <li>
                    Peserta wajib membawa
                    Kartu Peserta Ujian.
                  </li>

                  <li>
                    Peserta yang terlambat tidak
                    mendapat tambahan waktu.
                  </li>

                  <li>
                    Tidak diperkenankan membawa
                    peralatan yang tidak berkaitan
                    dengan keperluan ujian.
                  </li>

                  <li>
                    Kartu hilang/tertinggal dikenakan
                    biaya administrasi sesuai
                    ketentuan sekolah.
                  </li>

                </ol>

              </div>


              {/* =================================================
                  TANDA TANGAN
              ================================================= */}

              <div className="flex justify-end mt-7">

                <div className="text-center text-sm w-56">

                  <p>
                    Depok,{" "}
                    {formatDate(
                      exam?.exam_start_date
                    )}
                  </p>

                  <p className="font-semibold mt-1">
                    Ketua Pelaksana
                  </p>

                  <div className="h-16">
                  </div>

                  <p className="font-bold">
                    ______________________
                  </p>

                </div>

              </div>

            </div>


            {/* =================================================
                TOMBOL CETAK
            ================================================= */}

            <div className="mt-6 text-center print:hidden">

              <button
                type="button"
                onClick={printCard}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold"
              >
                Cetak Kartu
              </button>

            </div>

          </div>

        </div>

      )}

    </div>
  );
}