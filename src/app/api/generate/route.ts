import { NextResponse } from "next/server";
import { hf } from "@/lib/huggingface";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const cookieStore = await cookies();

    const token =
      cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized",
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

    const image = await hf.textToImage({
      model:
        "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
    });

    const arrayBuffer =
      await (image as any).arrayBuffer();

    const base64 =
      Buffer.from(arrayBuffer).toString(
        "base64"
      );

    await prisma.image.create({
      data: {
        prompt,
        imageData: base64,
        userId: decoded.userId,
      },
    });

    return NextResponse.json({
      success: true,
      image: base64,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Image generation failed",
      },
      {
        status: 500,
      }
    );
  }
}