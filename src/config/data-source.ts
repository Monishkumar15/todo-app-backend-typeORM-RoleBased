import "reflect-metadata";
import { DataSource } from "typeorm";
import { env } from "./env";
import { User } from "../entities/User";
import { Task } from "../entities/Task";
import { TaskGroup } from "../entities/TaskGroup";
import { Role } from "../entities/Role";
import { TaskStatus } from "../entities/TaskStatus";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  entities: [User, Task, TaskGroup, TaskStatus, Role],
  synchronize: true, // disable in prod
});
