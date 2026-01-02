import { AppDataSource } from "../config/data-source";
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { TaskGroup } from "../entities/TaskGroup";

const VALID_STATUS = ["todo", "in-progress", "done"];

export class TaskService {
  private taskRepo = AppDataSource.getRepository(Task);
  private userRepo = AppDataSource.getRepository(User);
  private groupRepo = AppDataSource.getRepository(TaskGroup);

  async createTask(
    userId: number,
    title: string,
    description?: string,
    status: string = "todo",
    groupId?: number
  ) {
    if (!VALID_STATUS.includes(status)) {
      throw { status: 400, message: "Invalid status" };
    }

    const user = await this.userRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw { status: 401, message: "Unauthorized" };
    }

    let group = null;
    if (groupId) {
      group = await this.groupRepo.findOne({ where: { id: groupId } });
      if (!group) {
        throw { status: 404, message: "Group not found" };
      }
    }

    const task = this.taskRepo.create({
      title,
      description,
      status: status as "todo" | "in-progress" | "done",
      user,
      group,
    });

    const response = await this.taskRepo.save(task);
    return this.mapTask(response);
  }

  async getTasks(userId: number) {
    const tasks = await this.taskRepo.find({
      where: { user: { id: userId } },
      relations: ["group"],
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
      relations: { user: true, group: true },
    });

    if (!task) {
      throw { status: 404, message: "Task not found" };
    }

    if (task.user.id !== userId) {
      throw {
        status: 403,
        message: "Forbidden: You are not allowed to access this task",
      };
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
    const task = await this.getTaskById(taskId, userId);

    if (data.status && !VALID_STATUS.includes(data.status)) {
      throw { status: 400, message: "Invalid status" };
    }

    Object.assign(task, data);
     await this.taskRepo.save(task);

    const updated = await this.taskRepo.findOne({
      where: { id: task.id },
      relations: { group: true },
    });

    return this.mapTask(updated!);
  }

  // async deleteTask(taskId: number, userId: number) {
  //   const task = await this.getTaskById(taskId, userId);
  //   await this.taskRepo.remove(task);
  // }
  async deleteTask(taskId: number, userId: number) {
    const result = await this.taskRepo.delete({
      id: taskId,
      user: { id: userId },
    });

    if (result.affected === 0) {
      throw { status: 404, message: "Task not found" };
    }
  }
  
  private mapTask(task: Task) {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      groupId: task.group?.id ?? null,
      groupName: task.group?.name ?? null,
    };
  }
}
