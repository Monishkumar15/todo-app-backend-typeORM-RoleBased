import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany } from "typeorm";
import { User } from "./User";
import { Task } from "./Task";

@Entity()
export class TaskGroup {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @ManyToOne(() => User, user => user.taskgroups)
  user!: User;

  @OneToMany(() => Task, task => task.group)
  tasks!: Task[];
}
