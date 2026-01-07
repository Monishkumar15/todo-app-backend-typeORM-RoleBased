import {
  Entity,
  Column,
  OneToMany,
  PrimaryColumn,
} from "typeorm";
import { Task } from "./Task";

@Entity("task_status")
export class TaskStatus {
  @PrimaryColumn()
  statusCode!: string; // TODO, IN_PROGRESS, DONE

  @Column()
  statusName!: string;

  @Column({ default: true })
  isActive!: boolean;

  @OneToMany(() => Task, (task) => task.status)
  tasks!: Task[];
}
