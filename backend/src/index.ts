import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import { AppError } from "./utils/AppError";
import globalErrorHandler from "./middleware/error.middleware";
import path from "path";

// --- Import your route handlers ---
import authRouter from "./routes/auth.routes";
import samplesRouter from "./routes/samples.routes";
import uploadRouter from "./routes/upload.routes";

// --- Load Environment Variables ---
// This should be at the very top
dotenv.config({ path: ["./.env", "./.env.local"] });

// --- Connect to Database ---
connectDB();

// --- Initialize Express App ---
const app: Express = express();

// --- Core Middleware ---
// 1. Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());
// Serve static files from public directory (for favicon, etc.)
app.use(express.static(path.join(__dirname, "../public")));

// Serve static files from uploads directory
const uploadsPath =
  process.env.NODE_ENV === "production"
    ? path.join(process.cwd(), "uploads")
    : path.join(__dirname, "../uploads");
app.use(
  "/api/uploads",
  express.static(uploadsPath, {
    setHeaders: (res, path) => {
      if (path.endsWith(".jpg") || path.endsWith(".jpeg")) {
        res.setHeader("Content-Type", "image/jpeg");
      } else if (path.endsWith(".png")) {
        res.setHeader("Content-Type", "image/png");
      } else if (path.endsWith(".gif")) {
        res.setHeader("Content-Type", "image/gif");
      } else if (path.endsWith(".webp")) {
        res.setHeader("Content-Type", "image/webp");
      } else if (path.endsWith(".mp4")) {
        res.setHeader("Content-Type", "video/mp4");
      }
      // Remove Content-Disposition header to prevent download
      res.removeHeader("Content-Disposition");
    },
  })
);

// 2. Body Parser: a.k.a. allow Express to read JSON from request bodies
app.use(express.json({ limit: "50mb" }));

// --- API Routes ---
// Mount the routers on their respective paths
app.use("/api/auth", authRouter);
app.use("/api/samples", samplesRouter);
app.use("/api/upload", uploadRouter);

// --- Global Error Handling Middleware ---
// This must be the LAST middleware in the chain
app.use(globalErrorHandler);

// --- Handle Unhandled Routes ---
// This middleware will run for any route that hasn't been matched by the routers above
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
