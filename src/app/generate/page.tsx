"use client";
import { useState } from "react";
import Navbar from "@/components/navbar";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function GeneratePage() {
  const [image, setImage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`${API}/api/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ prompt }),
      });
      const data = await response.json();
      if (data.data?.image) {
        setImage(`data:image/png;base64,${data.data.image}`);
      }
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen animated-bg grid-overlay text-white">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="float-orb absolute top-1/4 -left-32 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl" />
          <div className="float-orb-delayed absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-3xl mx-auto px-6 py-20">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-medium mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
              Powered by AI
            </div>
            <h1 className="text-6xl font-extrabold tracking-tight mb-4">
              <span className="gradient-text">AI Image</span>
              <br />
              <span className="text-white">Generator</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-md mx-auto">
              Transform your words into stunning visuals. Just describe it — AI does the rest.
            </p>
          </div>

          <div className="glass rounded-2xl p-8 shadow-2xl shadow-black/40">
            <label className="block text-sm font-medium text-slate-400 mb-2 uppercase tracking-wider">
              Your Prompt
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="A serene Japanese garden at sunset, with cherry blossoms falling..."
              className="input-field w-full h-36 p-4 rounded-xl bg-slate-900/80 border border-slate-700/50 text-white placeholder-slate-500 resize-none text-sm leading-relaxed"
            />
            <button
              onClick={handleGenerate}
              disabled={loading}
              className={`mt-4 w-full py-4 rounded-xl font-semibold text-white text-base transition-all duration-300 ${
                loading
                  ? "bg-slate-700 cursor-not-allowed text-slate-400"
                  : "bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 glow-btn shadow-lg shadow-indigo-500/20"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-3">
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Generating your image...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Generate Image
                </span>
              )}
            </button>
          </div>

          {image && (
            <div className="mt-8 glass rounded-2xl overflow-hidden shadow-2xl shadow-black/40">
              <div className="px-6 pt-5 pb-3 flex items-center justify-between border-b border-slate-700/40">
                <span className="text-sm font-medium text-slate-300">Generated Image</span>
                <span className="text-xs text-slate-500 truncate max-w-xs">{prompt}</span>
              </div>
              <div className="relative group">
                <img
                  src={image}
                  alt="Generated"
                  className="w-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </div>
          )}

          {loading && !image && (
            <div className="mt-8 glass rounded-2xl overflow-hidden">
              <div className="shimmer w-full h-80 rounded-2xl" />
            </div>
          )}
        </div>
      </main>
    </>
  );
}
