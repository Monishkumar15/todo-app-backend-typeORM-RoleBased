import { Response } from "express";
import { AuthRequest } from "../middleware/auth.middleware";
import { TaskService } from "../services/task.service";


const taskService = new TaskService();

export const createTask = async (req: AuthRequest, res: Response) => {
  try {
    const { title, description, status, groupId } = req.body;

    if (!title) {
      return res.status(400).json({ message: "Title is required" });
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
    return res
      .status(error.status || 500)
      .json({ message: error.message });
  }
};

export const getTasks = async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await taskService.getTasks(req.userId!  );
    return res.status(200).json(tasks);
  } catch {
    return res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

export const getTaskById = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = Number(req.params.id);

    if (isNaN(taskId)) {
      return res.status(400).json({ message: "Invalid task id" });
    }

    const task = await taskService.getTaskById(taskId, req.userId!);
    return res.status(200).json(task);
  } catch (error: any) {
    console.error("Get task by ID error:", error);
    return res
      .status(error.status || 500)
      .json({ message: error.message });
  }
};

export const updateTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = Number(req.params.id);
    const task = await taskService.updateTask(
      taskId,
      req.userId!,
      req.body
    ); 
    return res.status(200).json(task);
  } catch (error: any) {
    return res
      .status(error.status || 500)
      .json({ message: error.message });
  }
};

export const deleteTask = async (req: AuthRequest, res: Response) => {
  try {
    const taskId = Number(req.params.id);
    await taskService.deleteTask(taskId, req.userId!);
    return res.status(204).send();
  } catch (error: any) {
    return res
      .status(error.status || 500)
      .json({ message: error.message });
  }
};
