import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { USER_ROLES, UserRole } from "../utils/roles";
import { BadRequest } from "../utils/errors";

const authService = new AuthService();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const register = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email, password, role = "USER" } = req.body;

    const normalizedRole = role.toUpperCase() as UserRole;

    //  Validate the email and password
    if (!email || !password) {
      throw BadRequest("All fields are required");
    }

    if (!EMAIL_REGEX.test(email)) {
      throw BadRequest("Invalid email format");
    }

    if (password.length < MIN_PASSWORD_LENGTH) {
      throw BadRequest("Password must be at least 6 characters");
    }

    if (!USER_ROLES.includes(normalizedRole)) {
      throw BadRequest(
        `Invalid role. Allowed: ${USER_ROLES.join(", ")}`
      );
    }

    const user = await authService.register(
      email,
      password,
      normalizedRole
    );

    return res.status(201).json({
      user,
    });
  } catch (error) {
    // ✅ Pass error to global interceptor
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      throw BadRequest("Email and password required");
    }

    const data = await authService.login(email, password);

    return res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};
