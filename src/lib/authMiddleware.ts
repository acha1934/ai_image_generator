import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyToken } from "@/lib/auth";

export type AuthPayload = {
  userId: string;
  email: string;
};

/**
 * Verifies the JWT cookie and returns the decoded payload.
 * Returns a NextResponse error if unauthorized.
 */
export async function requireAuth(): Promise<
  { payload: AuthPayload; error: null } |
  { payload: null; error: NextResponse }
> {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  if (!token) {
    return {
      payload: null,
      error: NextResponse.json(
        { status: "error", message: "Unauthorized — no token provided" },
        { status: 401 }
      ),
    };
  }

  try {
    const payload = verifyToken(token) as AuthPayload;
    return { payload, error: null };
  } catch {
    return {
      payload: null,
      error: NextResponse.json(
        { status: "error", message: "Unauthorized — invalid or expired token" },
        { status: 401 }
      ),
    };
  }
}
