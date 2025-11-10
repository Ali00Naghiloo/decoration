import { Schema, model, Document } from "mongoose";
import slugify from "slugify";

export interface ISample extends Document {
  title: string;
  slug: string;
  description: string; // Will store sanitized HTML (may include inline style/lang/dir wrapper)
  images?: string[]; // آرایه عکس‌ها
  cover?: string; // عکس کاور
  videoUrl?: string; // آدرس ویدیو
  mediaUrl?: string;
  mediaType?: string[]; // ["image","video"]
  status?: number; // 1: نمایش داده شود، 0: نمایش داده نشود
  des?: string; // توضیح خلاصه برای کارت
  lang?: "fa" | "en"; // زبان محتوا — برای تعیین جهت و فونت در فرانت و پنل
}

const sampleSchema = new Schema<ISample>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String, required: true },
    images: [{ type: String }], // آرایه عکس‌ها
    cover: { type: String }, // عکس کاور
    videoUrl: { type: String }, // آدرس ویدیو
    mediaUrl: { type: String },
    mediaType: [{ type: String, enum: ["image", "video"] }],
    status: { type: Number, default: 1 }, // 1: نمایش داده شود، 0: نمایش داده نشود
    des: { type: String, default: "" }, // توضیح خلاصه برای کارت
    lang: { type: String, enum: ["fa", "en"], default: "fa" }, // زبان محتوا
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt

// Create a URL-friendly slug from the title before saving
sampleSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

export const Sample = model<ISample>("Sample", sampleSchema, "samples");
