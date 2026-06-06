"use client";

import { useState } from "react";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
  try {
    const response = await fetch(
      "/api/register",
      {
        method: "POST",
        headers: {
          "Content-Type":
            "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      }
    );

    const data = await response.json();

    if (data.success) {
      alert("Registration Successful");
    } else {
      alert(data.error);
    }
  } catch (error) {
    console.error(error);
  }
};
  return (
    <main className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="w-full max-w-md bg-slate-900 p-8 rounded-xl shadow-lg">

        <h1 className="text-3xl font-bold text-white text-center mb-6">
          Register
        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded-lg bg-slate-800 text-white border border-slate-700"
          />

          <button
            onClick={handleRegister}
            className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg"
          >
            Register
          </button>

        </div>
      </div>
    </main>
  );
}