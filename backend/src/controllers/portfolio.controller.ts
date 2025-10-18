import { Request, Response, NextFunction } from "express";
import { PortfolioItem } from "../models/PortfolioItem.model";
import { AppError } from "../utils/AppError";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import fs from "fs";
import path from "path";

const window = new JSDOM("").window;
const purify = DOMPurify(window as any);

import { FILE_SERVER_BASE_URL } from "../config/db";

// Helper function to build the full URL for a file
const getFileUrl = (_req: Request, filename: string) => {
  return `${FILE_SERVER_BASE_URL}/uploads/${filename}`;
};

// --- CREATE ---
export const createPortfolioItem = async (
  req: Request & { files?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body;
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

    const newItem = await PortfolioItem.create({
      title,
      description: sanitizedDescription,
      images,
      cover,
      videoUrl,
      mediaUrl: cover, // برای سازگاری با کد قبلی
      mediaType: "image",
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
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) {
      return next(new AppError("No item found with that ID.", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        ...item.toObject(),
      },
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
    const items = await PortfolioItem.find();
    // ارسال آرایه عکس‌ها و کاور
    const itemsWithCover = items.map((item: any) => ({
      ...item.toObject(),
      cover: item.cover || (item.images && item.images[0]) || undefined,
      images: item.images || [],
    }));
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
    const item = await PortfolioItem.findById(req.params.id);
    if (!item) {
      return next(new AppError("No item found with that ID.", 404));
    }

    if (req.body.title) item.title = req.body.title;
    if (req.body.description)
      item.description = purify.sanitize(req.body.description);

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
    const item = await PortfolioItem.findByIdAndDelete(req.params.id);
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
