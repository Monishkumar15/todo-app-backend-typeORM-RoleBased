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
  try {
    const result = await groupService.deleteGroup(
      Number(req.params.id),
      req.user!.id
    );

    if (!result) {
      return res.status(404).json({ message: "Group not found" });
    }

    return res.status(204).send();
  } catch (err: any) {
    if (err.message === "FORBIDDEN") {
      return res.status(403).json({ message: "Forbidden" });
    }

    return res.status(500).json({ message: "Server error" });
  }
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

   if (error.message === "TASK_ALREADY_IN_GROUP")
      return res.status(409).json({ message: "Task already added to this group" });


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
   if (error.message === "TASK_NOT_FOUND")
      return res.status(404).json({ message: "Task not found" });
   if (error.message === "TASK_NOT_IN_GROUP")
      return res.status(400).json({ message: "Task not in this group" });

   if (error.message === "FORBIDDEN")
      return res.status(403).json({ message: "Forbidden" });

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const moveTasksBetweenGroups = async (req: AuthRequest, res: Response) => {
  try {
    const fromGroupId = Number(req.params.fromGroupId);
    const toGroupId = Number(req.params.toGroupId);
    const userId = req.user!.id;

    const result = await groupService.moveTasksBetweenGroups(
      fromGroupId, toGroupId, userId
    );

    return res.status(200).json(result);

  } catch (error: any) {

    if (error.message === "MIN_TWO_GROUPS_REQUIRED")
      return res.status(400).json({ message: "At least two groups are required" });

    if (error.message === "SAME_GROUP")
      return res.status(400).json({ message: "Cannot move tasks within same group" });

    if (error.message === "GROUP_NOT_FOUND")
      return res.status(404).json({ message: "Group not found" });

    if (error.message === "NO_TASKS_TO_MOVE")
      return res.status(409).json({ message: "No tasks available to move" });

    if (error.message === "FORBIDDEN")
      return res.status(403).json({ message: "Forbidden" });

    console.error("Move tasks error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const moveSingleTaskBetweenGroups = async (req: AuthRequest, res: Response) => {
  try {
    const fromGroupId = Number(req.params.fromGroupId);
    const toGroupId = Number(req.params.toGroupId);
    const taskId = Number(req.params.taskId);
    const userId = req.user!.id;

    const result = await groupService.moveSingleTaskBetweenGroups(
      fromGroupId,
      toGroupId,
      taskId,
      userId
    );

    return res.status(200).json(result);
  } catch (error: any) {
    if (error.message === "GROUP_NOT_FOUND")
      return res.status(404).json({ message: "Group not found" });

    if (error.message === "TASK_NOT_FOUND")
      return res.status(404).json({ message: "Task not found" });

    if (error.message === "TASK_NOT_IN_GROUP")
      return res.status(400).json({ message: "Task not in source group" });

    if (error.message === "SAME_GROUP")
      return res.status(400).json({
        message: "Cannot move tasks within same group",
      });

    if (error.message === "ONLY_ONE_GROUP")
      return res.status(400).json({
        message: "At least two groups are required",
      });

    if (error.message === "FORBIDDEN")
      return res.status(403).json({ message: "Forbidden" });

    return res.status(500).json({ message: "Internal server error" });
  }
};

export const removeAllTasksFromGroup = async (req: AuthRequest, res: Response) => {
  try {
    const result = await groupService.removeAllTasksFromGroup(
      Number(req.params.groupId),
      req.user!.id
    );

    if (!result)
      return res.status(404).json({ message: "Group not found" });

    return res.status(200).json(result);

  } catch (error: any) {
    if (error.message === "FORBIDDEN")
      return res.status(403).json({ message: "Forbidden" });

    if (error.message === "NO_TASKS_IN_GROUP")
      return res.status(400).json({ message: "No tasks in this group" });

    return res.status(500).json({ message: "Internal server error" });
  }
};

