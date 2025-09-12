import { Schema, model, Document } from "mongoose";
import bcrypt from "bcryptjs";

// Define an interface for the User document for strong typing
export interface IUser extends Document {
  username: string;
  password?: string; // Optional because it will be deselected in queries
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "Username is required"],
    unique: true,
    trim: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 8,
    select: false, // Prevents the password from being returned in queries by default
  },
});

// Middleware to hash the password before saving the user
userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Method to compare the provided password with the stored hash
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return await bcrypt.compare(candidatePassword, this.password || "");
};

export const User = model<IUser>("User", userSchema);
