import { Request, Response } from "express";
import { AdminService } from "../services/admin.service";

const adminService = new AdminService();

/**
 * GET ALL USERS
 */
export const getAllUsers = async (_req: Request, res: Response) => {
  const users = await adminService.getAllUsers();
  return res.status(200).json(users);
};

/**
 * GET USER OVERVIEW (VIEW ONLY)
 */
export const getUserOverview = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);

  const user = await adminService.getUserOverview(userId);
  if (!user)
    return res.status(404).json({ message: "User not found" });

  return res.status(200).json(user);
};

/**
 * ACTIVATE / DEACTIVATE USER
 */
export const updateUserStatus = async (req: Request, res: Response) => {
  const userId = Number(req.params.id);
  const { isActive } = req.body;

  if (typeof isActive !== "boolean")
    return res.status(400).json({ message: "isActive must be boolean" });

  const user = await adminService.updateUserStatus(userId, isActive);
  if (!user)
    return res.status(404).json({ message: "User not found" });

  return res.status(200).json({
    message: `User ${isActive ? "activated" : "deactivated"} successfully`,
  });
};
