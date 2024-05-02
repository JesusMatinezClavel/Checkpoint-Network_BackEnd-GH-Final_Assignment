import { faker } from "@faker-js/faker"
import { Post } from "../../entities/post/Post"
import { Upload } from "../../entities/upload/Upload"



const postGenerator = async () => {

    const uploads = await Upload.find()

    let posts = []
    for (const upload of uploads) {
        const post = new Post()
        post.title = faker.lorem.word()
        post.description = faker.lorem.sentence()
        post.upload = upload
        posts.push(post)
    }
    return posts
}

export const postSeeder = async () => {
    const randomPosts = await postGenerator()
    await Post.save(randomPosts)


    console.log('---------------------');
    console.log('Random posts created!');
    console.log('---------------------');
}