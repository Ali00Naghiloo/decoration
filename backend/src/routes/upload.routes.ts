import { Router } from "express";
import { upload } from "../middleware/upload.moddleware";

function handleUploadResponse(req: any, res: any) {
  if (!req.file) {
    return res.status(400).json({
      success: false,
      message: "No file uploaded",
    });
  }

  res.status(200).json({
    success: true,
    data: {
      file: {
        id: req.file.filename,
        // استفاده از دامنه کانفیگ‌شده برای URL فایل
        url: `${
          process.env.FILE_BASE_URL || "https://api.rokhnegar.art/api"
        }/uploads/${req.file.filename}`,
        originalName: req.file.originalname,
        mimetype: req.file.mimetype,
        size: req.file.size,
      },
    },
  });
}

const router = Router();

/**
 * فایل آپلود عمومی (برای آپلود هر نوع فایل)
 * POST /api/upload
 */
router.post("/", (req: any, res, next) => {
  // پشتیبانی از هر دو فیلد file و image
  const uploadHandler = upload.single("file");
  uploadHandler(req, res, function (err: any) {
    if (err && err.code === "LIMIT_UNEXPECTED_FILE") {
      // اگر فیلد file نبود، image را امتحان کن
      const uploadImageHandler = upload.single("image");
      uploadImageHandler(req, res, function (err2: any) {
        if (err2) return next(err2);
        handleUploadResponse(req, res);
      });
    } else if (err) {
      return next(err);
    } else {
      handleUploadResponse(req, res);
    }
  });
});

export default router;
