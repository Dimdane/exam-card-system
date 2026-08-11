"use client";

import { ChangeEvent, useState } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function ImportPage() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState<boolean | null>(null);

  const handleFileChange = (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFile = event.target.files?.[0] ?? null;

    setFile(selectedFile);
    setMessage("");
    setSuccess(null);
  };

  const handleImport = async () => {
    if (!file) {
      setMessage("Silakan pilih file Excel terlebih dahulu.");
      setSuccess(false);
      return;
    }

    setLoading(true);
    setMessage("");
    setSuccess(null);

    try {
      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        setSuccess(false);
        setMessage(
          result.message || "Import data gagal."
        );

        return;
      }

      setSuccess(true);
      setMessage(result.message);

      // Reset file setelah berhasil
      setFile(null);

      const fileInput = document.getElementById(
        "excel-file"
      ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }
    } catch (error) {
      console.error(error);

      setSuccess(false);
      setMessage(
        "Tidak dapat terhubung ke server. Silakan coba lagi."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* SIDEBAR */}
      <Sidebar />

      {/* AREA KANAN */}
      <div className="ml-[330px] min-h-screen">
        {/* HEADER */}
        <Header />

        {/* CONTENT */}
        <main className="p-8">
          {/* JUDUL HALAMAN */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Import Data Siswa
            </h1>

            <p className="text-gray-500 mt-2">
              Tambahkan data siswa secara massal melalui file
              Excel.
            </p>
          </div>

          {/* =====================================================
              CARD IMPORT
          ====================================================== */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="p-8">
              {/* HEADER CARD */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Upload File Excel
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Pilih file Excel yang berisi data siswa untuk
                  dimasukkan ke dalam sistem.
                </p>
              </div>

              {/* AREA UPLOAD */}
              <div
                className="
                  border-2
                  border-dashed
                  border-gray-300
                  rounded-2xl
                  bg-gray-50
                  px-6
                  py-12
                  text-center
                  hover:border-blue-400
                  hover:bg-blue-50/30
                  transition
                "
              >
                {/* ICON */}
                <div
                  className="
                    mx-auto
                    w-16
                    h-16
                    rounded-2xl
                    bg-blue-100
                    flex
                    items-center
                    justify-center
                    mb-5
                  "
                >
                  <span className="text-3xl">
                    📥
                  </span>
                </div>

                {/* JUDUL */}
                <h3 className="text-lg font-bold text-gray-900">
                  Pilih File Excel
                </h3>

                <p className="text-gray-500 text-sm mt-2">
                  Format yang diperbolehkan:
                  <span className="font-semibold text-gray-700">
                    {" "}
                    .xlsx
                  </span>{" "}
                  atau
                  <span className="font-semibold text-gray-700">
                    {" "}
                    .xls
                  </span>
                </p>

                {/* INPUT FILE */}
                <div className="mt-6">
                  <label
                    htmlFor="excel-file"
                    className="
                      inline-flex
                      items-center
                      justify-center
                      px-5
                      py-3
                      bg-white
                      border
                      border-gray-300
                      rounded-xl
                      text-sm
                      font-semibold
                      text-gray-700
                      cursor-pointer
                      hover:bg-gray-50
                      hover:border-gray-400
                      transition
                    "
                  >
                    📁 Pilih File
                  </label>

                  <input
                    id="excel-file"
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </div>

                {/* FILE TERPILIH */}
                {file && (
                  <div
                    className="
                      mt-6
                      mx-auto
                      max-w-xl
                      bg-white
                      border
                      border-blue-200
                      rounded-xl
                      px-5
                      py-4
                      text-left
                    "
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="
                          w-10
                          h-10
                          rounded-lg
                          bg-green-100
                          flex
                          items-center
                          justify-center
                          shrink-0
                        "
                      >
                        📄
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs text-gray-500">
                          File yang dipilih
                        </p>

                        <p className="font-semibold text-gray-800 truncate">
                          {file.name}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* PESAN */}
              {message && (
                <div
                  className={`
                    mt-6
                    rounded-xl
                    p-4
                    border
                    ${
                      success
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }
                  `}
                >
                  <div className="flex items-start gap-3">
                    <div className="text-xl">
                      {success ? "✓" : "✕"}
                    </div>

                    <div>
                      <p className="font-semibold">
                        {success
                          ? "Import Berhasil"
                          : "Import Gagal"}
                      </p>

                      <p className="text-sm mt-1">
                        {message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* FOOTER CARD */}
              <div className="flex items-center justify-between mt-8">
                <p className="text-sm text-gray-400">
                  Pastikan format data Excel sudah sesuai.
                </p>

                <button
                  type="button"
                  onClick={handleImport}
                  disabled={loading}
                  className="
                    px-6
                    py-3
                    rounded-xl
                    font-semibold
                    text-white
                    bg-blue-600
                    hover:bg-blue-700
                    disabled:bg-gray-400
                    disabled:cursor-not-allowed
                    transition
                    shadow-sm
                  "
                >
                  {loading
                    ? "Sedang Mengimport..."
                    : "Import Data"}
                </button>
              </div>
            </div>
          </div>

          {/* =====================================================
              FORMAT EXCEL
          ====================================================== */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 mt-6">
            <div className="p-8">
              {/* HEADER */}
              <div className="mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  Format Data Excel
                </h2>

                <p className="text-gray-500 text-sm mt-1">
                  Gunakan nama kolom berikut pada baris pertama
                  file Excel.
                </p>
              </div>

              {/* TABLE */}
              <div className="overflow-x-auto border border-gray-200 rounded-xl">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                      <th className="px-5 py-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                        NIS
                      </th>

                      <th className="px-5 py-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                        NISN
                      </th>

                      <th className="px-5 py-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                        Nama Lengkap
                      </th>

                      <th className="px-5 py-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                        Kelas
                      </th>

                      <th className="px-5 py-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                        Jenis Kelamin
                      </th>

                      <th className="px-5 py-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                        Tempat Lahir
                      </th>

                      <th className="px-5 py-4 text-left font-semibold text-gray-700 whitespace-nowrap">
                        Tanggal Lahir
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr className="hover:bg-gray-50 transition">
                      <td className="px-5 py-4 border-b border-gray-100 text-gray-700">
                        1001
                      </td>

                      <td className="px-5 py-4 border-b border-gray-100 text-gray-700">
                        1234567890
                      </td>

                      <td className="px-5 py-4 border-b border-gray-100 font-medium text-gray-800">
                        Ahmad Fauzan
                      </td>

                      <td className="px-5 py-4 border-b border-gray-100 text-gray-700">
                        X PPLG 1
                      </td>

                      <td className="px-5 py-4 border-b border-gray-100 text-gray-700">
                        L
                      </td>

                      <td className="px-5 py-4 border-b border-gray-100 text-gray-700">
                        Depok
                      </td>

                      <td className="px-5 py-4 border-b border-gray-100 text-gray-700">
                        2009-05-12
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* CATATAN */}
              <div
                className="
                  mt-5
                  bg-blue-50
                  border
                  border-blue-200
                  rounded-xl
                  p-5
                "
              >
                <div className="flex gap-3">
                  <div className="text-lg">
                    ℹ️
                  </div>

                  <div>
                    <p className="font-semibold text-blue-800">
                      Catatan Import
                    </p>

                    <p className="text-blue-700 text-sm mt-1 leading-relaxed">
                      Kolom Kelas harus sesuai dengan data kelas
                      yang sudah ada di database, misalnya{" "}
                      <strong>X PPLG 1</strong>,{" "}
                      <strong>XI AKL 2</strong>, atau{" "}
                      <strong>XII DKV 1</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}