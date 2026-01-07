import { NextFunction, Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { TaskService } from "../services/task.service";
import { BadRequest, Unauthorized } from "../utils/errors";

const taskService = new TaskService();

export const createTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, description, status, groupId } = req.body;

    if (!title) {
      throw BadRequest("Title is required");
    }
    // Critical: Make sure user is authenticated
    if (!req.userId) {
      throw Unauthorized("Authentication required - user ID missing");
    }

    const task = await taskService.createTask(
      req.userId!,
      title,
      description,
      status,
      groupId
    );

    return res.status(201).json(task);
  } catch (error: any) {
    next(error);
  }
};

export const getTasks = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const tasks = await taskService.getTasks(req.userId!);
    return res.status(200).json(tasks);
  } catch (error) {
    next(error);
  }
};

export const getTaskById = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = Number(req.params.id);

    if (isNaN(taskId)) {
      throw BadRequest("Invalid task ID");
    }

    const task = await taskService.getTaskById(taskId, req.userId!);
    return res.status(200).json(task);
  } catch (error: any) {
    console.error("Get task by ID error:", error);
    next(error);
  }
};

export const updateTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId)) {
      throw BadRequest("Invalid task id");
    }

    if (req.body.id && Number(req.body.id) !== taskId) {
      throw BadRequest("Task ID mismatch between URL and body");
    }
    // 🔥 STRIP ID FROM BODY
    delete req.body.id;

    const task = await taskService.updateTask(taskId, req.userId!, req.body);
    return res.status(200).json(task);
  } catch (error: any) {
    next(error);
  }
};

export const deleteTask = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const taskId = Number(req.params.id);
    if (isNaN(taskId) || taskId <= 0) {
      throw BadRequest("Invalid task id");
    }

    // if(!req.userId) {
    //   throw Unauthorized("Authentication required - user ID missing");
    // }
    await taskService.deleteTask(taskId, req.userId!);
    return res.status(204).send();
  } catch (error: any) {
    next(error);
  }
};
