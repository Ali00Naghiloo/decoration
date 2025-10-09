import { Router } from "express";
import {
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  getAllPortfolioItems,
  // Add this for getting a single portfolio item by ID
  // getPortfolioItemById,
} from "../controllers/portfolio.controller";
const router = Router();

import { upload } from "../middleware/upload.moddleware";

// List all portfolio items
router.get("/", getAllPortfolioItems);

// Create a new portfolio item
router.post("/", upload.single("file"), createPortfolioItem);

// Update a portfolio item
router.put("/:id", upload.single("file"), updatePortfolioItem);

// Delete a portfolio item
router.delete("/:id", deletePortfolioItem);

/**
 * Get a single portfolio item by ID
 * GET /api/samples/:id
 */
router.get("/:id", async (req, res, next) => {
  try {
    const item =
      await require("../models/PortfolioItem.model").PortfolioItem.findById(
        req.params.id
      );
    if (!item) {
      return res
        .status(404)
        .json({ status: "error", message: "Sample not found" });
    }
    res.status(200).json({ status: "success", data: { item } });
  } catch (error) {
    next(error);
  }
});

/**
 * فایل آپلود مستقل (برای آپلود فایل بدون ایجاد نمونه کار)
 * POST /api/samples/upload
 */
router.post("/upload", upload.single("file"), (req: any, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ status: "error", message: "هیچ فایلی ارسال نشد." });
  }
  res.status(201).json({
    status: "success",
    data: {
      file: {
        id: req.file.filename,
        url: `/uploads/${req.file.filename}`,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    },
  });
});

export default router;
