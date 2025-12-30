import { Router } from "express";
import {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup,
  addTaskToGroup,
  removeTaskFromGroup,
} from "../controllers/group.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { activeMiddleware } from "../middleware/active.middleware";

const router = Router();

router.use(authMiddleware, activeMiddleware);

router.post("/", createGroup);
router.get("/", getGroups);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);

router.post("/:id/tasks/:taskId", addTaskToGroup);
router.delete("/:id/tasks/:taskId", removeTaskFromGroup);

export default router;
