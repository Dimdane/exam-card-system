"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  name: string;
};

export default function DeleteStudentButton({
  id,
  name,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    const confirmed = window.confirm(
      `Apakah Anda yakin ingin menghapus siswa "${name}"?`
    );

    if (!confirmed) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `/api/admin/students/${id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal menghapus data siswa."
        );

        return;
      }

      alert("Data siswa berhasil dihapus.");

      router.refresh();

    } catch (error) {
      console.error(error);

      alert(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="
        text-red-600
        hover:text-red-800
        disabled:text-gray-400
        disabled:cursor-not-allowed
      "
    >
      {loading ? "Menghapus..." : "Hapus"}
    </button>
  );
}