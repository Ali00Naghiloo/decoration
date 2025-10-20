import multer from "multer";
import path from "path";
import fs from "fs";
import { AppError } from "../utils/AppError";

// Define the destination for our uploads - use absolute path for better compatibility
const uploadDir =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "uploads")
    : path.join(__dirname, "../uploads");

// Ensure the upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Configure disk storage
const storage = multer.diskStorage({
  destination: (req: any, file: any, cb: any) => {
    cb(null, uploadDir); // Save files to the 'uploads/' directory
  },
  filename: (req: any, file: any, cb: any) => {
    // Create a unique filename to prevent overwrites: fieldname-timestamp.extension
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + extension);
  },
});

const fileFilter = (
  req: any,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  if (file.mimetype.startsWith("image") || file.mimetype.startsWith("video")) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Not an image or video! Please upload only supported files.",
        400
      ) as any
    );
  }
};

export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 50, // 50MB file size limit
    fieldSize: 1024 * 1024 * 10, // 10MB for non-file fields
    fieldNameSize: 100, // max 100 chars for field names
  },
});
