"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase-browser";

export default function LoginPage() {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");

    const supabase = createClient();

    const { error } =
      await supabase.auth.signInWithPassword({
        email: username.trim(),
        password,
      });

    if (error) {
      console.error(error);

      setError(
        "Username atau password yang Anda masukkan salah."
      );

      setLoading(false);
      return;
    }

    router.replace("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">

        {/* LOGO */}
        <div className="text-center mb-8">

          <img
            src="/images/SMKEKNOM.jpeg"
            alt="SMK EKONOMIKA"
            className="mx-auto h-20 w-auto"
          />

          <h1 className="text-2xl font-bold mt-5">
            Login Tata Usaha
          </h1>

          <p className="text-gray-500 mt-2">
            Exam Card System
          </p>

        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 text-sm">
            {error}
          </div>
        )}

        {/* FORM */}
        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          {/* EMAIL */}
          <div>

            <label className="block mb-2 font-medium">
              Email / Username
            </label>

            <input
              type="text"
              placeholder="Masukkan email"
              value={username}
              onChange={(e) =>
                setUsername(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          {/* PASSWORD */}
          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Masukkan password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-3 rounded-lg font-semibold transition"
          >
            {loading ? "Memproses..." : "Login"}
          </button>

        </form>

      </div>

    </main>
  );
}