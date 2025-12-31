import { Router } from "express";
import {
  createGroup,
  getGroups,
  updateGroup,
  deleteGroup,
  getGroupById,
  addTaskToGroup,
  removeTaskFromGroup,
} from "../controllers/group.controller";
import { authMiddleware } from "../middleware/auth.middleware";
import { activeMiddleware } from "../middleware/active.middleware";

const router = Router();

router.use(authMiddleware, activeMiddleware);

router.post("/", createGroup);
router.get("/", getGroups);
router.get("/:id", getGroupById);
router.put("/:id", updateGroup);
router.delete("/:id", deleteGroup);

router.post("/:groupId/tasks/:taskId", addTaskToGroup);
router.delete("/:groupId/tasks/:taskId", removeTaskFromGroup);

export default router;
