import { Request, Response, NextFunction } from "express";
import { Sample } from "../models/Sample.model";
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

// --- CREATE ---
export const createPortfolioItem = async (
  req: Request & { files?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, status, des, lang } = req.body;

    // Helper: parse a possible JSON-stringified object or plain string into a translated-field object
    const parseMaybeTranslated = (val: any, fallbackLang: string) => {
      if (!val) return { fa: "", en: "" };
      if (typeof val === "object") {
        return { fa: val.fa || "", en: val.en || "" };
      }
      if (typeof val === "string") {
        const trimmed = val.trim();
        // try parse JSON
        if (trimmed.startsWith("{")) {
          try {
            const p = JSON.parse(trimmed);
            return { fa: p.fa || "", en: p.en || "" };
          } catch {
            // not JSON — treat as single-language string
          }
        }
        return fallbackLang === "en"
          ? { fa: "", en: trimmed }
          : { fa: trimmed, en: "" };
      }
      return { fa: "", en: "" };
    };

    if (!title || !description) {
      return next(new AppError("Title and description are required.", 400));
    }

    const normalizedLang = lang === "en" ? "en" : "fa";

    // Parse fields (supports both legacy single-string and new translated-object payloads)
    const titleObj = parseMaybeTranslated(title, normalizedLang);
    const desObj = parseMaybeTranslated(des, normalizedLang);
    const descParsed = parseMaybeTranslated(description, normalizedLang);

    // Sanitize and wrap description per language
    const prepareDescriptionObj = (descObj: any) => {
      const out: any = { fa: "", en: "" };
      (["fa", "en"] as const).forEach((l) => {
        const raw = descObj[l] || "";
        if (raw && raw.trim()) {
          const sanitizedInner = purify.sanitize(raw, {
            ADD_ATTR: ["style", "class", "lang", "dir"],
          } as any);
          out[l] = `<div lang="${l}" dir="${
            l === "fa" ? "rtl" : "ltr"
          }" class="sample-content">${sanitizedInner}</div>`;
        } else {
          out[l] = "";
        }
      });
      return out;
    };

    const descriptionObj = prepareDescriptionObj(descParsed);

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

    // Support legacy schema where title/description/des were plain strings
    const titleObj =
      typeof obj.title === "string"
        ? { fa: obj.title, en: "" }
        : { fa: obj.title?.fa || "", en: obj.title?.en || "" };
    const descObj =
      typeof obj.description === "string"
        ? { fa: obj.description, en: "" }
        : { fa: obj.description?.fa || "", en: obj.description?.en || "" };
    const desObj =
      typeof obj.des === "string"
        ? { fa: obj.des, en: "" }
        : { fa: obj.des?.fa || "", en: obj.des?.en || "" };

    // Response picks the requested locale for simple compatibility with frontend
    const simple = {
      ...obj,
      title: titleObj[locale] || titleObj.fa || titleObj.en,
      description: descObj[locale] || descObj.fa || descObj.en || "",
      des: desObj[locale] || desObj.fa || desObj.en || "",
      cover,
      images,
      videoUrl,
      mediaUrl,
      // include full translations for clients that can consume them
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

      const titleObj =
        typeof obj.title === "string"
          ? { fa: obj.title, en: "" }
          : { fa: obj.title?.fa || "", en: obj.title?.en || "" };
      const descObj =
        typeof obj.description === "string"
          ? { fa: obj.description, en: "" }
          : { fa: obj.description?.fa || "", en: obj.description?.en || "" };
      const desObj =
        typeof obj.des === "string"
          ? { fa: obj.des, en: "" }
          : { fa: obj.des?.fa || "", en: obj.des?.en || "" };

      return {
        ...obj,
        title: titleObj[locale] || titleObj.fa || titleObj.en,
        description: descObj[locale] || descObj.fa || descObj.en || "",
        des: desObj[locale] || desObj.fa || desObj.en || "",
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
      if (!val) return { fa: "", en: "" };
      if (typeof val === "object") {
        return { fa: val.fa || "", en: val.en || "" };
      }
      if (typeof val === "string") {
        const trimmed = val.trim();
        if (trimmed.startsWith("{")) {
          try {
            const p = JSON.parse(trimmed);
            return { fa: p.fa || "", en: p.en || "" };
          } catch {
            // not JSON
          }
        }
        return fallbackLang === "en"
          ? { fa: "", en: trimmed }
          : { fa: trimmed, en: "" };
      }
      return { fa: "", en: "" };
    };

    // Update title
    if (typeof req.body.title !== "undefined") {
      const titleObj = parseMaybeTranslated(
        req.body.title,
        (req.body.lang as string) || item.lang || "fa"
      );
      item.title = {
        fa: titleObj.fa || item.title?.fa || "",
        en: titleObj.en || item.title?.en || "",
      } as any;
    }

    // Update description (sanitize and wrap per language)
    if (typeof req.body.description !== "undefined") {
      const descParsed = parseMaybeTranslated(
        req.body.description,
        (req.body.lang as string) || item.lang || "fa"
      );
      const prepareDescriptionObj = (descObj: any) => {
        const out: any = { fa: "", en: "" };
        (["fa", "en"] as const).forEach((l) => {
          const raw = descObj[l] || "";
          if (raw && raw.trim()) {
            const inner = purify.sanitize(raw, {
              ADD_ATTR: ["style", "class", "lang", "dir"],
            } as any);
            out[l] = `<div lang="${l}" dir="${
              l === "fa" ? "rtl" : "ltr"
            }" class="sample-content">${inner}</div>`;
          } else {
            out[l] = "";
          }
        });
        return out;
      };
      const descToSave = prepareDescriptionObj(descParsed);
      item.description = {
        fa: descToSave.fa || item.description?.fa || "",
        en: descToSave.en || item.description?.en || "",
      } as any;
    }

    if (typeof req.body.status !== "undefined") item.status = req.body.status;

    // des (summary) may be translated
    if (typeof req.body.des !== "undefined") {
      const desObj = parseMaybeTranslated(
        req.body.des,
        (req.body.lang as string) || item.lang || "fa"
      );
      item.des = {
        fa: desObj.fa || item.des?.fa || "",
        en: desObj.en || item.des?.en || "",
      } as any;
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
