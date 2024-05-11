import { Request, Response } from "express";
import { catchStatus, tryStatus } from "../../utils/resStatus";
import { User } from "../user/User";
import { Upload } from "../upload/Upload";
import { Post } from "./Post";


export const getAllPosts = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        if (!user) {
            throw new Error('user doesnt exists')
        }

        const posts = await Post.find()

        tryStatus(res, 'Post created', posts)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 404
                    errorMessage = "User doesn't exists"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}
export const getMyPosts = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId
        const user = await User.findOne({
            where: {
                id: userId
            },
            relations: ['uploads.posts']
        })
        if (!user) {
            throw new Error('user doesnt exists')
        }
        const posts: Array<object> = []
        user.uploads.forEach(element => {
            posts.push(element.posts)
        });

        tryStatus(res, 'My posts called', posts)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 404
                    errorMessage = "User doesn't exists"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}
export const createNewPost = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId
        const uploadId = Number(req.params.id)
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        if (!user) {
            throw new Error('user doesnt exists')
        }
        const upload = await Upload.findOne({
            where: {
                id: uploadId
            }
        })
        if (!upload) {
            throw new Error('upload doesnt exists')
        }
        const { title, description } = req.body

        if (!title || !description) {
            throw new Error('invalid inputs')
        }

        const post = await Post.create({
            title: title,
            description: description,
            upload: upload
        }).save()


        tryStatus(res, 'Post created', post)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 404
                    errorMessage = "User doesn't exists"
                    break;
                case error.message.includes('upload doesnt exists'):
                    statusCode = 404
                    errorMessage = "Upload doesn't exists"
                    break;
                case error.message.includes('invalid inputs'):
                    statusCode = 404
                    errorMessage = "Invalid title or description"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}
export const updatePost = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId
        const postId = Number(req.params.id)
        const user = await User.findOne({
            where: {
                id: userId
            },
            relations: ['uploads.posts']
        })
        if (!user) {
            throw new Error('user doesnt exists')
        }
        const post = await Post.findOne({
            where: {
                id: postId
            }
        })
        if (!post) {
            throw new Error('upload doesnt exists')
        }
        user.uploads.map(upload => {
            if (upload.posts.some(upost => upost.id === postId)) {
                throw new Error('post not yours')
            }
        })

        const { title, description } = req.body

        if (!title || !description) {
            throw new Error('invalid inputs')
        }

        await Post.update(
            {
                id: postId
            },
            {
                title: title,
                description: description
            }
        )

        const updatedPost = await Post.findOne({
            where: {
                id: postId
            }
        })

        tryStatus(res, 'Post updated', updatedPost)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 404
                    errorMessage = "User doesn't exists"
                    break;
                case error.message.includes('upload doesnt exists'):
                    statusCode = 404
                    errorMessage = "Upload doesn't exists"
                    break;
                case error.message.includes('invalid inputs'):
                    statusCode = 404
                    errorMessage = "Invalid title or description"
                    break;
                case error.message.includes('post not yours'):
                    statusCode = 404
                    errorMessage = "Post doesn't belong to you!"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}
export const deletePost = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId
        const postId = Number(req.params.id)
        const user = await User.findOne({
            where: {
                id: userId
            },
            relations: ['uploads.posts']
        })
        if (!user) {
            throw new Error('user doesnt exists')
        }
        const post = await Post.findOne({
            where: {
                id: postId
            }
        })
        if (!post) {
            throw new Error('upload doesnt exists')
        }
        user.uploads.map(upload => {
            if (upload.posts.some(upost => upost.id === postId)) {
                throw new Error('post not yours')
            }
        })

        await Post.delete(postId)

        tryStatus(res, 'Post deleted', null)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 404
                    errorMessage = "User doesn't exists"
                    break;
                case error.message.includes('upload doesnt exists'):
                    statusCode = 404
                    errorMessage = "Upload doesn't exists"
                    break;
                case error.message.includes('post not yors'):
                    statusCode = 404
                    errorMessage = "Post doesn't belong to you"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}
