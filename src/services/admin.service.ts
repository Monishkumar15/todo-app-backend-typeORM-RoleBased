import { AppDataSource } from "../config/data-source";
import { User } from "../entities/User";
import { Forbidden } from "../utils/errors";

export class AdminService {
  private userRepo = AppDataSource.getRepository(User);

// GET ALL USERS (Basic Info)
  async getAllUsers() {
    return this.userRepo.find({
      select: ["id", "email", "role", "isActive",],
      relations: { role: true },
    });
  }

  // GET USER FULL OVERVIEW (Groups + Tasks)
  async getUserOverview(userId: number) {
    return this.userRepo.findOne({
      where: { id: userId },
      relations: {
      taskGroups: {
        tasks: true,
      },
      tasks: true,
      role: true,
    },
    });
  }
  
  // ACTIVATE / DEACTIVATE USER
  async updateUserStatus(userId: number, isActive: boolean, adminId?: number) {
    if (userId === adminId) {
    throw Forbidden("Admin cannot deactivate own account");
  }

    const user = await this.userRepo.findOneBy({ id: userId });
    if (!user) return null;

    user.isActive = isActive;
    return this.userRepo.save(user);
  }
}
