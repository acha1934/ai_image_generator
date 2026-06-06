import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { generateToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found",
        },
        {
          status: 404,
        }
      );
    }

    const isValid = await bcrypt.compare(
      password,
      user.password
    );

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid password",
        },
        {
          status: 401,
        }
      );
    }

    const token = generateToken(
  user.id,
  user.email
);

const response =
  NextResponse.json({
    success: true,
    message: "Login successful",
  });

response.cookies.set(
  "token",
  token,
  {
    httpOnly: false,
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  }
);

return response;
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Login failed",
      },
      {
        status: 500,
      }
    );
  }
}