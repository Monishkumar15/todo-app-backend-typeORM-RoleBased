import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { GroupService } from "../services/group.service";
import { BadRequest, NotFound } from "../utils/errors";


const groupService = new GroupService();

/**
 * CREATE GROUP
 */
export const createGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    if (!name){
      throw BadRequest("Group name is required");
    }

    const group = await groupService.createGroup(name, req.user!.id);
   
    return res.status(201).json(group);
  } catch (error: any) {
    next(error);
  }
};

/**
 * GET ALL GROUPS
 */
export const getGroups = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const groups = await groupService.getGroups(req.user!.id);
    
    return res.status(200).json(groups);
  } catch (error: any) {
    next(error);
  }
};

/**
 * GET GROUP BY ID
 */
export const getGroupById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const group = await groupService.getGroupById(
      Number(req.params.id),
      req.user!.id
    );

    if (!group)
      throw NotFound("Group not found");

    return res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

/**
 * UPDATE GROUP
 */
export const updateGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { name } = req.body;
    if (!name)
      throw BadRequest("Group name is required");

    const group = await groupService.updateGroup(
      Number(req.params.id),
      name,
      req.user!.id
    );

    if (!group)
      throw NotFound("Group not found");

    return res.status(200).json(group);
  } catch (error) {
    next(error);
  }
};

/**
 * DELETE GROUP
 */
export const deleteGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const result = await groupService.deleteGroup(
      Number(req.params.id),
      req.user!.id
    );

    if (!result) {
      throw NotFound("Group not found");
    }

    return res.status(204).send();
  } catch (err) {
    next(err);
  }
};


/**
 * ADD TASK TO GROUP
 */
export const addTaskToGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const groupId = Number(req.params.groupId);
    const taskId = Number(req.params.taskId);

    if (isNaN(groupId) || isNaN(taskId)) {
      throw BadRequest("Invalid groupId or taskId");
    }

    const task = await groupService.addTaskToGroup(
      groupId,    
      taskId,
      req.user!.id
    );

    if (!task)
      throw NotFound("Group not found");

    return res.status(200).json(task);
  } catch (error: any) {
      next(error);
  }
};

/**
 * REMOVE TASK FROM GROUP
 */
export const removeTaskFromGroup = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const groupId = Number(req.params.groupId);
    const taskId = Number(req.params.taskId);

    if (isNaN(groupId) || isNaN(taskId)) {
      throw BadRequest("Invalid groupId or taskId");
    }

    const task = await groupService.removeTaskFromGroup(
      groupId,
      taskId,
      req.user!.id
    );

    if (!task)
      throw NotFound("Group not found");

    return res.status(200).json(task);
  } catch (error: any) {
   next(error);
  }
};

export const moveTasksBetweenGroups = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fromGroupId = Number(req.params.fromGroupId);
    const toGroupId = Number(req.params.toGroupId);
    const userId = req.user!.id;

    if (isNaN(fromGroupId) || isNaN(toGroupId)) {
      throw BadRequest("Invalid group IDs");
    }

    const result = await groupService.moveTasksBetweenGroups(
      fromGroupId, toGroupId, userId
    );

    return res.status(200).json(result);

  } catch (error: any) {
    next(error);
  }
};

export const moveSingleTaskBetweenGroups = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const fromGroupId = Number(req.params.fromGroupId);
    const toGroupId = Number(req.params.toGroupId);
    const taskId = Number(req.params.taskId);
    const userId = req.user!.id;

    if (isNaN(fromGroupId) || isNaN(toGroupId) || isNaN(taskId)) {
      throw BadRequest("Invalid IDs provided");
    }

    const result = await groupService.moveSingleTaskBetweenGroups(
      fromGroupId,
      toGroupId,
      taskId,
      userId
    );

    return res.status(200).json(result);
  } catch (error: any) {
    next(error);
  }
};

export const removeAllTasksFromGroup = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const groupId = Number(req.params.groupId);
    if (isNaN(groupId)) {
      throw BadRequest("Invalid group ID");
    }

    const result = await groupService.removeAllTasksFromGroup(
      groupId,
      req.user!.id
    );

    if (!result)
      throw NotFound("Group not found");

    return res.status(200).json(result);

  } catch (error: any) {
    next(error);
  }
};
