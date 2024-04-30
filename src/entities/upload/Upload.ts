import { BaseEntity, Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany, OneToOne, ManyToMany, JoinTable } from "typeorm"
import { UploadComment } from "../upload_comment/UploadComment"
import { User } from "../user/User"
import { Post } from "../post/Post"

@Entity('uploads')
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

    @ManyToMany(() => User, (user) => user.likes)
    @JoinTable({
        name: 'post_likes',
        joinColumn: {
            name: 'post_id',
            referencedColumnName: 'id'
        },
        inverseJoinColumn: {
            name: 'user_id',
            referencedColumnName: 'id'
        }
    })
    liked!: User[]

    @OneToMany(() => UploadComment, (uploadComment) => uploadComment.upload)
    uploadComments!: UploadComment[]

    @OneToMany(() => Post, (post) => post.upload)
    posts!: Post[]

    @ManyToOne(() => User, (user) => user.uploads)
    @JoinColumn({ name: 'author' })
    user!: User
}
