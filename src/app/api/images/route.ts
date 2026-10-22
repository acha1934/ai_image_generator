import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Image from "@/models/Image";
import { requireAuth } from "@/lib/authMiddleware";
import { hf } from "@/lib/huggingface";

// GET /api/images — fetch all images for logged-in user
export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    await connectDB();

    const images = await Image.find({ userId: auth.payload.userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(
      { status: "success", data: { images } },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch images" },
      { status: 500 }
    );
  }
}

// POST /api/images — generate and save a new image
export async function POST(req: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json(
        { status: "error", message: "Prompt is required" },
        { status: 400 }
      );
    }

    const image = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
    });

    const arrayBuffer = await (image as any).arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    await connectDB();

    const saved = await Image.create({
      prompt,
      imageData: base64,
      userId: auth.payload.userId,
    });

    return NextResponse.json(
      { status: "success", data: { imageId: saved._id, image: base64 } },
      { status: 201 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Image generation failed" },
      { status: 500 }
    );
  }
}
