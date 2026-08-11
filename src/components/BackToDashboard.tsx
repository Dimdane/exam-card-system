import Link from "next/link";

export default function BackToDashboard() {
  return (
    <Link
      href="/admin"
      className="
        inline-flex
        items-center
        gap-2
        mb-5
        px-4
        py-2
        bg-white
        border
        border-gray-300
        rounded-lg
        text-gray-700
        font-medium
        hover:bg-gray-50
        hover:text-blue-600
        transition
      "
    >
      <span className="text-lg">
        ←
      </span>

      <span>
        Kembali ke Dashboard
      </span>
    </Link>
  );
}