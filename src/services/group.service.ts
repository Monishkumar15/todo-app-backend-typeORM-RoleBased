import { AppDataSource } from "../config/data-source";
import { TaskGroup } from "../entities/TaskGroup";
import { Task } from "../entities/Task";
import { User } from "../entities/User";

export class GroupService {
  private groupRepo = AppDataSource.getRepository(TaskGroup);
  private taskRepo = AppDataSource.getRepository(Task);
  private userRepo = AppDataSource.getRepository(User);

  async createGroup(name: string, userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw new Error("USER_NOT_FOUND");

    const group = this.groupRepo.create({ name, user });
    return this.groupRepo.save(group);
  }

  async getGroups(userId: number) {
    return this.groupRepo.find({
      where: { user: { id: userId } },
      relations: ["tasks"],
    });
  }

  async getGroupById(groupId: number, userId: number) {
    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ["user", "tasks"],
    });

    if (!group) return null;
    if (group.user.id !== userId) throw new Error("FORBIDDEN");

    return group;
  }

  async updateGroup(groupId: number, name: string, userId: number) {
    const group = await this.getGroupById(groupId, userId);
    if (!group) return null;

    group.name = name;
    return this.groupRepo.save(group);
  }

  async deleteGroup(groupId: number, userId: number) {
    const group = await this.getGroupById(groupId, userId);
    if (!group) return null;

    return this.groupRepo.remove(group);
  }

  async addTaskToGroup(groupId: number, taskId: number, userId: number) {
    const group = await this.getGroupById(groupId, userId);
    if (!group) return null;

    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ["user"],
    });

    if (!task) throw new Error("TASK_NOT_FOUND");
    if (task.user.id !== userId) throw new Error("FORBIDDEN");

    task.group = group;
    return this.taskRepo.save(task);
  }

  async removeTaskFromGroup(groupId: number, taskId: number, userId: number) {
    const group = await this.getGroupById(groupId, userId);
    if (!group) return null;

    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ["user", "group"],
    });

    if (!task) throw new Error("TASK_NOT_FOUND");
    if (task.user.id !== userId) throw new Error("FORBIDDEN");
    if (!task.group || task.group.id !== groupId)
      throw new Error("TASK_NOT_IN_GROUP");

    task.group = null;
    return this.taskRepo.save(task);
  }
}
