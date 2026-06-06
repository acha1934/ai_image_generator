"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();

  const handleLogout =
    async () => {
      await fetch("/api/logout", {
        method: "POST",
      });

      router.push("/login");
    };

  return (
    <nav
      className="
        bg-slate-900
        border-b
        border-slate-800
        px-8
        py-4
        flex
        justify-between
        items-center
      "
    >
      <h1
        className="
          text-2xl
          font-bold
          text-white
        "
      >
        AI Generator
      </h1>

      <div
        className="
          flex
          gap-6
          text-white
          items-center
        "
      >
        <Link
          href="/dashboard"
          className="
            hover:text-blue-400
            transition-colors
          "
        >
          Dashboard
        </Link>

        <Link
          href="/history"
          className="
            hover:text-blue-400
            transition-colors
          "
        >
          History
        </Link>

        <button
          onClick={handleLogout}
          className="
            bg-red-600
            hover:bg-red-700
            px-4
            py-2
            rounded-lg
            transition-colors
          "
        >
          Logout
        </button>
      </div>
    </nav>
  );
}