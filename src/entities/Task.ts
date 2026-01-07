import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from "typeorm";
import { User } from "./User";
import { TaskGroup } from "./TaskGroup";
import { TaskStatus } from "./TaskStatus";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @ManyToOne(() => TaskStatus)
  @JoinColumn({ name: "statusCode", referencedColumnName: "statusCode" })
  status!: TaskStatus;

  @ManyToOne(() => User, user => user.tasks)
  user!: User;

  @ManyToOne(() => TaskGroup, group => group.tasks, { nullable: true, onDelete: 'SET NULL' })
  group!: TaskGroup | null;
}
