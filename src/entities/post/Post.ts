import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { PostComment } from "../post_comment/PostComment"
import { Upload } from "../upload/Upload"

@Entity('posts')
export class Post extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    title!: string

    @Column()
    description!: string

    @Column()
    createdAt!: Date

    @Column()
    updatedAt!: Date

    @OneToMany(() => PostComment, (postComment) => postComment.post)
    postComments!: PostComment[]

    @ManyToOne(() => Upload, (upload) => upload.posts)
    @JoinColumn({ name: 'upload_id' })
    upload!: Upload
}
