import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";
import { Forbidden, Unauthorized } from "../utils/errors";

export const roleMiddleware =
  (allowedRoles: string) =>
  (req: AuthRequest, res: Response, next: NextFunction) => {
   if (!req.user || !req.user.role) {
      throw Unauthorized("Unauthorized");
    }

    const roleCode = req.user.role.roleCode;

    if (!allowedRoles.includes(roleCode)) {
      throw Forbidden("Access denied");
    }
    next();
  };
