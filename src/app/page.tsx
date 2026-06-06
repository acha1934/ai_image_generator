"use client";
import { useState } from "react";

export default function Home() {
  const [image, setImage] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

 const handleGenerate = async () => {
  if (!prompt.trim()) return;

  setLoading(true);

  try {
    const response = await fetch("/api/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
      }),
    });

    const data = await response.json();

    if (data.image) {
      setImage(
        `data:image/png;base64,${data.image}`
      );
    }
  } catch (error) {
    console.error(error);
  }

  setLoading(false);
};

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-6 py-12">

        <h1 className="text-5xl font-bold text-center">
          AI Image Generator
        </h1>

        <p className="text-center text-slate-400 mt-4">
          Create stunning AI images from text prompts
        </p>

        <div className="mt-10 flex flex-col gap-4">

          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe the image you want..."
            className="w-full h-36 p-4 rounded-lg bg-slate-900 border border-slate-700 outline-none"
          />

          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg font-semibold disabled:bg-gray-600"
          >
            {loading ? "Generating..." : "Generate Image"}
          </button>
          {image && (
  <div className="mt-10">
    <img
      src={image}
      alt="Generated"
      className="rounded-lg w-full max-w-lg mx-auto"
    />
  </div>
)}
        </div>
      </div>
    </main>
  );
}