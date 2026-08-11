"use client";

import { useState } from "react";

type Student = {
  id: string;
  nis: string;
  nisn: string;
  full_name: string;
  status_kartu: "BELUM" | "SIAP";
  class_name: string;
  major_name: string;
};

export default function Home() {
  const [keyword, setKeyword] = useState("");

  const [student, setStudent] =
    useState<Student | null>(null);

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState("");

  // =====================================================
  // CEK KARTU
  // =====================================================

  async function checkCard() {
    const searchKeyword =
      keyword.trim();

    if (!searchKeyword) {
      setError(
        "Silakan masukkan NIS, NISN, atau nama siswa."
      );

      setStudent(null);

      return;
    }

    try {
      setLoading(true);

      setError("");

      setStudent(null);

      const response =
        await fetch(
          `/api/admin/print?keyword=${encodeURIComponent(
            searchKeyword
          )}`,
          {
            method: "GET",
            cache: "no-store",
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        setError(
          result.message ||
            "Data siswa tidak ditemukan."
        );

        return;
      }

      if (
        !result.data ||
        result.data.length === 0
      ) {
        setError(
          "Data siswa tidak ditemukan."
        );

        return;
      }

      // Ambil siswa pertama
      const data =
        result.data[0];

      setStudent({
        id: data.id,
        nis: data.nis,
        nisn: data.nisn,
        full_name:
          data.full_name,
        status_kartu:
          data.status_kartu,
        class_name:
          data.class_name,
        major_name:
          data.major_name,
      });

    } catch (error) {
      console.error(
        "Check card error:",
        error
      );

      setError(
        "Terjadi kesalahan saat menghubungi server."
      );

    } finally {
      setLoading(false);
    }
  }


  // =====================================================
  // CETAK KARTU
  // =====================================================

  function printCard() {
    if (!student) {
      return;
    }

    if (
      student.status_kartu !==
      "SIAP"
    ) {
      return;
    }

    window.location.href =
      `/kartu-ujian?nis=${encodeURIComponent(
        student.nis
      )}`;
  }


  // =====================================================
  // RESET
  // =====================================================

  function resetSearch() {
    setKeyword("");

    setStudent(null);

    setError("");
  }


  // =====================================================
  // ENTER KEY
  // =====================================================

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      e.preventDefault();

      checkCard();
    }
  }


  return (
    <main className="
      min-h-screen
      bg-gray-100
      flex
      items-center
      justify-center
      p-6
    ">

      <div className="
        w-full
        max-w-xl
      ">

        {/* =================================================
            CARD UTAMA
        ================================================= */}

        <div className="
          bg-white
          rounded-2xl
          shadow-lg
          overflow-hidden
        ">


          {/* =================================================
              HEADER
          ================================================= */}

          <div className="
            bg-blue-600
            text-white
            px-8
            py-8
            text-center
          ">

            <img
              src="/images/SMKEKNOM.jpeg"
              alt="Logo SMK Ekonomika"
              className="
                mx-auto
                h-24
                w-auto
                object-contain
                bg-white
                rounded-lg
                p-2
              "
            />

            <h1 className="
              text-2xl
              font-bold
              mt-5
            ">
              SMK EKONOMIKA
            </h1>

            <p className="
              text-blue-100
              mt-1
            ">
              Exam Card System
            </p>

          </div>


          {/* =================================================
              CONTENT
          ================================================= */}

          <div className="p-8">


            {/* JUDUL */}

            <div className="
              text-center
              mb-7
            ">

              <h2 className="
                text-2xl
                font-bold
                text-gray-800
              ">
                Cek Kartu Ujian
              </h2>

              <p className="
                text-gray-500
                mt-2
              ">
                Masukkan NIS, NISN, atau
                nama siswa untuk mengecek
                status kartu ujian.
              </p>

            </div>


            {/* =================================================
                FORM PENCARIAN
            ================================================= */}

            <div className="space-y-4">

              <input
                type="text"
                value={keyword}
                onChange={(e) =>
                  setKeyword(
                    e.target.value
                  )
                }
                onKeyDown={handleKeyDown}
                placeholder="Masukkan NIS / NISN / Nama"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-xl
                  px-4
                  py-4
                  text-lg
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                  focus:border-blue-500
                "
                autoComplete="off"
              />


              <button
                type="button"
                onClick={checkCard}
                disabled={loading}
                className="
                  w-full
                  bg-blue-600
                  hover:bg-blue-700
                  disabled:bg-gray-400
                  disabled:cursor-not-allowed
                  text-white
                  py-4
                  rounded-xl
                  font-semibold
                  text-lg
                  transition
                "
              >

                {loading
                  ? "Memeriksa..."
                  : "Cek Kartu Ujian"}

              </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

              <div className="
                mt-6
                bg-red-50
                border
                border-red-200
                rounded-xl
                p-5
                text-center
              ">

                <div className="
                  text-red-600
                  text-3xl
                  mb-2
                ">
                  ✕
                </div>

                <p className="
                  font-semibold
                  text-red-700
                ">
                  Data Tidak Ditemukan
                </p>

                <p className="
                  text-red-600
                  text-sm
                  mt-1
                ">
                  {error}
                </p>

              </div>

            )}


            {/* =================================================
                HASIL SISWA
            ================================================= */}

            {student && (

              <div className="mt-6">


                {/* =================================================
                    STATUS SIAP
                ================================================= */}

                {student.status_kartu ===
                "SIAP" ? (

                  <div className="
                    bg-green-50
                    border
                    border-green-200
                    rounded-xl
                    p-6
                  ">

                    {/* STATUS */}

                    <div className="
                      text-center
                    ">

                      <div className="
                        text-green-600
                        text-4xl
                      ">
                        ✓
                      </div>

                      <h3 className="
                        text-xl
                        font-bold
                        text-green-700
                        mt-2
                      ">
                        Kartu Ujian
                        Siap Dicetak
                      </h3>

                      <p className="
                        text-green-600
                        text-sm
                        mt-1
                      ">
                        Data siswa ditemukan
                        dan kartu dapat dicetak.
                      </p>

                    </div>


                    {/* =================================================
                        DATA SISWA
                    ================================================= */}

                    <div className="
                      bg-white
                      rounded-xl
                      p-5
                      mt-5
                      space-y-4
                    ">

                      {/* NAMA */}

                      <div className="
                        flex
                        justify-between
                        gap-4
                        border-b
                        pb-3
                      ">

                        <span className="
                          text-gray-500
                        ">
                          Nama
                        </span>

                        <span className="
                          font-semibold
                          text-gray-800
                          text-right
                        ">
                          {student.full_name}
                        </span>

                      </div>


                      {/* NIS */}

                      <div className="
                        flex
                        justify-between
                        gap-4
                        border-b
                        pb-3
                      ">

                        <span className="
                          text-gray-500
                        ">
                          NIS
                        </span>

                        <span className="
                          font-semibold
                          text-gray-800
                        ">
                          {student.nis}
                        </span>

                      </div>


                      {/* NISN */}

                      <div className="
                        flex
                        justify-between
                        gap-4
                        border-b
                        pb-3
                      ">

                        <span className="
                          text-gray-500
                        ">
                          NISN
                        </span>

                        <span className="
                          font-semibold
                          text-gray-800
                        ">
                          {student.nisn}
                        </span>

                      </div>


                      {/* KELAS */}

                      <div className="
                        flex
                        justify-between
                        gap-4
                        border-b
                        pb-3
                      ">

                        <span className="
                          text-gray-500
                        ">
                          Kelas
                        </span>

                        <span className="
                          font-semibold
                          text-gray-800
                        ">
                          {student.class_name}
                        </span>

                      </div>


                      {/* JURUSAN */}

                      <div className="
                        flex
                        justify-between
                        gap-4
                      ">

                        <span className="
                          text-gray-500
                        ">
                          Program Keahlian
                        </span>

                        <span className="
                          font-semibold
                          text-gray-800
                          text-right
                        ">
                          {student.major_name ||
                            "-"}
                        </span>

                      </div>

                    </div>


                    {/* =================================================
                        CETAK KARTU
                    ================================================= */}

                    <button
                      type="button"
                      onClick={printCard}
                      className="
                        w-full
                        mt-5
                        bg-green-600
                        hover:bg-green-700
                        text-white
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                      "
                    >
                      🖨️ Cetak Kartu Ujian
                    </button>


                    {/* CEK SISWA LAIN */}

                    <button
                      type="button"
                      onClick={resetSearch}
                      className="
                        w-full
                        mt-3
                        bg-white
                        border
                        border-gray-300
                        hover:bg-gray-50
                        text-gray-700
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                      "
                    >
                      Cek Siswa Lain
                    </button>

                  </div>


                ) : (

                  /* =================================================
                     STATUS BELUM SIAP
                  ================================================= */

                  <div className="
                    bg-red-50
                    border
                    border-red-200
                    rounded-xl
                    p-6
                    text-center
                  ">

                    <div className="
                      text-red-600
                      text-4xl
                    ">
                      ✕
                    </div>


                    <h3 className="
                      text-xl
                      font-bold
                      text-red-700
                      mt-2
                    ">
                      Kartu Ujian
                      Belum Siap
                    </h3>


                    <p className="
                      text-red-600
                      mt-2
                    ">
                      Harap menghubungi
                      Tata Usaha.
                    </p>


                    {/* DATA SISWA */}

                    <div className="
                      bg-white
                      rounded-xl
                      p-5
                      mt-5
                      text-left
                    ">

                      <div className="
                        flex
                        justify-between
                        gap-4
                        border-b
                        pb-3
                      ">

                        <span className="
                          text-gray-500
                        ">
                          Nama
                        </span>

                        <strong className="
                          text-right
                        ">
                          {student.full_name}
                        </strong>

                      </div>


                      <div className="
                        flex
                        justify-between
                        gap-4
                        border-b
                        py-3
                      ">

                        <span className="
                          text-gray-500
                        ">
                          NIS
                        </span>

                        <strong>
                          {student.nis}
                        </strong>

                      </div>


                      <div className="
                        flex
                        justify-between
                        gap-4
                        pt-3
                      ">

                        <span className="
                          text-gray-500
                        ">
                          Kelas
                        </span>

                        <strong>
                          {student.class_name}
                        </strong>

                      </div>

                    </div>


                    {/* CEK SISWA LAIN */}

                    <button
                      type="button"
                      onClick={resetSearch}
                      className="
                        w-full
                        mt-5
                        bg-white
                        border
                        border-gray-300
                        hover:bg-gray-50
                        text-gray-700
                        py-3
                        rounded-xl
                        font-semibold
                        transition
                      "
                    >
                      Cek Siswa Lain
                    </button>

                  </div>

                )}

              </div>

            )}

          </div>

        </div>


        {/* =================================================
            FOOTER
        ================================================= */}

        <p className="
          text-center
          text-gray-400
          text-sm
          mt-5
        ">
          © {new Date().getFullYear()}
          {" "}
          SMK Ekonomika
        </p>

      </div>

    </main>
  );
}