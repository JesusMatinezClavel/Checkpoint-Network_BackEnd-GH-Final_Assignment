import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { Role } from "../role/Role"
import { Upload } from "../upload/Upload"

@Entity('users')
export class User extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    avatar!: string

    @Column()
    bio!: Text

    @Column()
    email!: Text

    @Column()
    password!: Text

    @Column()
    birthdate!: Text

    @Column()
    isActive!: boolean

    @Column()
    createdAt!: Date

    @Column()
    updatedAt!: Date

    @ManyToOne(() => Role, (role) => role.users)
    @JoinColumn({ name: 'role_id' })
    role!: Role[]

    @OneToMany(() => Upload, (upload) => upload.user)
    users!: User[]
}
