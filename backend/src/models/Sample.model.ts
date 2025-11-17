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
    // Allow both legacy string and per-language object by using Mixed;
    // higher-level controllers normalize to { fa?, en? } shape before saving,
    // but schema accepts either to avoid cast errors for legacy docs.
    title: { type: Schema.Types.Mixed, required: true },
    slug: { type: String, unique: true, required: true },
    description: { type: Schema.Types.Mixed },
    images: [{ type: String }], // آرایه عکس‌ها
    cover: { type: String }, // عکس کاور
    videoUrl: { type: String }, // آدرس ویدیو
    mediaUrl: { type: String },
    mediaType: [{ type: String, enum: ["image", "video"] }],
    status: { type: Number, default: 1 }, // 1: نمایش داده شود، 0: نمایش داده نشود
    des: { type: Schema.Types.Mixed },
    lang: { type: String, enum: ["fa", "en"], default: "fa" }, // fallback language
  },
  {
    timestamps: true,
    // Optimize queries
    toJSON: { virtuals: false },
    toObject: { virtuals: false },
  }
); // Automatically adds createdAt and updatedAt

// Add compound index for better performance
sampleSchema.index({ status: 1, createdAt: -1 });
sampleSchema.index({ lang: 1, status: 1 });

// Validation for required fields
sampleSchema.pre("save", function (next) {
  const title = this.title as any;
  const description = this.description as any;

  // Ensure at least one title exists
  if (!title?.fa && !title?.en) {
    return next(new Error("At least one title (fa or en) is required"));
  }

  // Ensure at least one description exists
  if (!description?.fa && !description?.en) {
    return next(new Error("At least one description (fa or en) is required"));
  }

  next();
});

export const Sample = model<ISample>("Sample", sampleSchema, "samples");
