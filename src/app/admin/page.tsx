"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

type DashboardData = {
  totalStudents: number;
  readyCards: number;
  notReadyCards: number;
  totalClasses: number;
  totalMajors: number;
};

export default function AdminPage() {
  const [data, setData] = useState<DashboardData>({
    totalStudents: 0,
    readyCards: 0,
    notReadyCards: 0,
    totalClasses: 0,
    totalMajors: 0,
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/dashboard"
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Gagal mengambil data dashboard."
        );

        return;
      }

      setData(result.data);
    } catch (error) {
      console.error(error);

      setError(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadDashboard();
  }, []);

  const readyPercentage =
    data.totalStudents > 0
      ? Math.round(
          (data.readyCards /
            data.totalStudents) *
            100
        )
      : 0;

  const notReadyPercentage =
    data.totalStudents > 0
      ? Math.round(
          (data.notReadyCards /
            data.totalStudents) *
            100
        )
      : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <Sidebar />

      {/* =====================================================
          AREA KANAN
      ===================================================== */}

      <div className="ml-[330px] min-h-screen">
        {/* HEADER */}

        <Header />

        {/* =====================================================
            CONTENT
        ===================================================== */}

        <main className="p-8">

          {/* JUDUL */}

          <div className="mb-8">
            <h1 className="text-3xl font-bold">
              Dashboard
            </h1>

            <p className="text-gray-500 mt-1">
              Ringkasan sistem kartu ujian
              SMK Ekonomika.
            </p>
          </div>

          {/* ERROR */}

          {error && (
            <div
              className="
                mb-6
                bg-red-50
                border
                border-red-200
                text-red-700
                rounded-xl
                p-4
              "
            >
              {error}
            </div>
          )}

          {/* =================================================
              STATISTIK UTAMA
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
            "
          >
            {/* TOTAL SISWA */}

            <div
              className="
                bg-white
                rounded-xl
                shadow
                p-8
              "
            >
              <p className="text-gray-500">
                Total Siswa
              </p>

              <h2
                className="
                  text-4xl
                  font-bold
                  mt-2
                "
              >
                {loading
                  ? "..."
                  : data.totalStudents}
              </h2>

              <p
                className="
                  text-gray-400
                  mt-3
                "
              >
                Seluruh siswa terdaftar
              </p>
            </div>

            {/* KARTU SIAP */}

            <div
              className="
                bg-white
                rounded-xl
                shadow
                p-8
              "
            >
              <p className="text-gray-500">
                Kartu Siap
              </p>

              <h2
                className="
                  text-4xl
                  font-bold
                  mt-2
                  text-green-600
                "
              >
                {loading
                  ? "..."
                  : data.readyCards}
              </h2>

              <p
                className="
                  text-gray-400
                  mt-3
                "
              >
                Siswa yang dapat mencetak kartu
              </p>
            </div>

            {/* BELUM SIAP */}

            <div
              className="
                bg-white
                rounded-xl
                shadow
                p-8
              "
            >
              <p className="text-gray-500">
                Belum Siap
              </p>

              <h2
                className="
                  text-4xl
                  font-bold
                  mt-2
                  text-red-600
                "
              >
                {loading
                  ? "..."
                  : data.notReadyCards}
              </h2>

              <p
                className="
                  text-gray-400
                  mt-3
                "
              >
                Siswa yang perlu ditindaklanjuti
              </p>
            </div>
          </div>

          {/* =================================================
              DATA SEKOLAH
          ================================================= */}

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-6
              mt-6
            "
          >
            {/* TOTAL KELAS */}

            <div
              className="
                bg-white
                rounded-xl
                shadow
                p-8
              "
            >
              <p className="text-gray-500">
                Total Kelas
              </p>

              <h2
                className="
                  text-4xl
                  font-bold
                  mt-2
                "
              >
                {loading
                  ? "..."
                  : data.totalClasses}
              </h2>

              <p
                className="
                  text-gray-400
                  mt-3
                "
              >
                Kelas yang tersedia
              </p>
            </div>

            {/* TOTAL JURUSAN */}

            <div
              className="
                bg-white
                rounded-xl
                shadow
                p-8
              "
            >
              <p className="text-gray-500">
                Total Jurusan
              </p>

              <h2
                className="
                  text-4xl
                  font-bold
                  mt-2
                "
              >
                {loading
                  ? "..."
                  : data.totalMajors}
              </h2>

              <p
                className="
                  text-gray-400
                  mt-3
                "
              >
                Program keahlian
              </p>
            </div>
          </div>

          {/* =================================================
              PROGRESS KARTU
          ================================================= */}

          <div
            className="
              bg-white
              rounded-xl
              shadow
              p-8
              mt-6
            "
          >
            <h2 className="text-xl font-bold">
              Progress Kartu Ujian
            </h2>

            <p
              className="
                text-gray-500
                text-sm
                mt-1
              "
            >
              Persentase kesiapan kartu seluruh siswa.
            </p>

            {/* SIAP */}

            <div className="mt-6">
              <div
                className="
                  flex
                  justify-between
                  mb-2
                "
              >
                <span className="font-medium">
                  Kartu Siap
                </span>

                <span className="font-semibold">
                  {readyPercentage}%
                </span>
              </div>

              <div
                className="
                  w-full
                  h-4
                  bg-gray-200
                  rounded-full
                  overflow-hidden
                "
              >
                <div
                  className="
                    h-full
                    bg-green-500
                    rounded-full
                    transition-all
                  "
                  style={{
                    width: `${readyPercentage}%`,
                  }}
                />
              </div>
            </div>

            {/* BELUM SIAP */}

            <div className="mt-6">
              <div
                className="
                  flex
                  justify-between
                  mb-2
                "
              >
                <span className="font-medium">
                  Belum Siap
                </span>

                <span className="font-semibold">
                  {notReadyPercentage}%
                </span>
              </div>

              <div
                className="
                  w-full
                  h-4
                  bg-gray-200
                  rounded-full
                  overflow-hidden
                "
              >
                <div
                  className="
                    h-full
                    bg-red-500
                    rounded-full
                    transition-all
                  "
                  style={{
                    width: `${notReadyPercentage}%`,
                  }}
                />
              </div>
            </div>
          </div>

          {/* =================================================
              MENU CEPAT
          ================================================= */}

          <div
            className="
              bg-white
              rounded-xl
              shadow
              p-8
              mt-6
            "
          >
            <h2
              className="
                text-xl
                font-bold
                mb-4
              "
            >
              Menu Cepat
            </h2>

            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-3
                gap-4
              "
            >
              {/* DATA SISWA */}

              <a
                href="/admin/students"
                className="
                  border
                  rounded-xl
                  p-5
                  hover:bg-gray-50
                  transition
                "
              >
                <p className="font-semibold">
                  Data Siswa
                </p>

                <p
                  className="
                    text-sm
                    text-gray-500
                    mt-1
                  "
                >
                  Kelola data peserta ujian.
                </p>
              </a>

              {/* JADWAL UJIAN */}

              <a
                href="/admin/exam-schedules"
                className="
                  border
                  rounded-xl
                  p-5
                  hover:bg-gray-50
                  transition
                "
              >
                <p className="font-semibold">
                  Jadwal Ujian
                </p>

                <p
                  className="
                    text-sm
                    text-gray-500
                    mt-1
                  "
                >
                  Kelola jadwal berdasarkan kelas.
                </p>
              </a>

              {/* CETAK KARTU */}

              <a
                href="/admin/print"
                className="
                  border
                  rounded-xl
                  p-5
                  hover:bg-gray-50
                  transition
                "
              >
                <p className="font-semibold">
                  Cetak Kartu
                </p>

                <p
                  className="
                    text-sm
                    text-gray-500
                    mt-1
                  "
                >
                  Cari dan cetak kartu peserta.
                </p>
              </a>
            </div>
          </div>

        </main>
      </div>
    </div>
  );
}