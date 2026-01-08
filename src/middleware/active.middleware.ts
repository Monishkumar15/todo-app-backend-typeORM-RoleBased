import {Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Forbidden, Unauthorized } from "../utils/errors";


export const activeMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // userId is set in authMiddleware
    const userId = req.userId;

    if (!userId) {
      throw Unauthorized("Authentication required - user ID missing");
    }

    const userRepo = AppDataSource.getRepository(User);
    const user = await userRepo.findOne({
      where: { id: userId },
      relations: ["role"],
    });

    if (!user) {
      throw Unauthorized("Unauthorized: User not found");
    }

    if (!user.isActive) {
      throw Forbidden("Your account has been deactivated. Please contact admin.");
    }

    // Attach full user (optional but useful)
    req.userId = user.id;
    req.user = user;
    req.roleCode = user.role.roleCode;
    req.isActive = user.isActive;

    next();
  } catch (error) {
    console.error("Active middleware error:", error);
    next(error);
  }
};
