"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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

export default function KartuUjianClient() {
  const searchParams = useSearchParams();

  const nis = searchParams.get("nis");

  const [student, setStudent] =
    useState<Student | null>(null);

  const [exam, setExam] =
    useState<Exam | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // =====================================================
  // AMBIL DATA KARTU
  // =====================================================

  useEffect(() => {
    async function loadData() {
      if (!nis) {
        setError(
          "Nomor NIS tidak ditemukan."
        );

        setLoading(false);

        return;
      }

      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `/api/admin/print?keyword=${encodeURIComponent(
            nis
          )}`
        );

        const result =
          await response.json();

        if (
          !response.ok ||
          !result.success
        ) {
          setError(
            result.message ||
              "Data kartu ujian tidak ditemukan."
          );

          return;
        }

        // =================================================
        // DATA SISWA
        // =================================================

        const studentData =
          result.data?.[0];

        if (!studentData) {
          setError(
            "Data siswa tidak ditemukan."
          );

          return;
        }

        setStudent(studentData);

        // =================================================
        // DATA UJIAN
        // =================================================

        if (result.exam) {
          setExam(result.exam);
        }
      } catch (err) {
        console.error(err);

        setError(
          "Terjadi kesalahan saat mengambil data kartu ujian."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [nis]);

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-lg font-semibold text-gray-800">
            Memuat kartu ujian...
          </div>

          <p className="text-gray-500 mt-2">
            Mohon tunggu sebentar.
          </p>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !student) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-5xl mb-4">
            ⚠️
          </div>

          <h1 className="text-xl font-bold text-gray-800">
            Kartu Ujian Tidak Ditemukan
          </h1>

          <p className="text-gray-500 mt-3">
            {error ||
              "Data siswa tidak ditemukan."}
          </p>

          <a
            href="/"
            className="
              inline-flex
              items-center
              justify-center
              mt-6
              bg-blue-600
              hover:bg-blue-700
              text-white
              px-6
              py-3
              rounded-lg
              font-semibold
              transition
            "
          >
            ← Kembali ke Cek Kartu
          </a>
        </div>
      </main>
    );
  }

  // =====================================================
  // FORMAT TANGGAL
  // =====================================================

  function formatDate(date: string) {
    if (!date) return "-";

    const value = new Date(date);

    return value.toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  }

  // =====================================================
  // CETAK
  // =====================================================

  function handlePrint() {
    window.print();
  }

  // =====================================================
  // RENDER
  // =====================================================

  return (
    <>
      {/* =================================================
          PRINT STYLE
      ================================================= */}

      <style>{`
        @media print {
          body {
            background: #fff !important;
          }

          .no-print {
            display: none !important;
          }

          .exam-card {
            box-shadow: none !important;
            border: 1px solid #000 !important;
          }

          @page {
            size: A4 portrait;
            margin: 10mm;
          }
        }
      `}</style>

      <main className="min-h-screen bg-gray-100 py-10 px-4">

        {/* =================================================
            ACTION
        ================================================= */}

        <div className="max-w-4xl mx-auto mb-6 no-print">
          <div className="flex items-center justify-between gap-3">

            <a
              href="/"
              className="
                inline-flex
                items-center
                justify-center
                bg-white
                hover:bg-gray-50
                text-gray-700
                border
                border-gray-300
                px-5
                py-3
                rounded-lg
                font-semibold
                transition
              "
            >
              ← Kembali ke Cek Kartu
            </a>

            <button
              type="button"
              onClick={handlePrint}
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
              "
            >
              🖨 Cetak Kartu
            </button>

          </div>
        </div>

        {/* =================================================
            KARTU
        ================================================= */}

        <div
          className="
            exam-card
            max-w-4xl
            mx-auto
            bg-white
            rounded-xl
            shadow-lg
            overflow-hidden
          "
        >

          {/* HEADER */}

          <div className="border-b-2 border-gray-800 p-6">

            <div className="flex items-center gap-4">

              <img
                src="/images/SMKEKNOM.jpeg"
                alt="SMK Ekonomika"
                className="
                  w-20
                  h-20
                  object-contain
                "
              />

              <div className="flex-1 text-center">

                <h1 className="text-xl font-bold">
                  {exam?.school_name ||
                    "SMK EKONOMIKA"}
                </h1>

                <h2 className="text-2xl font-bold mt-1">
                  KARTU PESERTA UJIAN
                </h2>

                {exam?.exam_name && (
                  <p className="text-gray-600 mt-1">
                    {exam.exam_name}
                  </p>
                )}

              </div>

            </div>

          </div>

          {/* DATA PESERTA */}

          <div className="p-6">

            <h3 className="font-bold text-lg border-b pb-2 mb-5">
              DATA PESERTA
            </h3>

            <div className="grid grid-cols-[160px_20px_1fr] gap-y-3 text-sm">

              <span>NIS</span>
              <span>:</span>
              <strong>
                {student.nis}
              </strong>

              <span>NISN</span>
              <span>:</span>
              <strong>
                {student.nisn}
              </strong>

              <span>Nama Lengkap</span>
              <span>:</span>
              <strong>
                {student.full_name}
              </strong>

              <span>Kelas</span>
              <span>:</span>
              <strong>
                {student.class_name}
              </strong>

              <span>Jurusan</span>
              <span>:</span>
              <strong>
                {student.major_name || "-"}
              </strong>

            </div>

          </div>

          {/* NOMOR UJIAN */}

          <div className="px-6 pb-6">

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

              <div className="border rounded-lg p-4 text-center">

                <p className="text-xs text-gray-500">
                  NOMOR UJIAN
                </p>

                <p className="text-xl font-bold mt-2">
                  {student.nomor_ujian || "-"}
                </p>

              </div>

              <div className="border rounded-lg p-4 text-center">

                <p className="text-xs text-gray-500">
                  LEMBAR UJIAN
                </p>

                <p className="text-xl font-bold mt-2">
                  {student.lembar_ujian || "-"}
                </p>

              </div>

              <div className="border rounded-lg p-4 text-center">

                <p className="text-xs text-gray-500">
                  PASSWORD
                </p>

                <p className="text-xl font-bold mt-2">
                  {student.password_ujian || "-"}
                </p>

              </div>

            </div>

          </div>

          {/* JADWAL */}

          <div className="px-6 pb-6">

            <h3 className="font-bold text-lg border-b pb-2 mb-4">
              JADWAL UJIAN
            </h3>

            {student.schedules &&
            student.schedules.length > 0 ? (

              <div className="overflow-x-auto">

                <table className="w-full border-collapse text-sm">

                  <thead>

                    <tr className="bg-gray-100">

                      <th className="border px-3 py-3 text-center">
                        No
                      </th>

                      <th className="border px-3 py-3 text-left">
                        Tanggal
                      </th>

                      <th className="border px-3 py-3 text-center">
                        Waktu
                      </th>

                      <th className="border px-3 py-3 text-left">
                        Mata Pelajaran
                      </th>

                    </tr>

                  </thead>

                  <tbody>

                    {student.schedules.map(
                      (schedule, index) => (

                        <tr
                          key={schedule.id}
                        >

                          <td className="border px-3 py-3 text-center">
                            {index + 1}
                          </td>

                          <td className="border px-3 py-3">
                            {formatDate(
                              schedule.exam_date
                            )}
                          </td>

                          <td className="border px-3 py-3 text-center">
                            {schedule.start_time} -{" "}
                            {schedule.end_time}
                          </td>

                          <td className="border px-3 py-3 font-medium">
                            {schedule.subject}
                          </td>

                        </tr>

                      )
                    )}

                  </tbody>

                </table>

              </div>

            ) : (

              <div className="border border-dashed rounded-lg p-6 text-center text-gray-500">
                Jadwal ujian belum tersedia.
              </div>

            )}

          </div>

          {/* INFORMASI */}

          <div className="mx-6 mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">

            <p className="font-semibold text-blue-800">
              Informasi Ujian
            </p>

            {exam?.academic_year && (
              <p className="text-sm text-blue-700 mt-1">
                Tahun Pelajaran:{" "}
                {exam.academic_year}
              </p>
            )}

            {exam?.semester && (
              <p className="text-sm text-blue-700">
                Semester:{" "}
                {exam.semester}
              </p>
            )}

            {exam?.server_link && (
              <p className="text-sm text-blue-700">
                Server Ujian:{" "}
                {exam.server_link}
              </p>
            )}

          </div>

          {/* STATUS */}

          <div className="border-t p-6 text-center">

            <p className="text-sm text-gray-500">
              Status Kartu
            </p>

            <p
              className={`
                text-xl
                font-bold
                mt-1
                ${
                  student.status_kartu === "SIAP"
                    ? "text-green-600"
                    : "text-red-600"
                }
              `}
            >
              {student.status_kartu === "SIAP"
                ? "KARTU UJIAN SIAP DIGUNAKAN"
                : "KARTU UJIAN BELUM SIAP"}
            </p>

          </div>

        </div>

      </main>
    </>
  );
}