import { NextResponse } from "next/server";
import { requireAuth } from "@/lib/authMiddleware";

// GET /api/auth/me
export async function GET() {
  const auth = await requireAuth();

  if (auth.error) return auth.error;

  return NextResponse.json(
    { status: "success", data: { user: auth.payload } },
    { status: 200 }
  );
}
