import "express";
import { User } from "../entities/User";

declare module "express" {
  interface Request {
    user?: User;
    userId?: number;
    roleCode?: string;
    isActive?: boolean;
  }
}

export {};
