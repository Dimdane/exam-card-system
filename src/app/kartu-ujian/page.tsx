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

export default function KartuUjianPage() {
  const searchParams = useSearchParams();
  const nis = searchParams.get("nis");

  const [student, setStudent] = useState<Student | null>(null);
  const [exam, setExam] = useState<Exam | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!nis) {
      setError("NIS siswa tidak ditemukan.");
      setLoading(false);
      return;
    }

    loadStudent(nis);
  }, [nis]);

  async function loadStudent(studentNis: string) {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/print?keyword=" +
          encodeURIComponent(studentNis)
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message || "Data siswa tidak ditemukan."
        );
        return;
      }

      if (!result.data || result.data.length === 0) {
        setError("Data siswa tidak ditemukan.");
        return;
      }

      const foundStudent =
        result.data.find(
          (item: Student) => item.nis === studentNis
        ) || result.data[0];

      if (foundStudent.status_kartu !== "SIAP") {
        setError(
          "Kartu ujian siswa belum siap dicetak."
        );
        return;
      }

      setStudent(foundStudent);
      setExam(result.exam || null);
    } catch (error) {
      console.error("Load Student Error:", error);

      setError(
        "Terjadi kesalahan saat mengambil data kartu."
      );
    } finally {
      setLoading(false);
    }
  }

  function formatDate(date?: string) {
    if (!date) {
      return "-";
    }

    const parsedDate = new Date(
      date + "T00:00:00"
    );

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

  function formatTime(time?: string) {
    if (!time) {
      return "-";
    }

    return time.substring(0, 5);
  }

  function printCard() {
    window.print();
  }

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow p-8 text-center">
          <div className="text-lg font-semibold text-gray-700">
            Memuat kartu ujian...
          </div>

          <div className="text-sm text-gray-500 mt-2">
            Mohon tunggu sebentar.
          </div>
        </div>
      </main>
    );
  }

  // =====================================================
  // ERROR
  // =====================================================

  if (error || !student) {
    return (
      <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
          <div className="text-red-600 text-5xl mb-4">
            !
          </div>

          <h1 className="text-2xl font-bold text-gray-800">
            Kartu Ujian Tidak Dapat Ditampilkan
          </h1>

          <p className="text-gray-500 mt-3">
            {error || "Data siswa tidak ditemukan."}
          </p>

          <a
            href="/"
            className="inline-flex items-center justify-center mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition"
          >
            Kembali ke Cek Kartu
          </a>
        </div>
      </main>
    );
  }

  // =====================================================
  // KARTU UJIAN
  // =====================================================

  return (
    <main className="min-h-screen bg-gray-100 py-8">
      <div className="print-area">
        <div className="max-w-[210mm] mx-auto px-6 print:p-0">

          {/* KARTU */}
          <div className="bg-white border border-gray-300 p-8 print:border-0">

            {/* HEADER */}
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
                  {exam?.school_name ||
                    "SMK EKONOMIKA"}
                </h1>

                <p className="text-base font-bold mt-1">
                  KARTU PESERTA UJIAN
                </p>

                <p className="text-sm">
                  {exam?.exam_name ||
                    "PENILAIAN SUMATIF AKHIR TAHUN"}
                </p>

              </div>
            </div>

            {/* DATA SISWA */}
            <div className="grid grid-cols-2 gap-x-10 text-sm mb-6">

              {/* KIRI */}
              <div className="space-y-3">

                <div className="flex">
                  <span className="w-32">
                    Nomor Ujian
                  </span>

                  <span>:</span>

                  <strong className="ml-2">
                    {student.nomor_ujian || "-"}
                  </strong>
                </div>

                <div className="flex">
                  <span className="w-32">
                    Nama Peserta
                  </span>

                  <span>:</span>

                  <strong className="ml-2">
                    {student.full_name}
                  </strong>
                </div>

                <div className="flex">
                  <span className="w-32">
                    Kelas / Tingkat
                  </span>

                  <span>:</span>

                  <strong className="ml-2">
                    {student.class_name}
                  </strong>
                </div>

              </div>

              {/* KANAN */}
              <div className="space-y-3">

                <div className="flex">
                  <span className="w-32">
                    NIS
                  </span>

                  <span>:</span>

                  <strong className="ml-2">
                    {student.nis}
                  </strong>
                </div>

                <div className="flex">
                  <span className="w-32">
                    NISN
                  </span>

                  <span>:</span>

                  <strong className="ml-2">
                    {student.nisn}
                  </strong>
                </div>

                <div className="flex">
                  <span className="w-32">
                    Program Keahlian
                  </span>

                  <span>:</span>

                  <strong className="ml-2">
                    {student.major_name || "-"}
                  </strong>
                </div>

              </div>
            </div>

            {/* LEMBAR - PASSWORD - SERVER */}
            <div className="grid grid-cols-3 border border-gray-700 mb-5">

              <div className="border-r border-gray-700 p-3">
                <p className="font-bold">
                  Lembar
                </p>

                <p className="mt-1">
                  {student.lembar_ujian || "-"}
                </p>
              </div>

              <div className="border-r border-gray-700 p-3">
                <p className="font-bold">
                  Password
                </p>

                <p className="mt-1">
                  {student.password_ujian || "-"}
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

            {/* JADWAL UJIAN */}
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

                {student.schedules &&
                student.schedules.length > 0 ? (
                  student.schedules.map(
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
                ) : (
                  <tr>
                    <td
                      colSpan={4}
                      className="border border-gray-700 p-4 text-center"
                    >
                      Jadwal ujian belum tersedia.
                    </td>
                  </tr>
                )}

              </tbody>
            </table>

            {/* KETERANGAN */}
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

            {/* TANDA TANGAN */}
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

                <div className="h-16"></div>

                <p className="font-bold">
                  ______________________
                </p>

              </div>

            </div>

          </div>

          {/* TOMBOL */}
<div className="mt-6 flex items-center justify-center gap-3 print:hidden">

  <a
    href="/"
    className="inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 px-6 py-3 rounded-lg font-semibold transition"
  >
    Kembali ke Cek Kartu
  </a>

  <button
    type="button"
    onClick={printCard}
    className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition"
  >
    Cetak Kartu
  </button>

</div>

        </div>
      </div>

      {/* PRINT STYLE */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            margin: 0 !important;
            padding: 0 !important;
          }

          .print-area {
            display: block !important;
            width: 100% !important;
          }

          @page {
            size: A4;
            margin: 8mm;
          }
        }
      `}</style>
    </main>
  );
}