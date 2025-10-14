import { Request, Response, NextFunction } from "express";
import { PortfolioItem } from "../models/PortfolioItem.model";
import { AppError } from "../utils/AppError";
import { JSDOM } from "jsdom";
import DOMPurify from "dompurify";
import fs from "fs";
import path from "path";

const window = new JSDOM("").window;
const purify = DOMPurify(window as any);

// Helper function to build the full URL for a file
const getFileUrl = (req: Request, filename: string) => {
  return `${req.protocol}://${req.get("host")}/uploads/${filename}`;
};

// --- CREATE ---
export const createPortfolioItem = async (
  req: Request & { file?: any },
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return next(new AppError("Title and description are required.", 400));
    }

    const sanitizedDescription = purify.sanitize(description);

    let mediaUrl;
    let mediaType;

    if (req.file) {
      mediaUrl = getFileUrl(req, req.file.filename);
      mediaType = req.file.mimetype.startsWith("image") ? "image" : "video";
    }

    const newItem = await PortfolioItem.create({
      title,
      description: sanitizedDescription,
      mediaUrl,
      mediaType,
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
    // فرض بر این که فقط یک عکس یا ویدیو دارد
    const images =
      item.mediaType === "image" && item.mediaUrl ? [item.mediaUrl] : [];
    const videoUrl =
      item.mediaType === "video" && item.mediaUrl ? item.mediaUrl : null;
    res.status(200).json({
      status: "success",
      data: {
        ...item.toObject(),
        images,
        videoUrl,
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
    // اضافه کردن فیلد cover به هر آیتم
    const itemsWithCover = items.map((item: any) => ({
      ...item.toObject(),
      cover:
        item.mediaType === "image" && item.mediaUrl ? item.mediaUrl : undefined,
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
  req: Request & { file?: any },
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

    if (req.file) {
      // 1. Delete the old file from the server if it exists
      if (item.mediaUrl) {
        const oldFilename = item.mediaUrl.split("/uploads/")[1];
        if (oldFilename) {
          const oldFilePath = path.join("uploads", oldFilename);
          fs.unlink(oldFilePath, (err) => {
            if (err) console.error("Error deleting old file:", err);
          });
        }
      }
      // 2. Set the URL for the new file
      item.mediaUrl = getFileUrl(req, req.file.filename);
      item.mediaType = req.file.mimetype.startsWith("image")
        ? "image"
        : "video";
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
