import { AppDataSource } from "../config/data-source";
import { TaskGroup } from "../entities/TaskGroup";
import { Task } from "../entities/Task";
import { User } from "../entities/User";
import { NotFound, Forbidden, BadRequest, Conflict } from "../utils/errors";

export class GroupService {
  private groupRepo = AppDataSource.getRepository(TaskGroup);
  private taskRepo = AppDataSource.getRepository(Task);
  private userRepo = AppDataSource.getRepository(User);
  
  private async getGroupEntity(
    groupId: number,
    userId: number
  ): Promise<TaskGroup | null> {
    const group = await this.groupRepo.findOne({
      where: { id: groupId },
      relations: ["user", "tasks", "tasks.status"],
    });
    
    if (!group) return null;
    
    if (group.user.id !== userId) throw Forbidden("FORBIDDEN");
    
    return group;
  }
  
  private mapTask(task: Task) {
    return {
      taskId: task.id,
      taskTitle: task.title,
      taskDescription: task.description,
      taskStatus: task.status?.statusCode ?? null
    };
  }


  async createGroup(name: string, userId: number) {
    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) throw NotFound("User not found");
    
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
      relations: ["tasks", "tasks.status"],
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
  
  async getGroupById(groupId: number, userId: number) {

    const group = await this.groupRepo.findOne({
    where: { id: groupId },
    relations: ["user", "tasks", "tasks.status"], 
  });
    if (!group) return null;
    if (group.user.id !== userId) throw Forbidden("FORBIDDEN");
    
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
    // await this.groupRepo.remove(group);
    // return true;
  }

  async addTaskToGroup(groupId: number, taskId: number, userId: number) {
    // 1. Get group entity (REAL entity, not mapped DTO)
    const group = await this.getGroupEntity(groupId, userId);
    if (!group) return null;

    // 2. Get task
    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ["user", "group", "status"],
    });

    if (!task) throw NotFound("Task not found");
    if (task.user.id !== userId) throw Forbidden("FORBIDDEN");
    if (task.group && task.group.id === groupId) {
      throw Conflict("Task already added in this group");
    }

    // 3. Attach task to group
    task.group = group;
    await this.taskRepo.save(task);

    // // 4. Reload group with tasks
    // const updatedGroup = await this.groupRepo.findOne({
    //   where: { id: groupId },
    //   relations: ["tasks"],
    // });

    // // 5. Return mapped response
    // return {
    //   groupId: updatedGroup!.id,
    //   groupName: updatedGroup!.name,
    //   tasks: updatedGroup!.tasks.map((t) => this.mapTask(t)),
    // };

    return this.getGroupById(groupId, userId)
  }

  async removeTaskFromGroup(groupId: number, taskId: number, userId: number) {
    const group = await this.getGroupById(groupId, userId);
    if (!group) return null;

    const task = await this.taskRepo.findOne({
      where: { id: taskId },
      relations: ["user", "group"],
    });

    if (!task) throw NotFound("Task not found");
    if (task.user.id !== userId) throw Forbidden("FORBIDDEN");
    if (!task.group || task.group.id !== groupId)
      throw BadRequest("Task not in this group");

    task.group = null;
    await this.taskRepo.save(task);

    // // Reload updated group
    // const updatedGroup = await this.groupRepo.findOne({
    //   where: { id: groupId },
    //   relations: ["tasks"],
    // });
    // return {
    //   groupId: updatedGroup!.id,
    //   groupName: updatedGroup!.name,
    //   tasks: updatedGroup!.tasks.map((t) => this.mapTask(t)),
    // };
    return this.getGroupById(groupId, userId);
  }

  async moveTasksBetweenGroups(fromGroupId: number,toGroupId: number,userId: number) {
    if (fromGroupId === toGroupId) {
      throw BadRequest("Cannot move tasks to the same group");
    }

    const userGroups = await this.groupRepo.find({
      where: { user: { id: userId } },
    });

    if (userGroups.length < 2) {
      throw BadRequest("At least two groups are required to move tasks");
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
      throw BadRequest("Group not found");
    }

    if (fromGroup.user.id !== userId || toGroup.user.id !== userId) {
      throw Forbidden("Forbidden");
    }

    if (fromGroup.tasks.length === 0) {
      throw Conflict("No tasks to move in the source group");
    }

    //  Move tasks
    for (const task of fromGroup.tasks) {
      task.group = toGroup;
    }

    /**
     * What ACTUALLY happens 
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
  if (fromGroupId === toGroupId) throw BadRequest("Cannot move tasks within same group");

  // Ensure user has at least 2 groups
  const groupCount = await this.groupRepo.count({
    where: { user: { id: userId } },
  });
  if (groupCount < 2) throw BadRequest("At least two groups are required");

  // Fetch both groups
  const fromGroup = await this.getGroupEntity(fromGroupId, userId);
  const toGroup = await this.getGroupEntity(toGroupId, userId);

  if (!fromGroup || !toGroup) throw NotFound("Group not found");

  // Fetch task
  const task = await this.taskRepo.findOne({
    where: { id: taskId },
    relations: ["user", "group"],
  });

  if (!task) throw NotFound("Task not found");
  if (task.user.id !== userId) throw Forbidden("Forbidden");

  if (!task.group || task.group.id !== fromGroupId)
    throw BadRequest("Task not in this group");
  
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
  // 1️ Fetch group with tasks
  const group = await this.groupRepo.findOne({
    where: { id: groupId },
    relations: ["user", "tasks"],
  });

  if (!group) return null;
  if (group.user.id !== userId) throw Forbidden("FORBIDDEN");

  // 2️ Check tasks exist
  if (group.tasks.length === 0) {
    throw BadRequest("No tasks in group");
  }

  // 3️ Remove group reference from all tasks
  for (const task of group.tasks) {
    task.group = null;
  }

  // 4️ Save all tasks
  await this.taskRepo.save(group.tasks);

  // 5️ Return clean response
  return {
    groupId: group.id,
    groupName: group.name,
    tasks: [],
  };
}

}
