import { Router } from "express";
import {
  getAllUsers,
  getUserOverview,
  updateUserStatus,
} from "../controllers/admin.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { roleMiddleware } from "../middleware/role.middleware";

const router = Router();

// ADMIN ONLY
router.use(authMiddleware, roleMiddleware("ADMIN"));

router.get("/users", getAllUsers);
router.get("/users/:id", getUserOverview);
router.patch("/users/:id/status", updateUserStatus);

export default router;
