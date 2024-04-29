import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, OneToMany } from "typeorm"
import { User } from "../user/User"

@Entity('roles')
export class Role extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    createdAt!: Date

    @Column()
    updatedAt!: Date

    @OneToMany(() => User, (user) => user.role)
    users!: User[]

}
