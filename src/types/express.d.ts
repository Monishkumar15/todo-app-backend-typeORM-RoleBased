import "express";
import { User } from "../entities/User";

declare module "express" {
  interface Request {
    user?: User;
    userId?: number;
    role?: "USER" | "ADMIN";
    isActive?: boolean;
  }
}

export {};
