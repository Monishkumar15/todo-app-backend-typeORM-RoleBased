import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { User } from "./User";
import { TaskGroup } from "./TaskGroup";

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ nullable: true })
  description!: string;

  @Column({
    type: "enum",
    enum: ["todo", "in-progress", "done"],
    default: "todo",
  })
  status!: "todo" | "in-progress" | "done";

  @ManyToOne(() => User, user => user.tasks)
  user!: User;

  @ManyToOne(() => TaskGroup, group => group.tasks, { nullable: true, onDelete: 'SET NULL' })
  group!: TaskGroup | null;
}
