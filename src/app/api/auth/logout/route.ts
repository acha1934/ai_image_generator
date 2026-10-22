import { NextResponse } from "next/server";

// POST /api/auth/logout
export async function POST() {
  const response = NextResponse.json(
    { status: "success", message: "Logged out successfully" },
    { status: 200 }
  );

  response.cookies.set("token", "", {
    maxAge: 0,
    path: "/",
  });

  return response;
}
