"use client";

import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();

  const [email, setEmail] =
    useState("");

  const [totalImages, setTotalImages] =
    useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      const res =
        await fetch("/api/me");

      if (!res.ok) {
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  useEffect(() => {
    const loadStats = async () => {
      const res =
        await fetch("/api/stats");

      const data =
        await res.json();

      setEmail(data.email);

      setTotalImages(
        data.totalImages
      );
    };

    loadStats();
  }, []);

  return (
    <>
      <Navbar />

      <main
        className="
          min-h-screen
          bg-slate-950
          text-white
          px-10
          py-12
        "
      >
        <div
          className="
            max-w-6xl
            mx-auto
          "
        >
          <h1
            className="
              text-5xl
              font-bold
              mb-3
            "
          >
            Dashboard
          </h1>

          <p
            className="
              text-slate-400
              text-lg
              mb-10
            "
          >
            Welcome back,
            {" "}
            <span
              className="
                text-white
                font-medium
              "
            >
              {email}
            </span>
          </p>

          <div
            className="
              grid
              grid-cols-1
              md:grid-cols-3
              gap-6
            "
          >
            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-6
                shadow-lg
              "
            >
              <h2
                className="
                  text-slate-400
                  text-sm
                  uppercase
                  tracking-wide
                "
              >
                Images Generated
              </h2>

              <p
                className="
                  text-5xl
                  font-bold
                  mt-3
                "
              >
                {totalImages}
              </p>
            </div>

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-6
                shadow-lg
              "
            >
              <h2
                className="
                  text-slate-400
                  text-sm
                  uppercase
                  tracking-wide
                "
              >
                Account
              </h2>

              <p
                className="
                  text-lg
                  mt-3
                  break-all
                "
              >
                {email}
              </p>
            </div>

            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-6
                shadow-lg
              "
            >
              <h2
                className="
                  text-slate-400
                  text-sm
                  uppercase
                  tracking-wide
                "
              >
                Quick Actions
              </h2>

              <div
                className="
                  flex
                  flex-col
                  gap-3
                  mt-4
                "
              >
                <button
                  onClick={() =>
                    router.push("/")
                  }
                  className="
                    bg-blue-600
                    hover:bg-blue-700
                    transition-colors
                    py-2
                    rounded-lg
                  "
                >
                  Generate Image
                </button>

                <button
                  onClick={() =>
                    router.push("/history")
                  }
                  className="
                    bg-green-600
                    hover:bg-green-700
                    transition-colors
                    py-2
                    rounded-lg
                  "
                >
                  View History
                </button>
              </div>
            </div>
          </div>

          <div
            className="
              mt-10
              bg-slate-900
              border
              border-slate-800
              rounded-2xl
              p-8
            "
          >
            <h2
              className="
                text-2xl
                font-semibold
                mb-3
              "
            >
              AI Image Generator
            </h2>

            <p
              className="
                text-slate-400
              "
            >
              Generate AI-powered images,
              save them to your account,
              download them, and manage
              your image history from one
              place.
            </p>
          </div>
        </div>
      </main>
    </>
  );
}