import { Router, Request, Response } from "express";
import bcrypt from "bcrypt";
import { connectDB } from "../lib/mongoose";
import User from "../models/User";
import { generateToken, verifyToken } from "../lib/auth";
import { requireAuth, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// POST /api/auth/register
router.post("/register", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ status: "error", message: "Email and password are required" });
      return;
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(409).json({ status: "error", message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ email, password: hashedPassword });

    res.status(201).json({
      status: "success",
      data: { userId: user._id, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Registration failed" });
  }
});

// POST /api/auth/login
router.post("/login", async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ status: "error", message: "Email and password are required" });
      return;
    }

    await connectDB();

    const user = await User.findOne({ email });
    if (!user) {
      res.status(404).json({ status: "error", message: "User not found" });
      return;
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      res.status(401).json({ status: "error", message: "Invalid credentials" });
      return;
    }

    const token = generateToken(user._id.toString(), user.email);

    res.cookie("token", token, {
      httpOnly: false,
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: "/",
    });

    res.status(200).json({ status: "success", message: "Login successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Login failed" });
  }
});

// POST /api/auth/logout
router.post("/logout", (_req: Request, res: Response) => {
  res.cookie("token", "", { maxAge: 0, path: "/" });
  res.status(200).json({ status: "success", message: "Logged out successfully" });
});

// GET /api/auth/me
router.get("/me", requireAuth, (req: AuthRequest, res: Response) => {
  res.status(200).json({
    status: "success",
    data: { user: req.user },
  });
});

export default router;
