import { AppDataSource } from "../config/data-source";
import { User} from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";
import { Conflict, Forbidden, BadRequest, Unauthorized } from "../utils/errors";
import { Role } from "../entities/Role";

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);
  private roleRepo = AppDataSource.getRepository(Role);

  async register(
    email: string,
    password: string,
    roleCode  : string
  ) {
    const existingUser = await this.userRepo.findOne({ where: { email } });
    //  debugger;
    if (existingUser) {
      throw Conflict("Email already exists");
    }
    const role = await this.roleRepo.findOne({
      where: { roleCode, isActive: true },
    });

    if (!role) {
      throw BadRequest("Invalid or inactive role");
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      role,
      isActive: true,
    });

    await this.userRepo.save(user);
    
    return {
      id: user.id,
      email: user.email,
      role: role.roleCode,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({
      where: { email },
      relations: ["role"],
      select: {id: true, email: true, password: true, isActive: true, role: { roleCode: true }  },
    });

    // Same message → avoid info leakage
    if (!user) {
      throw Unauthorized("Invalid credentials");
    }

    if (!user.isActive) {
      throw Forbidden("Account is deactivated");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw Unauthorized("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role.roleCode },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return { token };
  }
}
