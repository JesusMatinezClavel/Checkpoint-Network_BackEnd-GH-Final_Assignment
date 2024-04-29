import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { UploadComment } from "../upload_comment/UploadComment"
import { User } from "../user/User"

@Entity()
export class Upload extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    name!: string

    @Column()
    path!: string

    @Column()
    description!: Text

    @Column()
    downloadable!: boolean

    @Column()
    createdAt!: Date

    @Column()
    updatedAt!: Date

    @OneToMany(() => UploadComment, (uploadComment) => uploadComment.upload)
    uploadComments!: UploadComment[]

    @ManyToOne(() => User, (user) => user.uploads)
    @JoinColumn({ name: 'author' })
    user!: User
}
