import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/User.model";
import { AppError } from "../utils/AppError";

// Function to sign a JWT
const signToken = (id: string): string => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "secret", {
    expiresIn: "1d",
  });
};

// --- Optional: Use this once to create your admin user ---
export const register = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    // Check if an admin user already exists
    const existingUser = await User.findOne();
    if (existingUser) {
      return next(new AppError("An admin user already exists.", 400));
    }

    const newUser = await User.create({ username, password });

    // Important: Don't send the password back, even the hashed one.
    res.status(201).json({
      status: "success",
      message: "Admin user created successfully. You can now log in.",
    });
  } catch (error) {
    next(error);
  }
};

// --- Main Login Function ---
export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username, password } = req.body;

    // 1) Check if username and password exist
    if (!username || !password) {
      return next(new AppError("Please provide a username and password.", 400));
    }

    // 2) Find the user and explicitly include the password for comparison
    const user = await User.findOne({ username }).select("+password");

    // 3) Check if user exists and if the password is correct
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError("Incorrect username or password.", 401));
    }

    // 4) If everything is okay, send token to the client
    const token = signToken(user._id as string);

    res.status(200).json({
      status: "success",
      token,
    });
  } catch (error) {
    next(error);
  }
};
