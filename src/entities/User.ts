import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Task } from "./Task";
import { TaskGroup } from "./TaskGroup";

export type UserRole = "ADMIN" | "USER";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: "enum", enum: ["ADMIN", "USER"], default: "USER" })
  role!: UserRole;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Task, task => task.user)
  tasks!: Task[];

  @OneToMany(() => TaskGroup, group => group.user)
  taskGroups!: TaskGroup[];
}
