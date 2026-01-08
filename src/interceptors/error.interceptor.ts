import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";

export const errorInterceptor = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error("Error:", err.message);
/**
  if (err.message === "FORBIDDEN") {
    return res.status(403).json({
      success: false,
      message: "Forbidden",
    });
  }

  if (err.message === "TASK_NOT_FOUND") {
    return res.status(404).json({
      success: false,
      message: "Task not found",
    });
  }

  if (err.message === "GROUP_NOT_FOUND") {
    return res.status(404).json({
      success: false,
      message: "Group not found",
    });
  }

  if (err.message === "TASK_ALREADY_IN_GROUP") {
    return res.status(409).json({
      success: false,
      message: "Task already added to this group",
    });
  }
  
   */
   // Known app errors
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
};
