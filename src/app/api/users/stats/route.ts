import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Image from "@/models/Image";
import { requireAuth } from "@/lib/authMiddleware";

// GET /api/users/stats — get stats for the logged-in user
export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    await connectDB();

    const totalImages = await Image.countDocuments({ userId: auth.payload.userId });

    return NextResponse.json(
      {
        status: "success",
        data: {
          email: auth.payload.email,
          totalImages,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
