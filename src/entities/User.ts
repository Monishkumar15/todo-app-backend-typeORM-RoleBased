import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm";
import { Task } from "./Task";
import { TaskGroup } from "./TaskGroup";

// export type UserRole = "ADMIN" | "USER";
export enum UserRoleEnum {
  USER = "USER",
  ADMIN = "ADMIN",
}


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  // Password NEVER comes unless explicitly selected
  @Column({ select: false })
  password!: string;

  @Column({
  type: "enum",
  enum: UserRoleEnum,
  default: UserRoleEnum.USER,
})
  role!: UserRoleEnum;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Task, task => task.user)
  tasks!: Task[];

  @OneToMany(() => TaskGroup, group => group.user)
  taskGroups!: TaskGroup[];
}


