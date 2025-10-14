import express, { Express, Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import { AppError } from "./utils/AppError";
import globalErrorHandler from "./middleware/error.middleware";
import path from "path";

// --- Import your route handlers ---
import authRouter from "./routes/auth.routes";
import portfolioRouter from "./routes/portfolio.routes";
import uploadRouter from "./routes/upload.routes";

// --- Load Environment Variables ---
// This should be at the very top
dotenv.config({ path: "./.env" });

// --- Connect to Database ---
connectDB();

// --- Initialize Express App ---
const app: Express = express();

// --- Core Middleware ---
// 1. Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

// 2. Body Parser: a.k.a. allow Express to read JSON from request bodies
app.use(express.json({ limit: "10kb" }));

// --- API Routes ---
// Mount the routers on their respective paths
app.use("/api/auth", authRouter);
app.use("/api/samples", portfolioRouter);
app.use("/api/upload", uploadRouter);

// --- Handle Unhandled Routes ---
// This middleware will run for any route that hasn't been matched by the routers above
app.all("*", (req: Request, res: Response, next: NextFunction) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// --- Global Error Handling Middleware ---
// This must be the LAST middleware in the chain
app.use(globalErrorHandler);

// --- Start the Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(
    `🚀 Server is running in ${process.env.NODE_ENV} mode on port ${PORT}`
  );
});
