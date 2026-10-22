import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { API } from "../lib/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [totalImages, setTotalImages] = useState(0);

  useEffect(() => {
    fetch(`${API}/api/auth/me`, { credentials: "include" })
      .then((res) => { if (!res.ok) navigate("/login"); });
  }, [navigate]);

  useEffect(() => {
    fetch(`${API}/api/users/stats`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        setEmail(data.data?.email ?? "");
        setTotalImages(data.data?.totalImages ?? 0);
      });
  }, []);

  const username = email ? email.split("@")[0] : "there";

  return (
    <>
      <Navbar />
      <main className="min-h-screen animated-bg grid-overlay text-white">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="float-orb absolute top-20 -left-32 w-72 h-72 bg-indigo-600/8 rounded-full blur-3xl" />
          <div className="float-orb-delayed absolute top-40 -right-32 w-72 h-72 bg-purple-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-6xl mx-auto px-6 py-12">
          <div className="mb-10">
            <p className="text-indigo-400 text-sm font-medium mb-1">Welcome back 👋</p>
            <h1 className="text-5xl font-extrabold tracking-tight">
              <span className="gradient-text">{username}</span>
            </h1>
            <p className="text-slate-400 mt-2 text-base">{email}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
            <div className="glass card-hover rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Images Generated</span>
                <div className="w-9 h-9 rounded-xl bg-indigo-500/15 flex items-center justify-center">
                  <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <p className="text-6xl font-black gradient-text">{totalImages}</p>
              <p className="text-slate-500 text-xs mt-2">Total images created</p>
            </div>

            <div className="glass card-hover rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Account</span>
                <div className="w-9 h-9 rounded-xl bg-purple-500/15 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-xs font-bold text-white">
                  {username[0]?.toUpperCase()}
                </div>
                <p className="text-sm text-white break-all font-medium">{email}</p>
              </div>
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span className="text-emerald-400 text-xs font-medium">Active</span>
              </div>
            </div>

            <div className="glass card-hover rounded-2xl p-6 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-widest">Quick Actions</span>
                <div className="w-9 h-9 rounded-xl bg-sky-500/15 flex items-center justify-center">
                  <svg className="w-5 h-5 text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
              <div className="flex flex-col gap-3 mt-1">
                <button onClick={() => navigate("/generate")}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white text-sm font-semibold transition-all shadow-lg shadow-indigo-500/20">
                  ✦ Generate Image
                </button>
                <button onClick={() => navigate("/history")}
                  className="w-full py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-white text-sm font-medium transition-all">
                  View History
                </button>
              </div>
            </div>
          </div>

          <div className="glass rounded-2xl p-8 shadow-xl">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-500/20">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white mb-2">AI Image Generator</h2>
                <p className="text-slate-400 text-sm leading-relaxed max-w-2xl">
                  Generate AI-powered images from text prompts, save them to your account, download anytime, and manage your entire image history — all from one place.
                </p>
                <div className="flex flex-wrap gap-2 mt-4">
                  {["Text to Image", "Save to Account", "Download Anytime", "Manage History"].map((tag) => (
                    <span key={tag} className="px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700/50 text-slate-400 text-xs">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
