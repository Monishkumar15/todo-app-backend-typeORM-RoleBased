import { AppError } from "./AppError";

export const NotFound = (message: string) =>
  new AppError(message, 404);

export const Forbidden = (message = "Forbidden") =>
  new AppError(message, 403);

export const BadRequest = (message: string) =>
  new AppError(message, 400);

export const Conflict = (message: string) =>
  new AppError(message, 409);

export const InternalServerError = (message = "Internal server error") =>
  new AppError(message, 500);