import { Schema, model, Document } from "mongoose";
import slugify from "slugify";

export interface IPortfolioItem extends Document {
  title: string;
  slug: string;
  description: string; // Will store sanitized HTML
  images?: string[]; // آرایه عکس‌ها
  cover?: string; // عکس کاور
  videoUrl?: string; // آدرس ویدیو
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

const portfolioItemSchema = new Schema<IPortfolioItem>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    images: [{ type: String }], // آرایه عکس‌ها
    cover: { type: String }, // عکس کاور
    videoUrl: { type: String }, // آدرس ویدیو
    mediaUrl: { type: String },
    mediaType: { type: String, enum: ["image", "video"] },
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt

// Create a URL-friendly slug from the title before saving
portfolioItemSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const PortfolioItem = model<IPortfolioItem>(
  "PortfolioItem",
  portfolioItemSchema
);
