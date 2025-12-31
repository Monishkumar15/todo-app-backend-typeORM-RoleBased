import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { GroupService } from "../services/group.service";

const groupService = new GroupService();

/**
 * CREATE GROUP
 */
export const createGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Group name required" });

    const group = await groupService.createGroup(name, req.user!.id);
    return res.status(201).json(group);
  } catch {
    return res.status(500).json({ message: "Failed to create group" });
  }
};

/**
 * GET ALL GROUPS
 */
export const getGroups = async (req: AuthRequest, res: Response) => {
  const groups = await groupService.getGroups(req.user!.id);
  return res.status(200).json(groups);
};

/**
 * GET GROUP BY ID
 */
export const getGroupById = async (req: AuthRequest, res: Response) => {
  try {
    const group = await groupService.getGroupById(
      Number(req.params.id),
      req.user!.id
    );

    if (!group)
      return res.status(404).json({ message: "Group not found" });

    return res.status(200).json(group);
  } catch {
    return res.status(403).json({ message: "Forbidden" });
  }
};

/**
 * UPDATE GROUP
 */
export const updateGroup = async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;
    if (!name)
      return res.status(400).json({ message: "Group name required" });

    const group = await groupService.updateGroup(
      Number(req.params.id),
      name,
      req.user!.id
    );

    if (!group)
      return res.status(404).json({ message: "Group not found" });

    return res.status(200).json(group);
  } catch {
    return res.status(403).json({ message: "Forbidden" });
  }
};

/**
 * DELETE GROUP
 */
export const deleteGroup = async (req: AuthRequest, res: Response) => {
  const result = await groupService.deleteGroup(
    Number(req.params.id),
    req.user!.id
  );

  if (!result)
    return res.status(404).json({ message: "Group not found" });

  return res.status(204).send();
};

/**
 * ADD TASK TO GROUP
 */
export const addTaskToGroup = async (req: AuthRequest, res: Response) => {
  try {
    const task = await groupService.addTaskToGroup(
      Number(req.params.groupId),
      Number(req.params.taskId),
      req.user!.id
    );

    if (!task)
      return res.status(404).json({ message: "Group not found" });

    return res.status(200).json(task);
  } catch (error: any) {
    if (error.message === "TASK_NOT_FOUND")
      return res.status(404).json({ message: "Task not found" });

   if (error.message === "FORBIDDEN")
      return res.status(403).json({ message: "Forbidden" });

    return res.status(500).json({ message: "Internal server error" });
  }
};

/**
 * REMOVE TASK FROM GROUP
 */
export const removeTaskFromGroup = async (
  req: AuthRequest,
  res: Response
) => {
  try {
    const task = await groupService.removeTaskFromGroup(
      Number(req.params.groupId),
      Number(req.params.taskId),
      req.user!.id
    );

    if (!task)
      return res.status(404).json({ message: "Group not found" });

    return res.status(200).json(task);
  } catch (error: any) {
    return res.status(403).json({ message: "Forbidden" });
  }
};
