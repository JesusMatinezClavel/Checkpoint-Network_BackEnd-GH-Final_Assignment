

import { faker } from "@faker-js/faker";

// Models
import { User } from "../../entities/user/User";
import { Post } from "../../entities/post/Post";
import { PostComment } from "../../entities/post_comment/PostComment";


const postCommentGenerator = async () => {

    const users = await User.find()
    const posts = await Post.find()

    let comments = []
    for (const post of posts) {
        const commentsQ = faker.number.int({ min: 0, max: 5 })
        for (let id = 0; id < commentsQ; id++) {
            const randomPostComment = new PostComment()
            randomPostComment.post = post
            const author = randomPostComment.author = users[faker.number.int({ min: 0, max: 19 })]
            randomPostComment.message = `${author.name}: ${faker.lorem.sentence()}`
            randomPostComment.createdAt = new Date()
            randomPostComment.updatedAt = new Date()
            comments.push(randomPostComment)
        }
    }
    return comments
}

export const seedControlPostComments = async () => {

    const randomPostComments = await postCommentGenerator()
    await PostComment.save(randomPostComments)


    console.log('------------------------------');
    console.log('Control post-comments created!');
    console.log('------------------------------');

}