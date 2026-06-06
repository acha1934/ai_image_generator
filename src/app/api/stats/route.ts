import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function GET() {
  try {
    const cookieStore = await cookies();

    const token =
      cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
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

    const totalImages =
      await prisma.image.count({
        where: {
          userId: decoded.userId,
        },
      });

    return NextResponse.json({
      success: true,
      totalImages,
      email: decoded.email,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
      },
      {
        status: 500,
      }
    );
  }
}