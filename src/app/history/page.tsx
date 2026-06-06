"use client";

import Navbar from "@/components/navbar";
import { useEffect, useState } from "react";

export default function HistoryPage() {
  const [images, setImages] = useState<any[]>([]);
  const [selectedImage, setSelectedImage] =
    useState<string | null>(null);

  useEffect(() => {
    fetch("/api/history")
      .then((res) => res.json())
      .then((data) => {
        setImages(data.images);
      });
  }, []);

  const downloadImage = (
    imageData: string,
    prompt: string
  ) => {
    const link =
      document.createElement("a");

    link.href =
      `data:image/png;base64,${imageData}`;

    link.download =
      `${prompt}.png`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
  };

  const deleteImage = async (id: string) => {
    await fetch(
      `/api/delete-image/${id}`,
      {
        method: "DELETE",
      }
    );

    setImages((prev) =>
      prev.filter(
        (image) => image.id !== id
      )
    );
  };

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
            max-w-7xl
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
            Image History
          </h1>

          <p
            className="
              text-slate-400
              mb-10
            "
          >
            Browse, download and manage
            your AI-generated images.
          </p>

          {images.length === 0 ? (
            <div
              className="
                bg-slate-900
                border
                border-slate-800
                rounded-2xl
                p-10
                text-center
              "
            >
              <p className="text-slate-400">
                No images generated yet.
              </p>
            </div>
          ) : (
            <div
              className="
                grid
                grid-cols-1
                md:grid-cols-2
                lg:grid-cols-3
                gap-8
              "
            >
              {images.map((image) => (
                <div
                  key={image.id}
                  className="
                    bg-slate-900
                    border
                    border-slate-800
                    rounded-2xl
                    overflow-hidden
                    shadow-lg

                    transition-all
                    duration-300

                    hover:-translate-y-2
                    hover:shadow-2xl
                  "
                >
                  <img
                    src={`data:image/png;base64,${image.imageData}`}
                    alt={image.prompt}
                    onClick={() =>
                      setSelectedImage(
                        image.imageData
                      )
                    }
                    className="
                      w-full
                      h-64
                      object-cover
                      cursor-pointer

                      transition-transform
                      duration-300

                      hover:scale-105
                    "
                  />

                  <div className="p-5">
                    <p
                      className="
                        text-lg
                        font-semibold
                        mb-2
                        truncate
                      "
                    >
                      {image.prompt}
                    </p>

                    <p
                      className="
                        text-sm
                        text-slate-400
                        mb-4
                      "
                    >
                      {new Date(
                        image.createdAt
                      ).toLocaleDateString()}
                    </p>

                    <div className="flex gap-3">
                      <button
                        onClick={() =>
                          downloadImage(
                            image.imageData,
                            image.prompt
                          )
                        }
                        className="
                          flex-1
                          bg-blue-600
                          hover:bg-blue-700
                          transition-colors
                          py-2
                          rounded-lg
                        "
                      >
                        Download
                      </button>

                      <button
                        onClick={() =>
                          deleteImage(
                            image.id
                          )
                        }
                        className="
                          flex-1
                          bg-red-600
                          hover:bg-red-700
                          transition-colors
                          py-2
                          rounded-lg
                        "
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedImage && (
            <div
              className="
                fixed
                inset-0
                bg-black/90
                flex
                items-center
                justify-center
                z-50
                p-6
              "
              onClick={() =>
                setSelectedImage(null)
              }
            >
              <img
                src={`data:image/png;base64,${selectedImage}`}
                alt="Preview"
                className="
                  max-w-[90vw]
                  max-h-[90vh]
                  rounded-2xl
                  shadow-2xl
                "
              />
            </div>
          )}
        </div>
      </main>
    </>
  );
}