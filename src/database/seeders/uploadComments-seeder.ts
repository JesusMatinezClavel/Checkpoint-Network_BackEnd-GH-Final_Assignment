import { faker } from "@faker-js/faker";

// Models
import { User } from "../../entities/user/User";
import { Upload } from "../../entities/upload/Upload";
import { UploadComment } from "../../entities/upload_comment/UploadComment";


const uploadCommentGenerator = async () => {

    const users = await User.find()
    const uploads = await Upload.find()

    let comments = []
    for (const upload of uploads) {
        const commentsQ = faker.number.int({ min: 0, max: 5 })
        for (let id = 0; id < commentsQ; id++) {
            const randomUploadComment = new UploadComment()
            randomUploadComment.upload = upload
            const author = randomUploadComment.author = users[faker.number.int({ min: 1, max: 20 })]
            randomUploadComment.message = `${author.name}: ${faker.lorem.sentence()}`
            comments.push(randomUploadComment)
        }
    }
    return comments
}

export const seedControlUploadComments = async () => {

    const randomUploadComments = await uploadCommentGenerator()
    await UploadComment.save(randomUploadComments)


    console.log('--------------------------------');
    console.log('Control upload-comments created!');
    console.log('--------------------------------');

}