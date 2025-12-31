import { AppDataSource } from "../config/data-source";
import { User, UserRoleEnum } from "../entities/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export class AuthService {
  private userRepo = AppDataSource.getRepository(User);

  async register(
    email: string,
    password: string,
    role: "USER" | "ADMIN"
  ) {
    const existingUser = await this.userRepo.findOne({ where: { email } });

    if (existingUser) {
      throw { status: 409, message: "Email already exists" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = this.userRepo.create({
      email,
      password: hashedPassword,
      role: role === "ADMIN"
          ? UserRoleEnum.ADMIN
          : UserRoleEnum.USER,
      isActive: true,
    });

    await this.userRepo.save(user);

    return {
      id: user.id,
      email: user.email,
      role: user.role,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findOne({ where: { email }, select: ["id", "email", "password", "role", "isActive"] });

    // Same error message → no info leakage
    if (!user) {
      throw { status: 401, message: "Invalid credentials" };
    }

    if (!user.isActive) {
      throw { status: 403, message: "Account is deactivated" };
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw { status: 401, message: "Invalid password credentials" };
    }

    const token = jwt.sign(
      { userId: user.id, role: user.role },
      env.JWT_SECRET,
      { expiresIn: env.JWT_EXPIRES_IN }
    );

    return {
      token,
      
    };
  }
}
