import { Router } from "express";
import {
  createPortfolioItem,
  updatePortfolioItem,
  deletePortfolioItem,
  getAllPortfolioItems,
  // Add this for getting a single portfolio item by ID
  // getPortfolioItemById,
} from "../controllers/samples.controller";
const router = Router();

import { upload } from "../middleware/upload.moddleware";

// List all portfolio items
router.get("/", getAllPortfolioItems);

// Create a new portfolio item
router.post(
  "/",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  createPortfolioItem
);

// Update a portfolio item
router.put(
  "/:id",
  upload.fields([
    { name: "images", maxCount: 10 },
    { name: "video", maxCount: 1 },
  ]),
  updatePortfolioItem
);

// Delete a portfolio item
router.delete("/:id", deletePortfolioItem);

/**
 * Get a single portfolio item by ID
 * GET /api/samples/:id
 */
import { getPortfolioItemById } from "../controllers/samples.controller";
router.get("/:id", getPortfolioItemById);

/**
 * فایل آپلود مستقل (برای آپلود فایل بدون ایجاد نمونه کار)
 * POST /api/samples/upload
 */
/* حذف شد: آپلود فایل مستقل به روت عمومی منتقل شد */

/**
 * تغییر status نمونه کار با دکمه (در جدول)
 * PATCH /api/samples/:id/status
 */
import { Sample } from "../models/Sample.model";
router.patch("/:id/status", async (req, res, next) => {
  try {
    const { status } = req.body;
    const item = await Sample.findById(req.params.id);
    if (!item) return res.status(404).json({ error: "Not found" });
    item.status = status;
    await item.save();
    res.json({ status: "success", data: item });
  } catch (err) {
    next(err);
  }
});
export default router;
