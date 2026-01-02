import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { AuthRequest } from "../middleware/auth.middleware";
import { USER_ROLES, UserRole } from "../utils/roles";

const authService = new AuthService();
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, role = "USER" } = req.body;


    const normalizedRole = role.toUpperCase() as UserRole;

    
    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }
    
    if (!EMAIL_REGEX.test(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }
    
    if (password.length < MIN_PASSWORD_LENGTH) {
      return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
    }
    
    // now we validate the role against USER_ROLES
    console.log(role);
    console.log(normalizedRole);
    
    // ✅ ROLE VALIDATION (CORRECT)
    if (!USER_ROLES.includes(normalizedRole)) {
      return res.status(400).json({
        message: `Invalid role. Allowed: ${USER_ROLES.join(", ")}`,
      });
    }

    const user = await authService.register(email, password, normalizedRole);
    return res.status(201).json(user);
  } catch (error: any) {
    console.error("Register error:", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    const data = await authService.login(email, password);
    return res.status(200).json(data);
  } catch (error: any) {
    console.error("Login error:", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};
