import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, ManyToMany, JoinTable } from "typeorm"
import { Role } from "../role/Role"
import { Upload } from "../upload/Upload"
import { UploadComment } from "../upload_comment/UploadComment"

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
    role!: Role

    @OneToMany(() => Upload, (upload) => upload.user)
    uploads!: Upload[]

    @OneToMany(() => UploadComment, (uploadComment) => uploadComment.author)
    uploadComments!: UploadComment[]

    @ManyToMany(() => User, (user) => user.following)
    @JoinTable({
        name: 'followers',
        joinColumn: {
            name: 'followerId',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'followingId',
            referencedColumnName: 'id'
        }
    })
    followers!: User[]

    @ManyToMany(() => User, (user) => user.followers)
    following!: User[]
}
