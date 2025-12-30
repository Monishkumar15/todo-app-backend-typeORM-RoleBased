import { Router } from "express";
import {
  register,
  login,
} from "../controllers/auth.controller";

const router = Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register user or admin
 * @access  Public
 */
router.post("/register", register);

/**
 * @route   POST /api/auth/login
 * @desc    Login user/admin and return JWT
 * @access  Public
 */
router.post("/login", login);

export default router;
