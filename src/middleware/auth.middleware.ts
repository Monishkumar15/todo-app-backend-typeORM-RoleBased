import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { User } from "../entities/User";
import { Forbidden, Unauthorized } from "../utils/errors";
import { AppDataSource } from "../config/data-source";

export interface AuthRequest extends Request {
  userId?: number;
  user?: User;
  roleCode?: string;
  isActive?: boolean;

}


export const authMiddleware = async (
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
   if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: number;
    };
     const userRepo = AppDataSource.getRepository(User);

    const user = await userRepo.findOne({
      where: { id: decoded.userId },
      relations: ["role"],
    });

    if (!user) {
  throw Unauthorized("User not found");
}

if (!user.isActive || !user.role.isActive) {
  throw Forbidden("Your account has been deactivated");
}


    //  THIS is the key
    req.userId = user.id;
    req.user = user;
    req.roleCode = user.role.roleCode;
    req.isActive = user.isActive;
    next();
  } catch {
    throw Unauthorized("Invalid or expired token");
    // return res.status(401).json({ message: "Unauthorized" });
  }
};
 