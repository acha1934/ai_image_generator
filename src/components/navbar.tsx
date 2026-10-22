"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch(`${API}/api/auth/logout`, { method: "POST", credentials: "include" });
    router.push("/login");
  };

  return (
    <nav className="sticky top-0 z-40 border-b border-indigo-500/10 bg-slate-950/80 backdrop-blur-xl px-8 py-4 flex justify-between items-center">
      {/* Logo */}
      <Link href="/generate" className="flex items-center gap-2 group">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
          <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <span className="text-xl font-bold gradient-text">AI Generator</span>
      </Link>

      {/* Nav links */}
      <div className="flex gap-2 items-center">
        <Link
          href="/dashboard"
          className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all text-sm font-medium"
        >
          Dashboard
        </Link>
        <Link
          href="/history"
          className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-all text-sm font-medium"
        >
          History
        </Link>
        <button
          onClick={handleLogout}
          className="ml-2 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-500/20 hover:text-red-300 hover:border-red-400/40 transition-all text-sm font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}
