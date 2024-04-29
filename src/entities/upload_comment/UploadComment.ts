import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { Upload } from "../upload/Upload"
import { User } from "../user/User"

@Entity()
export class UploadComment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    message!: Text

    @Column()
    createdAt!: Date

    @Column()
    updatedAt!: Date

    @ManyToOne(() => Upload, (upload) => upload.uploadComments)
    @JoinColumn({ name: 'upload_id' })
    upload!: Upload

    @ManyToOne(() => User, (user) => user.uploadComments)
    @JoinColumn({ name: 'author_id' })
    author!: User
}
