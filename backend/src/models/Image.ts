import mongoose, { Schema, Document, Model } from "mongoose";

export interface IImage extends Document {
  prompt: string;
  imageData: string;
  userId: mongoose.Types.ObjectId;
  createdAt: Date;
}

const ImageSchema = new Schema<IImage>(
  {
    prompt: { type: String, required: true },
    imageData: { type: String, required: true },
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Image: Model<IImage> =
  mongoose.models.Image || mongoose.model<IImage>("Image", ImageSchema);

export default Image;
