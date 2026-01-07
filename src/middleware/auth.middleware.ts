import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../entities/User";
import { Unauthorized } from "../utils/errors";

export interface AuthRequest extends Request {
  userId?: number;
  role?: "USER" | "ADMIN";
  user?: User;
}



export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: number;
      role: "USER" | "ADMIN";
    };
    req.userId = decoded.userId;
    req.role = decoded.role;
    next();
  } catch {
    throw Unauthorized("Invalid or expired token");
    // return res.status(401).json({ message: "Unauthorized" });
  }
};
 