import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../lib/auth";

export interface AuthRequest extends Request {
  user?: { userId: string; email: string };
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    res.status(401).json({ status: "error", message: "Unauthorized — no token provided" });
    return;
  }

  try {
    const payload = verifyToken(token) as { userId: string; email: string };
    req.user = payload;
    next();
  } catch {
    res.status(401).json({ status: "error", message: "Unauthorized — invalid or expired token" });
  }
}
