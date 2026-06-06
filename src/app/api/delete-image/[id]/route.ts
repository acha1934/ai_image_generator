import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get("token")?.value;

    console.log("TOKEN:", token);

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "No token found",
        },
        {
          status: 401,
        }
      );
    }

    const decoded =
      verifyToken(token) as {
        userId: string;
        email: string;
      };

    console.log("DECODED USER:", decoded);

    const { id } = await params;

    console.log("IMAGE ID:", id);

    const image =
      await prisma.image.findUnique({
        where: {
          id,
        },
      });

    console.log("IMAGE FOUND:", image);

    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: "Image not found",
        },
        {
          status: 404,
        }
      );
    }

    console.log(
      "IMAGE USER:",
      image.userId
    );

    console.log(
      "TOKEN USER:",
      decoded.userId
    );

    if (image.userId !== decoded.userId) {
      console.log(
        "UNAUTHORIZED DELETE ATTEMPT"
      );

      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
        },
        {
          status: 403,
        }
      );
    }

    console.log(
      "DELETING IMAGE:",
      id
    );

    await prisma.image.delete({
      where: {
        id,
      },
    });

    console.log(
      "IMAGE DELETED SUCCESSFULLY"
    );

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE ERROR:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Delete failed",
      },
      {
        status: 500,
      }
    );
  }
}