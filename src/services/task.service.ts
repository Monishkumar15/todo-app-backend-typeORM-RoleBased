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

    return await this.taskRepo.save(task);
  }

  async getTasks(userId: number) {
    return await this.taskRepo.find({
      where: { user: { id: userId } },
      relations: ["group"],
    });
  }

  async getTaskById(taskId: number, userId: number) {
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ["user", "group"],
    });

    if (!task) {
      throw { status: 404, message: "Task not found" };
    }

    if (task.user.id !== userId) {
      throw { status: 403, message: "Forbidden" };
    }

    return task;
  }

  async updateTask(
    taskId: number,
    userId: number,
    data: Partial<Task>
  ) {
    const task = await this.getTaskById(taskId, userId);

    if (data.status && !VALID_STATUS.includes(data.status)) {
      throw { status: 400, message: "Invalid status" };
    }

    Object.assign(task, data);
    return await this.taskRepo.save(task);
  }

  async deleteTask(taskId: number, userId: number) {
    const task = await this.getTaskById(taskId, userId);
    await this.taskRepo.remove(task);
  }
}
