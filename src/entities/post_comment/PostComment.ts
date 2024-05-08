import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from "typeorm"
import { User } from "../user/User"
import { Post } from "../post/Post"

@Entity('post_comments')
export class PostComment extends BaseEntity {
    @PrimaryGeneratedColumn()
    id!: number

    @Column()
    message!: string

    @Column()
    createdAt!: Date

    @Column()
    updatedAt!: Date

    @ManyToOne(() => Post, (post) => post.postComments)
    @JoinColumn({ name: 'post_id' })
    post!: Post

    @ManyToOne(() => User, (user) => user.postComments)
    @JoinColumn({ name: 'author_id' })
    author!: User
}
