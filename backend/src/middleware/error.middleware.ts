import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

// A simple type for our error response structure
interface ErrorResponse {
  status: "fail" | "error";
  message: string;
  stack?: string;
}

const globalErrorHandler = (
  err: AppError | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Default to 500 Internal Server Error if status code is not set
  const statusCode = err instanceof AppError ? err.statusCode : 500;
  const status = err instanceof AppError ? err.status : "error";

  const response: ErrorResponse = {
    status,
    message: err.message || "Something went very wrong!",
  };

  // Only include the stack trace in development mode for debugging
  if (process.env.NODE_ENV === "development") {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

export default globalErrorHandler;
