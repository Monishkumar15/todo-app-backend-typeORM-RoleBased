import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../entities/User";
import { Unauthorized } from "../utils/errors";

export interface AuthRequest extends Request {
  userId?: number;
  roleCode?: string;
  user?: User;
}



export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  // ! Check Authorization header
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw Unauthorized("Authorization token missing");
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: number;
      roleCode: string;
    };
    req.userId = decoded.userId;
    req.roleCode = decoded.roleCode;
    next();
  } catch {
    throw Unauthorized("Invalid or expired token");
    // return res.status(401).json({ message: "Unauthorized" });
  }
};
 