import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongoose";
import Image from "@/models/Image";
import { requireAuth } from "@/lib/authMiddleware";

// DELETE /api/images/:id — delete a specific image
export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  try {
    const { id } = await params;

    await connectDB();

    const image = await Image.findById(id);

    if (!image) {
      return NextResponse.json(
        { status: "error", message: "Image not found" },
        { status: 404 }
      );
    }

    if (image.userId.toString() !== auth.payload.userId) {
      return NextResponse.json(
        { status: "error", message: "Forbidden — you do not own this image" },
        { status: 403 }
      );
    }

    await Image.findByIdAndDelete(id);

    return NextResponse.json(
      { status: "success", message: "Image deleted" },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { status: "error", message: "Delete failed" },
      { status: 500 }
    );
  }
}
