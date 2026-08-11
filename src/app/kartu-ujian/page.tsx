import { Suspense } from "react";
import KartuUjianClient from "./KartuUjianClient";

export default function KartuUjianPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-semibold">
              Memuat kartu ujian...
            </div>

            <p className="text-gray-500 mt-2">
              Mohon tunggu sebentar.
            </p>
          </div>
        </main>
      }
    >
      <KartuUjianClient />
    </Suspense>
  );
}