import { Router } from "express";
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask,
} from "../controllers/task.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { activeMiddleware } from "../middleware/active.middleware";

const router = Router();

// Protect all task routes
router.use(authMiddleware, activeMiddleware);

router.post("/createTask", createTask);
router.get("/getTasks", getTasks);
router.get("/getTaskById/:id", getTaskById);
router.put("/updateTask/:id", updateTask);
router.delete("/deleteTask/:id", deleteTask);

export default router;
