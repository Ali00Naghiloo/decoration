import { Schema, model, Document } from "mongoose";
import slugify from "slugify";

export interface ITranslatedField {
  fa?: string;
  en?: string;
}

export interface ISample extends Document {
  title: ITranslatedField;
  slug: string;
  description: ITranslatedField; // sanitized HTML per language (wrap with lang/dir on create)
  images?: string[]; // آرایه عکس‌ها
  cover?: string; // عکس کاور
  videoUrl?: string; // آدرس ویدیو
  mediaUrl?: string;
  mediaType?: string[]; // ["image","video"]
  status?: number; // 1: نمایش داده شود، 0: نمایش داده نشود
  des?: ITranslatedField; // توضیح خلاصه برای کارت (ترجمه‌شده)
  lang?: "fa" | "en"; // fallback language / original language for legacy items
}

const sampleSchema = new Schema<ISample>(
  {
    title: {
      fa: { type: String, required: true, trim: true },
      en: { type: String, default: "" },
    },
    slug: { type: String, unique: true },
    description: {
      fa: { type: String, required: true },
      en: { type: String, default: "" },
    },
    images: [{ type: String }], // آرایه عکس‌ها
    cover: { type: String }, // عکس کاور
    videoUrl: { type: String }, // آدرس ویدیو
    mediaUrl: { type: String },
    mediaType: [{ type: String, enum: ["image", "video"] }],
    status: { type: Number, default: 1 }, // 1: نمایش داده شود، 0: نمایش داده نشود
    des: {
      fa: { type: String, default: "" },
      en: { type: String, default: "" },
    },
    lang: { type: String, enum: ["fa", "en"], default: "fa" }, // fallback language
  },
  { timestamps: true }
); // Automatically adds createdAt and updatedAt

// Create a URL-friendly slug from the title before saving
sampleSchema.pre("save", function (next) {
  if (this.isModified("title")) {
    // title may be an object now; pick the first non-empty value for slug
    const t: any = (this as any).title || {};
    const base = (t.fa && t.fa.trim()) || (t.en && t.en.trim()) || "";
    this.slug = slugify(base, { lower: true, strict: true });
  }
  next();
});

export const Sample = model<ISample>("Sample", sampleSchema, "samples");
