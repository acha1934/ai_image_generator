import { Router, Response } from "express";
import { connectDB } from "../lib/mongoose";
import Image from "../models/Image";
import { requireAuth, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// GET /api/users/stats — get stats for the logged-in user
router.get("/stats", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();

    const totalImages = await Image.countDocuments({ userId: req.user!.userId });

    res.status(200).json({
      status: "success",
      data: {
        email: req.user!.email,
        totalImages,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Failed to fetch stats" });
  }
});

export default router;
