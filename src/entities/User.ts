import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, JoinColumn } from "typeorm";
import { Task } from "./Task";
import { TaskGroup } from "./TaskGroup";
import { Role } from "./Role";


@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  email!: string;

  // Password NEVER comes unless explicitly selected
  @Column({ select: false })
  password!: string;

  @ManyToOne(() => Role)
  @JoinColumn({ name: "roleCode", referencedColumnName: "roleCode" })
  role!: Role;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Task, task => task.user)
  tasks!: Task[];

  @OneToMany(() => TaskGroup, group => group.user)
  taskGroups!: TaskGroup[];
}


