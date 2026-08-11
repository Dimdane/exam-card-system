"use client";

import { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log({
      username,
      password,
    });

    // Nanti kita hubungkan ke Supabase
  };

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
        <div className="text-center mb-8">
          <img
            src="/images/SMKEKNOM.jpeg"
            alt="SMK EKONOMIKA"
            className="mx-auto h-20 w-auto"
          />

          <p className="text-gray-500 mt-3 text-lg">
            Exam Card System
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">

          <div>
            <label className="block mb-2 font-medium">
              Username
            </label>

            <input
              type="text"
              placeholder="Masukkan Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              placeholder="Masukkan Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition"
          >
            Login
          </button>

        </form>
      </div>
    </main>
  );
}