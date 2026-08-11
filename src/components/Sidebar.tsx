"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(path: string) {
    if (path === "/admin") {
      return pathname === "/admin";
    }

    return pathname.startsWith(path);
  }

  function menuClass(path: string) {
    return `
      flex
      items-center
      gap-3
      px-4
      py-3
      rounded-lg
      transition
      ${
        isActive(path)
          ? "bg-blue-600 text-white"
          : "text-gray-700 hover:bg-gray-100"
      }
    `;
  }

  async function handleLogout() {
  try {
    const response = await fetch(
      "/api/auth/logout",
      {
        method: "POST",
      }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(
        result.message ||
          "Logout gagal."
      );
    }

    // Arahkan ke halaman login
    window.location.href = "/login";
  } catch (error) {
    console.error(
      "Logout error:",
      error
    );

    alert(
      "Gagal melakukan logout."
    );
  }
}

  return (
    <aside
      className="
        fixed
        top-0
        left-0
        bottom-0
        z-50
        w-[330px]
        bg-white
        border-r
        border-gray-200
        flex
        flex-col
      "
    >
      {/* =====================================================
          LOGO / BRAND
      ===================================================== */}

      <div
        className="
          px-6
          py-6
          border-b
          border-gray-200
          shrink-0
        "
      >
        <div className="flex items-center gap-3">
          <img
            src="/images/SMKEKNOM.jpeg"
            alt="SMK Ekonomika"
            className="
              w-12
              h-12
              object-contain
              rounded-lg
            "
          />

          <div>
            <h1 className="font-bold text-gray-800">
              SMK EKONOMIKA
            </h1>

            <p className="text-xs text-gray-500 mt-1">
              Exam Card System
            </p>
          </div>
        </div>
      </div>

      {/* =====================================================
          MENU
      ===================================================== */}

      <nav
        className="
          flex-1
          px-4
          py-6
          overflow-y-auto
        "
      >
        {/* DASHBOARD */}

        <div className="mb-6">
          <Link
            href="/admin"
            className={menuClass("/admin")}
          >
            <span className="text-lg">
              ▣
            </span>

            <span>
              Dashboard
            </span>
          </Link>
        </div>

        {/* DATA PESERTA */}

<div className="mb-6">
  <p
    className="
      text-xs
      font-semibold
      text-gray-400
      uppercase
      tracking-wider
      px-4
      mb-2
    "
  >
    Data Peserta
  </p>

  {/* DATA SISWA */}

  <Link
    href="/admin/students"
    className={menuClass("/admin/students")}
  >
    <span className="text-lg">
      👥
    </span>

    <span>
      Data Siswa
    </span>
  </Link>

  {/* STATUS KARTU */}

  <Link
    href="/admin/status"
    className={menuClass("/admin/status")}
  >
    <span className="text-lg">
      🎫
    </span>

    <span>
      Status Kartu
    </span>
  </Link>
</div>

        {/* UJIAN */}

        <div>
          <p
            className="
              text-xs
              font-semibold
              text-gray-400
              uppercase
              tracking-wider
              px-4
              mb-2
            "
          >
            Ujian
          </p>

          {/* PENGATURAN UJIAN */}

          <Link
            href="/admin/exam-settings"
            className={menuClass("/admin/exam-settings")}
          >
            <span className="text-lg">
              ⚙
            </span>

            <span>
              Pengaturan Ujian
            </span>
          </Link>

          {/* JADWAL UJIAN */}

          <Link
            href="/admin/exam-schedules"
            className={menuClass("/admin/exam-schedules")}
          >
            <span className="text-lg">
              🗓
            </span>

            <span>
              Jadwal Ujian
            </span>
          </Link>

          {/* CETAK KARTU */}

          <Link
            href="/admin/print"
            className={menuClass("/admin/print")}
          >
            <span className="text-lg">
              🖨
            </span>

            <span>
              Cetak Kartu
            </span>
          </Link>
        </div>
      </nav>

      {/* =====================================================
          FOOTER SIDEBAR
      ===================================================== */}

      <div
        className="
          border-t
          border-gray-200
          p-4
          shrink-0
          bg-white
        "
      >
        {/* ADMIN INFO */}

        <div
          className="
            px-4
            py-3
            text-sm
            text-gray-500
          "
        >
          <p className="font-medium text-gray-700">
            Admin TU
          </p>

          <p className="text-xs mt-1">
            SMK Ekonomika
          </p>
        </div>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={handleLogout}
          className="
            w-full
            flex
            items-center
            gap-3
            px-4
            py-3
            rounded-lg
            text-red-600
            hover:bg-red-50
            transition
          "
        >
          <span className="text-lg">
            ↪
          </span>

          <span>
            Keluar
          </span>
        </button>
      </div>
    </aside>
  );
}