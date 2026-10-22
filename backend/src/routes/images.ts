import { Router, Request, Response } from "express";
import { connectDB } from "../lib/mongoose";
import Image from "../models/Image";
import { hf } from "../lib/huggingface";
import { requireAuth, AuthRequest } from "../middleware/authMiddleware";

const router = Router();

// GET /api/images — get all images for logged-in user
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    await connectDB();

    const images = await Image.find({ userId: req.user!.userId })
      .sort({ createdAt: -1 })
      .lean();

    res.status(200).json({ status: "success", data: { images } });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Failed to fetch images" });
  }
});

// POST /api/images — generate and save a new image
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      res.status(400).json({ status: "error", message: "Prompt is required" });
      return;
    }

    const image = await hf.textToImage({
      model: "stabilityai/stable-diffusion-xl-base-1.0",
      inputs: prompt,
    });

    const arrayBuffer = await (image as any).arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    await connectDB();

    const saved = await Image.create({
      prompt,
      imageData: base64,
      userId: req.user!.userId,
    });

    res.status(201).json({
      status: "success",
      data: { imageId: saved._id, image: base64 },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Image generation failed" });
  }
});

// DELETE /api/images/:id — delete a specific image
router.delete("/:id", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    await connectDB();

    const image = await Image.findById(id);

    if (!image) {
      res.status(404).json({ status: "error", message: "Image not found" });
      return;
    }

    if (image.userId.toString() !== req.user!.userId) {
      res.status(403).json({ status: "error", message: "Forbidden — you do not own this image" });
      return;
    }

    await Image.findByIdAndDelete(id);

    res.status(200).json({ status: "success", message: "Image deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Delete failed" });
  }
});

export default router;
