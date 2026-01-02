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
    const savedGroup = await this.groupRepo.save(group);
    return {
      groupId: savedGroup.id,
      groupName: savedGroup.name,
    };
  }

  async getGroups(userId: number) {
    const groups = await this.groupRepo.find({
      where: { user: { id: userId } },
      relations: ["tasks"],
      order: {
        id: "ASC", // group order
        tasks: {
          id: "ASC", // task order inside group
        },
      },
    });

    return groups.map((group) => ({
      groupId: group.id,
      groupName: group.name,
      tasks: group.tasks.map((task) => this.mapTask(task)),
    }));
  }
  private async getGroupEntity(
    groupId: number,
    userId: number
  ): Promise<TaskGroup | null> {
    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ["user", "tasks"],
    });

    if (!group) return null;

    if (group.user.id !== userId) throw new Error("FORBIDDEN");

    return group;
  }

  async getGroupById(groupId: number, userId: number) {
    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ["user", "tasks"],
    });

    if (!group) return null;
    if (group.user.id !== userId) throw new Error("FORBIDDEN");

    return {
      groupId: group.id,
      groupName: group.name,
      tasks: group.tasks.map((task) => this.mapTask(task)),
    };
  }

  async updateGroup(groupId: number, name: string, userId: number) {
    const group = await this.getGroupEntity(groupId, userId);
    if (!group) return null;

    group.name = name;
    const updatedGroup = await this.groupRepo.save(group);
    return {
      groupId: updatedGroup.id,
      groupName: updatedGroup.name,
    };
  }

  async deleteGroup(groupId: number, userId: number) {
    const group = await this.getGroupEntity(groupId, userId);
    if (!group) return null;

    // // Remove group from tasks
    // await this.taskRepo.update(
    //   { group: { id: groupId } },
    //   { group: null }
    // );

    return this.groupRepo.remove(group);
  }

  async addTaskToGroup(groupId: number, taskId: number, userId: number) {
    // 1. Get group entity (REAL entity, not mapped DTO)
    const group = await this.getGroupEntity(groupId, userId);
    if (!group) return null;

    // 2. Get task
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ["user", "group"],
    });

    if (!task) throw new Error("TASK_NOT_FOUND");
    if (task.user.id !== userId) throw new Error("FORBIDDEN");

    // ✅ IMPORTANT CHECK
    if (task.group && task.group.id === groupId) {
      throw new Error("TASK_ALREADY_IN_GROUP");
    }

    // 3. Attach task to group
    task.group = group;
    await this.taskRepo.save(task);

    // 4. Reload group with tasks
    const updatedGroup = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ["tasks"],
    });

    // 5. Return mapped response
    return {
      groupId: updatedGroup!.id,
      groupName: updatedGroup!.name,
      tasks: updatedGroup!.tasks.map((t) => this.mapTask(t)),
    };
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
    await this.taskRepo.save(task);

    // Reload updated group
    const updatedGroup = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ["tasks"],
    });
    return {
      groupId: updatedGroup!.id,
      groupName: updatedGroup!.name,
      tasks: updatedGroup!.tasks.map((t) => this.mapTask(t)),
    };
  }

  async moveTasksBetweenGroups(fromGroupId: number,toGroupId: number,userId: number) {
    if (fromGroupId === toGroupId) {
      throw new Error("SAME_GROUP");
    }

    const userGroups = await this.groupRepo.find({
      where: { user: { id: userId } },
    });

    if (userGroups.length < 2) {
      throw new Error("MIN_TWO_GROUPS_REQUIRED");
    }

    const fromGroup = await this.groupRepo.findOne({
      where: { id: fromGroupId },
      relations: ["tasks", "user"],
    });

    const toGroup = await this.groupRepo.findOne({
      where: { id: toGroupId },
      relations: ["tasks", "user"],
    });

    if (!fromGroup || !toGroup) {
      throw new Error("GROUP_NOT_FOUND");
    }

    if (fromGroup.user.id !== userId || toGroup.user.id !== userId) {
      throw new Error("FORBIDDEN");
    }

    if (fromGroup.tasks.length === 0) {
      throw new Error("NO_TASKS_TO_MOVE");
    }

    // 🔁 Move tasks
    for (const task of fromGroup.tasks) {
      // console.log(`Moving Task ID ${task.id} to Group ID ${toGroupId}`);
      // console.log(`Before Move: Task Group ID: ${task.group ? task.group.id : 'null'}`);
      // console.log(`From Group ID: ${fromGroupId}, To Group ID: ${toGroupId}`);
      // console.log(`task.group ${task.group}  --- toGroup ${toGroup}`);
      
      // console.log('---');
      
      task.group = toGroup;
      // console.log(`task.group ${task.group}  --- toGroup ${toGroup}`);
      // console.log('------------------------------------------------');
    }

    /**
     * What ACTUALLY happens 🧠
    TypeORM sees this:
    task.group → points to Group(id=10)
    So internally it translates to:
    
    UPDATE task
    SET group_id = 10
    WHERE id = 3;
     */

    await this.taskRepo.save(fromGroup.tasks);

    // Reload updated groups
    const updatedFromGroup = await this.groupRepo.findOne({
      where: { id: fromGroupId },
      relations: ["tasks"],
    });

    const updatedToGroup = await this.groupRepo.findOne({
      where: { id: toGroupId },
      relations: ["tasks"],
    });

    return {
      fromGroup: {
        groupId: updatedFromGroup!.id,
        groupName: updatedFromGroup!.name,
        tasks: updatedFromGroup!.tasks.map((t) => this.mapTask(t)),
      },
      toGroup: {
        groupId: updatedToGroup!.id,
        groupName: updatedToGroup!.name,
        tasks: updatedToGroup!.tasks.map((t) => this.mapTask(t)),
      },
    };
  }

  async moveSingleTaskBetweenGroups(fromGroupId: number, toGroupId: number, taskId: number, userId: number) {
  if (fromGroupId === toGroupId) throw new Error("SAME_GROUP");

  // Ensure user has at least 2 groups
  const groupCount = await this.groupRepo.count({
    where: { user: { id: userId } },
  });
  if (groupCount < 2) throw new Error("ONLY_ONE_GROUP");

  // Fetch both groups
  const fromGroup = await this.getGroupEntity(fromGroupId, userId);
  const toGroup = await this.getGroupEntity(toGroupId, userId);

  if (!fromGroup || !toGroup) throw new Error("GROUP_NOT_FOUND");

  // Fetch task
  const task = await this.taskRepo.findOne({
    where: { id: taskId },
    relations: ["user", "group"],
  });

  if (!task) throw new Error("TASK_NOT_FOUND");
  if (task.user.id !== userId) throw new Error("FORBIDDEN");

  if (!task.group || task.group.id !== fromGroupId)
    throw new Error("TASK_NOT_IN_GROUP");

  // Move task
  task.group = toGroup;
  await this.taskRepo.save(task);

  // Return updated destination group
  const updatedGroup = await this.groupRepo.findOne({
    where: { id: toGroupId },
    relations: ["tasks"],
  });

  return {
    groupId: updatedGroup!.id,
    groupName: updatedGroup!.name,
    tasks: updatedGroup!.tasks.map((t) => this.mapTask(t)),
  };
}

async removeAllTasksFromGroup(groupId: number, userId: number) {
  // 1️⃣ Fetch group with tasks
  const group = await this.groupRepo.findOne({
    where: { id: groupId },
    relations: ["user", "tasks"],
  });

  if (!group) return null;
  if (group.user.id !== userId) throw new Error("FORBIDDEN");

  // 2️⃣ Check tasks exist
  if (group.tasks.length === 0) {
    throw new Error("NO_TASKS_IN_GROUP");
  }

  // 3️⃣ Remove group reference from all tasks
  for (const task of group.tasks) {
    task.group = null;
  }

  // 4️⃣ Save all tasks
  await this.taskRepo.save(group.tasks);

  // 5️⃣ Return clean response
  return {
    groupId: group.id,
    groupName: group.name,
    tasks: [],
  };
}


  private mapTask(task: Task) {
    return {
      taskId: task.id,
      taskTitle: task.title,
      taskDescription: task.description,
      taskStatus: task.status,
    };
  }
}
