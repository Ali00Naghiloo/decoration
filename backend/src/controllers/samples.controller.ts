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
    const { title, description, status, des } = req.body;
    if (!title || !description) {
      return next(new AppError("Title and description are required.", 400));
    }

    const sanitizedDescription = purify.sanitize(description);

    // ذخیره چند عکس و انتخاب کاور
    let images: string[] = [];
    let cover: string | undefined = undefined;

    if (req.files && req.files["images"]) {
      images = req.files["images"].map((file: any) =>
        getFileUrl(req, file.filename)
      );
      if (images.length > 0) {
        cover = images[0]; // اولین عکس به عنوان کاور
      }
    }

    // ویدیو (اختیاری)
    let videoUrl: string | undefined = undefined;
    if (req.files && req.files["video"] && req.files["video"][0]) {
      videoUrl = getFileUrl(req, req.files["video"][0].filename);
    }

    // تعیین نوع مدیا بر اساس وجود تصاویر و ویدیو
    const mediaTypeArr = [];
    if (images.length > 0) mediaTypeArr.push("image");
    if (videoUrl) mediaTypeArr.push("video");

    const newItem = await Sample.create({
      title,
      description: sanitizedDescription,
      images,
      cover,
      videoUrl,
      mediaUrl: cover, // برای سازگاری با کد قبلی
      mediaType: mediaTypeArr,
      status: typeof status !== "undefined" ? status : 1,
      des: des || "",
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
    const item = await Sample.findById(req.params.id);
    if (!item) {
      return next(new AppError("No item found with that ID.", 404));
    }
    const normalizedItem = {
      ...item.toObject(),
      cover: normalizeUrl(item.cover),
      images: normalizeUrls(item.images),
      videoUrl: normalizeUrl(item.videoUrl),
      mediaUrl: normalizeUrl(item.mediaUrl),
    };

    res.status(200).json({
      status: "success",
      data: normalizedItem,
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
    // اگر کوئری all=true باشد، همه نمونه‌کارها را برگردان (برای پنل)
    const filter = req.query.all === "true" ? {} : { status: 1 };
    const items = await Sample.find(filter);
    // ارسال آرایه عکس‌ها و کاور با نرمال‌سازی URL ها
    const itemsWithCover = items.map((item: any) => {
      const obj = item.toObject();
      return {
        ...obj,
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

    if (req.body.title) item.title = req.body.title;
    if (req.body.description)
      item.description = purify.sanitize(req.body.description);
    if (typeof req.body.status !== "undefined") item.status = req.body.status;
    if (typeof req.body.des !== "undefined") item.des = req.body.des;

    // به‌روزرسانی عکس‌ها
    if (req.files && req.files["images"]) {
      const images = req.files["images"].map((file: any) =>
        getFileUrl(req, file.filename)
      );
      if (images.length > 0) {
        item.images = images;
        item.cover = images[0];
        item.mediaUrl = images[0];
        item.mediaType = "image";
      }
    }

    // به‌روزرسانی ویدیو
    if (req.files && req.files["video"] && req.files["video"][0]) {
      const videoUrl = getFileUrl(req, req.files["video"][0].filename);
      item.videoUrl = videoUrl;
      item.mediaType = "video";
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

    // Delete the associated file from the server
    if (item.mediaUrl) {
      const filename = item.mediaUrl.split("/uploads/")[1];
      if (filename) {
        const filePath = path.join("uploads", filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error("Error deleting file:", err);
        });
      }
    }

    res.status(204).json({ status: "success", data: null });
  } catch (error) {
    next(error);
  }
};
