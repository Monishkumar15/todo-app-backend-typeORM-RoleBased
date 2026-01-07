import { AppDataSource } from "../config/data-source";
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { TaskGroup } from "../entities/TaskGroup";
import { TaskStatus } from "../entities/TaskStatus";
import { BadRequest, Forbidden, NotFound, Unauthorized } from "../utils/errors";
import { Not } from "typeorm";


export class TaskService {
  private taskRepo = AppDataSource.getRepository(Task);
  private userRepo = AppDataSource.getRepository(User);
  private groupRepo = AppDataSource.getRepository(TaskGroup);
  private statusRepo = AppDataSource.getRepository(TaskStatus);


  async createTask(
    userId: number,
    title: string,
    description?: string,
    statusCode: string = "TODO",
    groupId?: number
  ) {

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw Unauthorized("Unauthorized");
    }

    const status = await this.statusRepo.findOne({
    where: { statusCode, isActive: true },
  });

  if (!status) {
    throw BadRequest("Invalid or inactive task status");
  }

    // let group: TaskGroup | null = null;
    let group = null;
    if (groupId) {
      group = await this.groupRepo.findOne({ where: { id: groupId } });
      if (!group) {
        throw NotFound("Group not found");
      }
    }

    const task = this.taskRepo.create({
      title,
      description,
      status,
      user,
      group,
    });

    const response = await this.taskRepo.save(task);
    return this.mapTask(response);
  }

  async getTasks(userId: number) {
    const tasks = await this.taskRepo.find({
      where: { user: { id: userId } },
      relations: ["group", "status"],
      order: {
        id: "ASC", // task order
      },
    });

    return tasks.map((task) => this.mapTask(task));
  }

  async getTaskById(taskId: number, userId: number) {
    const task = await this.taskRepo.findOne({
      where: {
        id: taskId,
      },
      relations: { user: true, group: true , status: true},
    });

    if (!task) {
      throw NotFound("Task not found");
    }

    if (task.user.id !== userId) {
      throw Forbidden("Forbidden: You are not allowed to access this task");
    }

    /** return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    group: task.group && {
      id: task.group.id,
      name: task.group.name,
    },
  }; */
    /** return {
    id: task.id,
    title: task.title,
    description: task.description,
    status: task.status,
    groupId: task.group?.id ?? null,
    groupName: task.group?.name ?? null,
  }; */
    return this.mapTask(task);
    // ! Relations are optional → always use ?.
    // ! API responses should be explicit → use ?? null
  }

  async updateTask(taskId: number, userId: number, data: Partial<Task>) {
  const task = await this.taskRepo.findOne({
    where: { id: taskId },
    relations: { user: true, group: true, status: true },
  });

  if (!task) {
    throw NotFound("Task not found");
  }

  if (task.user.id !== userId) {
    throw Forbidden("Forbidden: You are not allowed to access this task");
  }

  if (data.status) {
    const statusCode =
      typeof data.status === "string"
        ? data.status
        : data.status.statusCode;

    const status = await this.statusRepo.findOne({
      where: { statusCode, isActive: true },
    });

    if (!status) {
      throw BadRequest("Invalid or inactive task status");
    }

    task.status = status;
  }

  Object.assign(task, data);
  await this.taskRepo.save(task);

  const updated = await this.taskRepo.findOne({
    where: { id: task.id },
    relations: { group: true, status: true },
  });

  return this.mapTask(updated!);
}


  // async deleteTask(taskId: number, userId: number) {
  //   const task = await this.getTaskById(taskId, userId);
  //   await this.taskRepo.remove(task);
  // }
  async deleteTask(taskId: number, userId: number) {
    const result = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: { user: true },});

    if(!result){
      throw NotFound("Task not found");
    }

    if(result.user.id !== userId){
      throw Forbidden("Forbidden: You are not allowed to delete this task");
    }
    await this.taskRepo.remove(result);
  }
  
  private mapTask(task: Task) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      statusCode: task.status?.statusCode ?? null,
      statusName: task.status?.statusName ?? null,
      groupId: task.group?.id ?? null,
      groupName: task.group?.name ?? null,
    };
  }
}
