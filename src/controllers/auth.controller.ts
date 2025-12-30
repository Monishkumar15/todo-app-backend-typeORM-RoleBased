import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";

const authService = new AuthService();

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, role = "user" } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "Password too short" });
    }

    const user = await authService.register(email, password, role);
    return res.status(201).json(user);

  } catch (error: any) {
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
    return res
      .status(error.status || 500)
      .json({ message: error.message || "Server error" });
  }
};
