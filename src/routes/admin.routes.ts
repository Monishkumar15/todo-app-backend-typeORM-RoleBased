import { Router } from "express";
import {
  getAllUsers,
  getUserOverview,
  updateUserStatus,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";
import { activeMiddleware } from "../middleware/active.middleware";

const router = Router();

// ADMIN ONLY
router.use(authMiddleware, activeMiddleware, roleMiddleware(["ADMIN"]));

router.get("/users/getAllUsers", getAllUsers);
router.get("/users/getUserOverview/:id", getUserOverview);
router.patch("/users/:id/status", updateUserStatus);

export default router;
