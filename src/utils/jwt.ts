import jwt from "jsonwebtoken";
import { env } from "../config/env";

export const generateToken = (payload: { userId: number; role: string }) =>
  jwt.sign(payload, env.JWT_SECRET, { expiresIn: env.JWT_EXPIRES_IN });

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.JWT_SECRET) as { userId: number };
};
