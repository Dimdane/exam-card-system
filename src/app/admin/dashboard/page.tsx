import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardPage() {
  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 bg-gray-100 min-h-screen">

        <Header />

        <div className="p-8">

          <h1 className="text-3xl font-bold mb-6">
            Dashboard
          </h1>

          <div className="grid grid-cols-4 gap-6">

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">
                Jumlah Siswa
              </h3>

              <p className="text-3xl font-bold mt-3">
                0
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">
                Kartu Ready
              </h3>

              <p className="text-3xl font-bold mt-3">
                0
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">
                Belum Ready
              </h3>

              <p className="text-3xl font-bold mt-3">
                0
              </p>
            </div>

            <div className="bg-white rounded-xl shadow p-6">
              <h3 className="text-gray-500">
                Jurusan
              </h3>

              <p className="text-3xl font-bold mt-3">
                6
              </p>
            </div>

          </div>

        </div>

      </main>

    </div>
  );
}