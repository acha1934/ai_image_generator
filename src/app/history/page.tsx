"use client";

import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function HistoryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<string>("");

  useEffect(() => {
    fetch(`${API}/api/images`, { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setImages(data.data?.images ?? []));
  }, []);

  const downloadImage = (imageData: string, prompt: string) => {
    const link = document.createElement("a");
    link.href = `data:image/png;base64,${imageData}`;
    link.download = `${prompt}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const deleteImage = async (id: string) => {
    await fetch(`${API}/api/images/${id}`, { method: "DELETE", credentials: "include" });
    setImages((prev) => prev.filter((image) => image.id !== id));
  };

  return (
    <>
      <Navbar />

      <main className="min-h-screen animated-bg grid-overlay text-white">
        {/* Decorative orbs */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="float-orb absolute top-20 -left-32 w-80 h-80 bg-indigo-600/8 rounded-full blur-3xl" />
          <div className="float-orb-delayed absolute bottom-20 -right-32 w-80 h-80 bg-purple-600/8 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          {/* Header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-indigo-400 text-sm font-medium mb-1">Your creations</p>
              <h1 className="text-5xl font-extrabold tracking-tight">
                <span className="gradient-text">Image History</span>
              </h1>
              <p className="text-slate-400 mt-2">Browse, download and manage your AI-generated images.</p>
            </div>
            {images.length > 0 && (
              <div className="glass rounded-xl px-5 py-3 text-center">
                <p className="text-3xl font-black gradient-text">{images.length}</p>
                <p className="text-slate-400 text-xs mt-0.5">images</p>
              </div>
            )}
          </div>

          {/* Empty state */}
          {images.length === 0 ? (
            <div className="glass rounded-2xl p-16 text-center shadow-xl">
              <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
                <svg className="w-8 h-8 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">No images yet</h3>
              <p className="text-slate-400 text-sm mb-6">Start generating to see your creations here.</p>
              <a
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm transition-all shadow-lg shadow-indigo-500/20"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Generate your first image
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <div
                  key={image.id}
                  className="glass card-hover rounded-2xl overflow-hidden shadow-xl group"
                >
                  {/* Image */}
                  <div className="relative overflow-hidden h-60">
                    <img
                      src={`data:image/png;base64,${image.imageData}`}
                      alt={image.prompt}
                      onClick={() => {
                        setSelectedImage(image.imageData);
                        setSelectedPrompt(image.prompt);
                      }}
                      className="w-full h-full object-cover cursor-pointer transition-transform duration-500 group-hover:scale-105"
                    />
                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <span className="text-white text-xs font-medium">Click to preview</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-5">
                    <p className="text-sm font-semibold text-white mb-1 truncate" title={image.prompt}>
                      {image.prompt}
                    </p>
                    <p className="text-xs text-slate-500 mb-4 flex items-center gap-1.5">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {new Date(image.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </p>

                    <div className="flex gap-2">
                      <button
                        onClick={() => downloadImage(image.imageData, image.prompt)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600/20 hover:bg-indigo-600/30 border border-indigo-500/20 hover:border-indigo-400/40 text-indigo-300 hover:text-indigo-200 text-xs font-semibold transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </button>
                      <button
                        onClick={() => deleteImage(image.id)}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/15 hover:border-red-400/30 text-red-400 hover:text-red-300 text-xs font-semibold transition-all"
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Lightbox */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/95 backdrop-blur-sm flex flex-col items-center justify-center z-50 p-6"
            onClick={() => setSelectedImage(null)}
          >
            <div
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-300 hover:text-white transition-all flex items-center justify-center"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
              <img
                src={`data:image/png;base64,${selectedImage}`}
                alt="Preview"
                className="w-full rounded-2xl shadow-2xl"
              />
              {selectedPrompt && (
                <div className="mt-4 px-5 py-3 glass rounded-xl">
                  <p className="text-slate-300 text-sm text-center italic">&ldquo;{selectedPrompt}&rdquo;</p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
