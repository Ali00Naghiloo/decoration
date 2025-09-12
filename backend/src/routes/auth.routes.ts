import { Router } from "express";
import { register, login } from "../controllers/auth.controller";

const router = Router();

// Route to create the first admin user.
// You might want to remove or protect this route after the first use.
router.post("/register", register);

// Main login route
router.post("/login", login);

export default router;
