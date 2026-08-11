"use client";

import { useEffect, useState } from "react";
import BackToDashboard from "@/components/BackToDashboard";

type Schedule = {
  id: string;
  exam_date: string;
  start_time: string;
  end_time: string;
  subject: string;
  class_id: string;
  classes?: {
    id: string;
    grade: string;
    class_number: number;
    majors?: {
      code: string;
      name: string;
    };
  };
};

type ClassItem = {
  id: string;
  name: string;
};

const emptyForm = {
  exam_date: "",
  start_time: "",
  end_time: "",
  subject: "",
  class_id: "",
};

export default function ExamSchedulesPage() {
  const [schedules, setSchedules] =
    useState<Schedule[]>([]);

  const [classes, setClasses] =
    useState<ClassItem[]>([]);

  const [form, setForm] =
    useState(emptyForm);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  async function loadSchedules() {
    try {
      setLoading(true);

      const response = await fetch(
        "/api/admin/exam-schedules"
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal mengambil jadwal ujian."
        );
        return;
      }

      setSchedules(result.data || []);
    } catch (error) {
      console.error(error);

      alert(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setLoading(false);
    }
  }

  async function loadClasses() {
    try {
      const response = await fetch(
        "/api/admin/classes"
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        alert(
          result.message ||
            "Gagal mengambil data kelas."
        );
        return;
      }

      setClasses(result.data || []);
    } catch (error) {
      console.error(error);

      alert(
        "Tidak dapat mengambil data kelas."
      );
    }
  }

  useEffect(() => {
    loadSchedules();
    loadClasses();
  }, []);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    const {
      name,
      value,
    } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (
      !form.exam_date ||
      !form.start_time ||
      !form.end_time ||
      !form.subject.trim() ||
      !form.class_id
    ) {
      alert(
        "Semua data wajib diisi."
      );
      return;
    }

    if (
      form.end_time <=
      form.start_time
    ) {
      alert(
        "Waktu selesai harus lebih besar dari waktu mulai."
      );
      return;
    }

    try {
      setSaving(true);

      const url = editingId
        ? `/api/admin/exam-schedules/${editingId}`
        : "/api/admin/exam-schedules";

      const method = editingId
        ? "PUT"
        : "POST";

      const response = await fetch(
        url,
        {
          method,
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        alert(
          result.message ||
            "Gagal menyimpan jadwal."
        );
        return;
      }

      alert(
        editingId
          ? "Jadwal berhasil diperbarui."
          : "Jadwal berhasil ditambahkan."
      );

      resetForm();

      await loadSchedules();
    } catch (error) {
      console.error(error);

      alert(
        "Tidak dapat terhubung ke server."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleEdit(
    schedule: Schedule
  ) {
    setEditingId(schedule.id);

    setForm({
      exam_date:
        schedule.exam_date,

      start_time:
        schedule.start_time.substring(
          0,
          5
        ),

      end_time:
        schedule.end_time.substring(
          0,
          5
        ),

      subject:
        schedule.subject,

      class_id:
        schedule.class_id,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  async function handleDelete(
    id: string
  ) {
    const confirmed =
      window.confirm(
        "Apakah Anda yakin ingin menghapus jadwal ini?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const response =
        await fetch(
          `/api/admin/exam-schedules/${id}`,
          {
            method: "DELETE",
          }
        );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        alert(
          result.message ||
            "Gagal menghapus jadwal."
        );
        return;
      }

      alert(
        "Jadwal berhasil dihapus."
      );

      await loadSchedules();
    } catch (error) {
      console.error(error);

      alert(
        "Tidak dapat terhubung ke server."
      );
    }
  }

  function formatDate(
    date: string
  ) {
    if (!date) {
      return "-";
    }

    const parsedDate =
      new Date(
        `${date}T00:00:00`
      );

    return parsedDate.toLocaleDateString(
      "id-ID",
      {
        day: "2-digit",
        month: "long",
        year: "numeric",
      }
    );
  }

  function formatTime(
    time: string
  ) {
    if (!time) {
      return "-";
    }

    return time.substring(
      0,
      5
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}

      <div className="bg-white border-b px-8 py-5">
        <BackToDashboard />
        <h1 className="text-2xl font-bold">
          Jadwal Ujian
        </h1>

        <p className="text-gray-500 mt-1">
          Kelola jadwal ujian berdasarkan
          kelas siswa.
        </p>

      </div>


      <div className="p-8">

        {/* FORM */}

        <div className="
          bg-white
          rounded-xl
          shadow
          p-6
          mb-6
        ">

          <div className="
            flex
            justify-between
            items-center
            mb-6
          ">

            <div>

              <h2 className="text-xl font-bold">
                {editingId
                  ? "Edit Jadwal Ujian"
                  : "Tambah Jadwal Ujian"}
              </h2>

              <p className="text-sm text-gray-500 mt-1">
                Jadwal akan berlaku khusus untuk
                kelas yang dipilih.
              </p>

            </div>

            {editingId && (

              <button
                type="button"
                onClick={resetForm}
                className="
                  text-gray-600
                  hover:text-gray-900
                  font-medium
                "
              >
                Batal Edit
              </button>

            )}

          </div>


          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* KELAS */}

            <div>

              <label className="
                block
                font-semibold
                mb-2
              ">
                Untuk Kelas
              </label>

              <select
                name="class_id"
                value={form.class_id}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  bg-white
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >

                <option value="">
                  -- Pilih Kelas --
                </option>

                {classes.map(
                  (item) => (
                    <option
                      key={item.id}
                      value={item.id}
                    >
                      {item.name}
                    </option>
                  )
                )}

              </select>

            </div>


            {/* TANGGAL */}

            <div>

              <label className="
                block
                font-semibold
                mb-2
              ">
                Tanggal Ujian
              </label>

              <input
                type="date"
                name="exam_date"
                value={form.exam_date}
                onChange={handleChange}
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />

            </div>


            {/* WAKTU */}

            <div className="
              grid
              grid-cols-1
              md:grid-cols-2
              gap-5
            ">

              <div>

                <label className="
                  block
                  font-semibold
                  mb-2
                ">
                  Waktu Mulai
                </label>

                <input
                  type="time"
                  name="start_time"
                  value={form.start_time}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-4
                    py-3
                  "
                />

              </div>


              <div>

                <label className="
                  block
                  font-semibold
                  mb-2
                ">
                  Waktu Selesai
                </label>

                <input
                  type="time"
                  name="end_time"
                  value={form.end_time}
                  onChange={handleChange}
                  className="
                    w-full
                    border
                    border-gray-300
                    rounded-lg
                    px-4
                    py-3
                  "
                />

              </div>

            </div>


            {/* MATA UJIAN */}

            <div>

              <label className="
                block
                font-semibold
                mb-2
              ">
                Mata Ujian
              </label>

              <input
                type="text"
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder="Contoh: Bahasa Indonesia"
                className="
                  w-full
                  border
                  border-gray-300
                  rounded-lg
                  px-4
                  py-3
                "
              />

            </div>


            <button
              type="submit"
              disabled={saving}
              className="
                bg-blue-600
                hover:bg-blue-700
                disabled:bg-gray-400
                text-white
                px-7
                py-3
                rounded-lg
                font-semibold
              "
            >
              {saving
                ? "Menyimpan..."
                : editingId
                ? "Update Jadwal"
                : "Simpan Jadwal"}
            </button>

          </form>

        </div>


        {/* DAFTAR JADWAL */}

        <div className="
          bg-white
          rounded-xl
          shadow
          p-6
        ">

          <h2 className="
            text-xl
            font-bold
            mb-5
          ">
            Daftar Jadwal Ujian
          </h2>

          {loading ? (

            <div className="
              text-center
              py-10
              text-gray-500
            ">
              Memuat jadwal...
            </div>

          ) : schedules.length === 0 ? (

            <div className="
              text-center
              py-10
              text-gray-400
            ">
              Belum ada jadwal ujian.
            </div>

          ) : (

            <div className="overflow-x-auto">

              <table className="w-full">

                <thead>

                  <tr className="border-b">

                    <th className="text-left py-3">
                      No
                    </th>

                    <th className="text-left py-3">
                      Kelas
                    </th>

                    <th className="text-left py-3">
                      Tanggal
                    </th>

                    <th className="text-left py-3">
                      Waktu
                    </th>

                    <th className="text-left py-3">
                      Mata Ujian
                    </th>

                    <th className="text-center py-3">
                      Aksi
                    </th>

                  </tr>

                </thead>

                <tbody>

                  {schedules.map(
                    (
                      schedule,
                      index
                    ) => {

                      const className =
                        schedule.classes
                          ? `${schedule.classes.grade} ${
                              schedule.classes.majors?.code ||
                              ""
                            } ${
                              schedule.classes
                                .class_number
                            }`
                          : "-";

                      return (
                        <tr
                          key={schedule.id}
                          className="border-b hover:bg-gray-50"
                        >

                          <td className="py-4">
                            {index + 1}
                          </td>

                          <td className="
                            py-4
                            font-semibold
                          ">
                            {className}
                          </td>

                          <td className="py-4">
                            {formatDate(
                              schedule.exam_date
                            )}
                          </td>

                          <td className="py-4">
                            {formatTime(
                              schedule.start_time
                            )}
                            {" - "}
                            {formatTime(
                              schedule.end_time
                            )}
                          </td>

                          <td className="py-4">
                            {schedule.subject}
                          </td>

                          <td className="py-4 text-center">

                            <div className="
                              flex
                              justify-center
                              gap-2
                            ">

                              <button
                                type="button"
                                onClick={() =>
                                  handleEdit(
                                    schedule
                                  )
                                }
                                className="
                                  bg-yellow-500
                                  hover:bg-yellow-600
                                  text-white
                                  px-4
                                  py-2
                                  rounded-lg
                                  text-sm
                                "
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDelete(
                                    schedule.id
                                  )
                                }
                                className="
                                  bg-red-600
                                  hover:bg-red-700
                                  text-white
                                  px-4
                                  py-2
                                  rounded-lg
                                  text-sm
                                "
                              >
                                Hapus
                              </button>

                            </div>

                          </td>

                        </tr>
                      );
                    }
                  )}

                </tbody>

              </table>

            </div>

          )}

        </div>

      </div>

    </div>
  );
}