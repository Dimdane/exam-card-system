"use client";

import { FormEvent, useState } from "react";

type StudentResult = {
  id: string;
  nis: string;
  nisn: string;
  full_name: string;
  status_kartu: "BELUM" | "SIAP";
  class_name: string;
};

export default function CheckCardPage() {
  const [keyword, setKeyword] = useState("");

  const [student, setStudent] =
    useState<StudentResult | null>(null);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  async function handleSubmit(
    e: FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setStudent(null);
    setError("");

    if (!keyword.trim()) {
      setError(
        "Silakan masukkan NIS atau NISN."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `/api/check-card?keyword=${encodeURIComponent(
          keyword.trim()
        )}`
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setError(
          result.message ||
            "Data siswa tidak ditemukan."
        );
        return;
      }

      setStudent(result.data);
    } catch (error) {
      console.error(error);

      setError(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  }

  function resetCheck() {
    setKeyword("");
    setStudent(null);
    setError("");
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-6">

      <div className="w-full max-w-xl">

        {/* Header */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <div className="text-center mb-8">

            <img
              src="/images/SMKEKNOM.jpeg"
              alt="SMK Ekonomika"
              className="mx-auto h-24 w-auto object-contain mb-4"
            />

            <h1 className="text-3xl font-bold text-gray-800">
              Cek Kartu Ujian
            </h1>

            <p className="text-gray-500 mt-2">
              Sistem Kartu Ujian SMK Ekonomika
            </p>

          </div>

          {!student ? (

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              <div>

                <label className="block font-medium mb-2 text-gray-700">
                  NIS / NISN
                </label>

                <input
                  type="text"
                  value={keyword}
                  onChange={(e) =>
                    setKeyword(e.target.value)
                  }
                  placeholder="Masukkan NIS atau NISN"
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-xl
                    px-5
                    py-4
                    text-lg
                    focus:outline-none
                    focus:ring-2
                    focus:ring-blue-500
                  "
                />

              </div>

              {error && (
                <div className="
                  bg-red-50
                  border
                  border-red-200
                  text-red-700
                  rounded-xl
                  p-4
                  text-center
                ">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="
                  w-full
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-gray-400
                  text-white
                  py-4
                  rounded-xl
                  font-semibold
                  text-lg
                "
              >
                {loading
                  ? "Memeriksa..."
                  : "Cek Kartu"}
              </button>

            </form>

          ) : (

            <div className="space-y-5">

              {/* Data siswa */}
              <div className="bg-gray-50 rounded-xl p-5">

                <p className="text-sm text-gray-500">
                  Nama Siswa
                </p>

                <p className="text-xl font-bold mt-1">
                  {student.full_name}
                </p>

                <div className="grid grid-cols-2 gap-4 mt-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      NIS
                    </p>

                    <p className="font-medium">
                      {student.nis}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Kelas
                    </p>

                    <p className="font-medium">
                      {student.class_name}
                    </p>
                  </div>

                </div>

              </div>

              {/* Status */}
              {student.status_kartu ===
              "SIAP" ? (

                <div className="
                  bg-green-50
                  border
                  border-green-200
                  rounded-xl
                  p-6
                  text-center
                ">

                  <div className="text-5xl mb-3">
                    ✓
                  </div>

                  <h2 className="
                    text-2xl
                    font-bold
                    text-green-700
                  ">
                    Kartu Ujian Siap
                  </h2>

                  <p className="text-green-700 mt-2">
                    Kartu ujian Anda sudah dapat
                    dicetak.
                  </p>

                  <button
                    type="button"
                    className="
                      mt-5
                      bg-green-600
                      hover:bg-green-700
                      text-white
                      px-6
                      py-3
                      rounded-lg
                      font-semibold
                    "
                  >
                    Cetak Kartu
                  </button>

                </div>

              ) : (

                <div className="
                  bg-red-50
                  border
                  border-red-200
                  rounded-xl
                  p-6
                  text-center
                ">

                  <div className="text-5xl mb-3">
                    !
                  </div>

                  <h2 className="
                    text-2xl
                    font-bold
                    text-red-700
                  ">
                    Kartu Ujian Belum Siap
                  </h2>

                  <p className="text-red-700 mt-2">
                    Harap menghubungi Tata Usaha.
                  </p>

                </div>

              )}

              <button
                type="button"
                onClick={resetCheck}
                className="
                  w-full
                  border
                  border-gray-300
                  hover:bg-gray-50
                  py-3
                  rounded-lg
                  font-medium
                "
              >
                Cek Siswa Lain
              </button>

            </div>

          )}

        </div>

        <p className="text-center text-gray-400 text-sm mt-5">
          Exam Card System • SMK Ekonomika
        </p>

      </div>

    </main>
  );
}