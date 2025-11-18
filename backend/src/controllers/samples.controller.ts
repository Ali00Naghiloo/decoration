import { Request, Response, NextFunction } from "express";
import { Sample } from "../models/Sample.model";
import slugify from "slugify";
import { AppError } from "../utils/AppError";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import fs from "fs";
import path from "path";
import { FILE_SERVER_BASE_URL } from "../config/db";

const window = new JSDOM("").window;
const purify = DOMPurify(window as any);

// Helper function to build the full URL for a file
const getFileUrl = (_req: Request, filename: string) => {
  return `${FILE_SERVER_BASE_URL}/uploads/${filename}`;
};

// Helper function to normalize existing URLs (fix legacy URLs)
const normalizeUrl = (url: string | undefined): string | undefined => {
  if (!url) return undefined;

  // If it's already correct, return as is
  if (url.includes("/api/uploads/")) return url;

  // Fix legacy URLs that might be missing /api
  if (url.startsWith("https://api.rokhnegar.art/uploads/")) {
    return url.replace(
      "https://api.rokhnegar.art/uploads/",
      "https://api.rokhnegar.art/api/uploads/"
    );
  }

  // If it's a relative path, build full URL
  if (!url.startsWith("http")) {
    return `${FILE_SERVER_BASE_URL}/uploads/${url}`;
  }

  return url;
};

// Helper function to normalize array of URLs
const normalizeUrls = (urls: string[] | undefined): string[] => {
  if (!urls || !Array.isArray(urls)) return [];
  return urls.map((url) => normalizeUrl(url)).filter(Boolean) as string[];
};

// Helper: if a stored field can be either a legacy string or a JSON-stringified object,
// normalize it to an object { fa: string, en: string }.
const normalizeStoredTranslated = (val: any): { fa: string; en: string } => {
  // default empty object
  const empty = { fa: "", en: "" };
  if (val == null) return empty;

  // already an object with fa/en
  if (typeof val === "object") {
    return { fa: val.fa || "", en: val.en || "" };
  }

  // if it's a string, try to parse JSON first
  if (typeof val === "string") {
    const trimmed = val.trim();
    if (!trimmed) return empty;
    if (trimmed.startsWith("{")) {
      try {
        const p = JSON.parse(trimmed);
        return { fa: p.fa || "", en: p.en || "" };
      } catch {
        // fallthrough to legacy string handling
      }
    }
    // legacy single-language string -> assume fa by default (existing behavior)
    return { fa: val, en: "" };
  }

  return empty;
};

// --- CREATE ---
export const createPortfolioItem = async (
  req: Request & { files?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, status, des, lang, slug } = req.body;

    // Helper: parse and clean translations - only keep non-empty values
    const parseMaybeTranslated = (val: any, fallbackLang: string) => {
      const out: any = {};

      if (!val) return out;

      if (typeof val === "object") {
        if (val.fa && val.fa.trim()) out.fa = val.fa.trim();
        if (val.en && val.en.trim()) out.en = val.en.trim();
        return out;
      }

      if (typeof val === "string") {
        const trimmed = val.trim();
        if (!trimmed) return out;

        // try parse JSON
        if (trimmed.startsWith("{")) {
          try {
            const p = JSON.parse(trimmed);
            if (p.fa && p.fa.trim()) out.fa = p.fa.trim();
            if (p.en && p.en.trim()) out.en = p.en.trim();
            return out;
          } catch {
            // not JSON — treat as single-language string
          }
        }

        // Single language string
        if (fallbackLang === "en") {
          out.en = trimmed;
        } else {
          out.fa = trimmed;
        }
      }

      return out;
    };

    if (!title || !description) {
      return next(new AppError("Title and description are required.", 400));
    }

    const normalizedLang = lang === "en" ? "en" : "fa";

    // Parse fields - only include non-empty translations
    const titleObj = parseMaybeTranslated(title, normalizedLang);
    const desObj = parseMaybeTranslated(des, normalizedLang);
    const descParsed = parseMaybeTranslated(description, normalizedLang);

    // Validate that we have at least one title and description
    if (!titleObj.fa && !titleObj.en) {
      return next(
        new AppError("At least one title (fa or en) is required.", 400)
      );
    }
    if (!descParsed.fa && !descParsed.en) {
      return next(
        new AppError("At least one description (fa or en) is required.", 400)
      );
    }

    // Sanitize and wrap description per language
    const prepareDescriptionObj = (descObj: any) => {
      const out: any = {};
      (["fa", "en"] as const).forEach((l) => {
        const raw = descObj[l];
        if (raw && raw.trim()) {
          const sanitizedInner = purify.sanitize(raw, {
            ADD_ATTR: ["style", "class", "lang", "dir"],
          } as any);
          out[l] = `<div lang="${l}" dir="${
            l === "fa" ? "rtl" : "ltr"
          }" class="sample-content">${sanitizedInner}</div>`;
        }
      });
      return out;
    };

    const descriptionObj = prepareDescriptionObj(descParsed);

    // generate slug (use provided slug if present, otherwise create one from title + suffix)
    const baseSlugTitle = (titleObj.fa || titleObj.en || "sample").slice(
      0,
      120
    );
    const generatedSlug =
      slugify(baseSlugTitle, { lower: true, strict: false }) +
      "-" +
      Date.now().toString(36);
    const itemSlug =
      slug && String(slug).trim() ? String(slug).trim() : generatedSlug;

    // ذخیره چند عکس و انتخاب کاور
    let images: string[] = [];
    let cover: string | undefined = undefined;

    if (req.files && req.files["images"]) {
      images = req.files["images"].map((file: any) =>
        getFileUrl(req, file.filename)
      );
      if (images.length > 0) {
        cover = images[0];
      }
    }

    // ویدیو (اختیاری)
    let videoUrl: string | undefined = undefined;
    if (req.files && req.files["video"] && req.files["video"][0]) {
      videoUrl = getFileUrl(req, req.files["video"][0].filename);
    }

    // تعیین نوع مدیا بر اساس وجود تصاویر و ویدیو
    const mediaTypeArr: string[] = [];
    if (images.length > 0) mediaTypeArr.push("image");
    if (videoUrl) mediaTypeArr.push("video");

    const newItem = await Sample.create({
      title: { fa: titleObj.fa || "", en: titleObj.en || "" },
      slug: itemSlug,
      description: { fa: descriptionObj.fa || "", en: descriptionObj.en || "" },
      images,
      cover,
      videoUrl,
      mediaUrl: cover,
      mediaType: mediaTypeArr,
      status: typeof status !== "undefined" ? status : 1,
      des: { fa: desObj.fa || "", en: desObj.en || "" },
      lang: normalizedLang,
    });

    res.status(201).json({ status: "success", data: newItem });
  } catch (error) {
    next(error);
  }
};

// --- READ (getAllPortfolioItems and getPortfolioItemBySlug remain the same) ---
/**
 * GET /api/samples/:id
 * Returns a single portfolio item with images and videoUrl
 */
export const getPortfolioItemById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locale = req.query.locale === "en" ? "en" : "fa";
    const item = await Sample.findById(req.params.id);
    if (!item) {
      return next(new AppError("No item found with that ID.", 404));
    }

    const obj = item.toObject ? item.toObject() : item;

    // Normalize URLs
    const cover = normalizeUrl(obj.cover);
    const images = normalizeUrls(obj.images);
    const videoUrl = normalizeUrl(obj.videoUrl);
    const mediaUrl = normalizeUrl(obj.mediaUrl);

    // Support legacy schema where title/description/des were plain strings or JSON-stringified objects
    const titleObj = normalizeStoredTranslated(obj.title);
    const descObj = normalizeStoredTranslated(obj.description);
    const desObj = normalizeStoredTranslated(obj.des);

    // Response returns full translated objects for each field so clients
    // can choose the appropriate language or display both.
    const simple = {
      ...obj,
      // return the full objects instead of a single localized string
      title: titleObj,
      description: descObj,
      des: desObj,
      cover,
      images,
      videoUrl,
      mediaUrl,
      // keep translations for backward compatibility (same as the fields above)
      translations: {
        title: titleObj,
        description: descObj,
        des: desObj,
      },
    };

    res.status(200).json({
      status: "success",
      data: simple,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * GET /api/samples
 * Returns all portfolio items
 */
export const getAllPortfolioItems = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const locale = req.query.locale === "en" ? "en" : "fa";
    // اگر کوئری all=true باشد، همه نمونه‌کارها را برگردان (برای پنل)
    const filter = req.query.all === "true" ? {} : { status: 1 };
    const items = await Sample.find(filter);

    const itemsWithCover = items.map((item: any) => {
      const obj = item.toObject ? item.toObject() : item;

      const titleObj = normalizeStoredTranslated(obj.title);
      const descObj = normalizeStoredTranslated(obj.description);
      const desObj = normalizeStoredTranslated(obj.des);

      return {
        ...obj,
        // return full translated objects so frontend can pick or render both languages
        title: titleObj,
        description: descObj,
        des: desObj,
        translations: {
          title: titleObj,
          description: descObj,
          des: desObj,
        },
        cover: normalizeUrl(obj.cover || (obj.images && obj.images[0])),
        images: normalizeUrls(obj.images),
        videoUrl: normalizeUrl(obj.videoUrl),
        mediaUrl: normalizeUrl(obj.mediaUrl),
      };
    });
    res.status(200).json({
      status: "success",
      data: itemsWithCover,
    });
  } catch (error) {
    next(error);
  }
};

// --- UPDATE ---
export const updatePortfolioItem = async (
  req: Request & { files?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await Sample.findById(req.params.id);
    if (!item) {
      return next(new AppError("No item found with that ID.", 404));
    }

    const parseMaybeTranslated = (val: any, fallbackLang: string) => {
      const out: any = {};

      if (!val) return out;

      if (typeof val === "object") {
        if (val.fa && val.fa.trim()) out.fa = val.fa.trim();
        if (val.en && val.en.trim()) out.en = val.en.trim();
        return out;
      }

      if (typeof val === "string") {
        const trimmed = val.trim();
        if (!trimmed) return out;

        if (trimmed.startsWith("{")) {
          try {
            const p = JSON.parse(trimmed);
            if (p.fa && p.fa.trim()) out.fa = p.fa.trim();
            if (p.en && p.en.trim()) out.en = p.en.trim();
            return out;
          } catch {
            // not JSON
          }
        }

        if (fallbackLang === "en") {
          out.en = trimmed;
        } else {
          out.fa = trimmed;
        }
      }

      return out;
    };

    // Update title - merge with existing, only keep non-empty values
    if (typeof req.body.title !== "undefined") {
      const titleObj = parseMaybeTranslated(
        req.body.title,
        (req.body.lang as string) || item.lang || "fa"
      );

      // If stored title is a legacy string, convert it to the object shape first
      if (typeof item.title === "string") {
        const prev = item.title as string;
        const storedLang = (item.lang as string) || "fa";
        item.title = (
          storedLang === "en" ? { fa: "", en: prev } : { fa: prev, en: "" }
        ) as any;
      }

      const currentTitle = (item.title as any) || {};

      if (titleObj.fa && titleObj.fa.trim()) {
        item.set("title.fa", titleObj.fa);
      } else if (currentTitle.fa) {
        item.set("title.fa", currentTitle.fa);
      } else {
        item.set("title.fa", undefined);
      }

      if (titleObj.en && titleObj.en.trim()) {
        item.set("title.en", titleObj.en);
      } else if (currentTitle.en) {
        item.set("title.en", currentTitle.en);
      } else {
        item.set("title.en", undefined);
      }
    }

    // Update description (sanitize and wrap per language)
    if (typeof req.body.description !== "undefined") {
      const descParsed = parseMaybeTranslated(
        req.body.description,
        (req.body.lang as string) || item.lang || "fa"
      );
      const prepareDescriptionObj = (descObj: any) => {
        const out: any = {};
        (["fa", "en"] as const).forEach((l) => {
          const raw = descObj[l];
          if (raw && raw.trim()) {
            const inner = purify.sanitize(raw, {
              ADD_ATTR: ["style", "class", "lang", "dir"],
            } as any);
            out[l] = `<div lang="${l}" dir="${
              l === "fa" ? "rtl" : "ltr"
            }" class="sample-content">${inner}</div>`;
          }
        });
        return out;
      };

      const descToSave = prepareDescriptionObj(descParsed);
      const currentDesc = (item.description as any) || {};

      // Set nested fields explicitly to avoid casting issues when description was previously a string
      if (descToSave.fa && descToSave.fa.trim()) {
        item.set("description.fa", descToSave.fa);
      } else if (currentDesc.fa) {
        item.set("description.fa", currentDesc.fa);
      } else {
        item.set("description.fa", undefined);
      }

      if (descToSave.en && descToSave.en.trim()) {
        item.set("description.en", descToSave.en);
      } else if (currentDesc.en) {
        item.set("description.en", currentDesc.en);
      } else {
        item.set("description.en", undefined);
      }
    }

    if (typeof req.body.status !== "undefined") item.status = req.body.status;

    // des (summary) may be translated
    if (typeof req.body.des !== "undefined") {
      const desObj = parseMaybeTranslated(
        req.body.des,
        (req.body.lang as string) || item.lang || "fa"
      );
      const currentDes = (item.des as any) || {};

      // Set nested fields explicitly to avoid casting issues when des was previously a string
      if (desObj.fa && desObj.fa.trim()) {
        item.set("des.fa", desObj.fa);
      } else if (currentDes.fa) {
        item.set("des.fa", currentDes.fa);
      } else {
        item.set("des.fa", undefined);
      }

      if (desObj.en && desObj.en.trim()) {
        item.set("des.en", desObj.en);
      } else if (currentDes.en) {
        item.set("des.en", currentDes.en);
      } else {
        item.set("des.en", undefined);
      }
    }

    // Update language if provided and valid
    if (typeof req.body.lang !== "undefined") {
      const langVal = req.body.lang === "en" ? "en" : "fa";
      item.lang = langVal;
    }

    // به‌روزرسانی عکس‌ها
    if (req.body.images && Array.isArray(req.body.images)) {
      item.images = req.body.images;
      item.cover = req.body.images[0];
      item.mediaUrl = req.body.images[0];
      item.mediaType = ["image"];
    }
    if (req.files && req.files["images"]) {
      const images = req.files["images"].map((file: any) =>
        getFileUrl(req, file.filename)
      );
      if (images.length > 0) {
        item.images = images;
        item.cover = images[0];
        item.mediaUrl = images[0];
        item.mediaType = ["image"];
      }
    }

    // به‌روزرسانی ویدیو
    if (req.body.videoUrl && typeof req.body.videoUrl === "string") {
      item.videoUrl = req.body.videoUrl;
      item.mediaType = ["video"];
    }
    if (req.files && req.files["video"] && req.files["video"][0]) {
      const videoUrl = getFileUrl(req, req.files["video"][0].filename);
      item.videoUrl = videoUrl;
      item.mediaType = ["video"];
    }

    const updatedItem = await item.save();
    res.status(200).json({ status: "success", data: updatedItem });
  } catch (error) {
    next(error);
  }
};

// --- DELETE ---
export const deletePortfolioItem = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const item = await Sample.findByIdAndDelete(req.params.id);
    if (!item) {
      return next(new AppError("No item found with that ID.", 404));
    }

    // حذف تمام فایل‌های مرتبط با نمونه‌کار
    const deleteFile = (url: string | undefined) => {
      if (!url) return;
      const filename = url.split("/uploads/")[1];
      if (filename) {
        const filePath = path.join("uploads", filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error("خطا در حذف فایل:", err);
        });
      }
    };

    // حذف تصاویر
    if (item.images && Array.isArray(item.images)) {
      item.images.forEach((imgUrl: string) => deleteFile(imgUrl));
    }
    // حذف ویدیو
    if (item.videoUrl) {
      deleteFile(item.videoUrl);
    }
    // حذف کاور و مدیا
    if (item.cover) {
      deleteFile(item.cover);
    }
    if (item.mediaUrl) {
      deleteFile(item.mediaUrl);
    }

    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(error);
  }
};
