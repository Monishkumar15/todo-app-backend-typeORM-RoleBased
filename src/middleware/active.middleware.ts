import {Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";


export const activeMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // userId is set in authMiddleware
    const userId = req.userId;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId },
    });

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!user.isActive) {
      return res.status(403).json({
        message: "Your account has been deactivated. Please contact admin.",
      });
    }

    // Attach full user (optional but useful)
    req.user = user;

    next();
  } catch (error) {
    console.error("Active middleware error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
