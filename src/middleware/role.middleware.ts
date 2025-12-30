import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export const roleMiddleware =
  (role: "ADMIN" | "USER") =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
    if (req.role !== role) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
