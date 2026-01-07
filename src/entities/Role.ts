import { Entity, Column, OneToMany, PrimaryColumn } from "typeorm";
import { User } from "./User";

@Entity("roles")
export class Role {
  @PrimaryColumn()
    roleCode!: string; // ADMIN, USER, MANAGER

  @Column()
    roleName!: string;

  @Column({ default: true })
    isActive!: boolean;

  @OneToMany(() => User, (user) => user.role)
    users!: User[];
}
