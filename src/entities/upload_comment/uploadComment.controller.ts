import { Request, Response } from "express";
import { catchStatus, tryStatus } from "../../utils/resStatus";
import { User } from "../user/User";
import { Upload } from "../upload/Upload";
import { UploadComment } from "./UploadComment";
import { RemoveUserOptions } from "typeorm";


export const getAllUpladComments = async (req: Request, res: Response) => {
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

        const uploadComments = await UploadComment.find()

        tryStatus(res, 'Upload comments succesfully called', uploadComments)
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
export const getMyComments = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId
        const user = await User.findOne({
            where: {
                id: userId
            },
            relations: ['uploadComments']
        })
        if (!user) {
            throw new Error('user doesnt exists')
        }

        tryStatus(res, 'Upload comments succesfully called', user.uploadComments)
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
export const createUploadComment = async (req: Request, res: Response) => {
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

        const { message } = req.body

        console.log(message);


        if (!message) {
            throw new Error('no message')
        }

        const upload = await Upload.findOne({
            where: {
                id: uploadId
            }
        })

        if (!upload) {
            throw new Error('upload doesnt exists')
        }

        const newComment = await UploadComment.create({
            message: `${user.name}: ${message}`,
            upload: upload,
            author: user
        }).save()


        const uploadComments = await Upload.findOne({
            where: {
                id: uploadId
            },
            relations:['uploadComments']
        })   

        tryStatus(res, 'Upload comment created', uploadComments)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 404
                    errorMessage = "User doesn't exists"
                    break;
                case error.message.includes('no message'):
                    statusCode = 409
                    errorMessage = "No message inputed"
                    break;
                case error.message.includes('upload doesnt exists'):
                    statusCode = 404
                    errorMessage = "Upload doesn't exists"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}
export const updateUploadComment = async (req: Request, res: Response) => {
    try {

        const userId = req.tokenData.userId
        const commentId = Number(req.params.id)

        if (!commentId) {
            throw new Error('invalid comment')
        }

        const comment = await UploadComment.findOne({
            where: {
                id: commentId
            }
        })


        if (!comment) {
            throw new Error('comment doesnt exists')
        }

        const user = await User.findOne({
            where: {
                id: userId
            },
            relations: ['uploadComments']
        })

        if (!user) {
            throw new Error('user doesnt exists')
        } else if (!user.uploadComments.some(commentItem => commentItem.id === comment.id)) {
            throw new Error('comment not yours')
        }

        const { message } = req.body

        if (!message) {
            throw new Error('no message')
        }

        const updatedUploadComment = await UploadComment.update(
            {
                id: commentId
            },
            {
                message: message
            }
        )

        const newcomment = await UploadComment.findOne({
            where: {
                id: commentId
            }
        })

        tryStatus(res, 'Upload comment updated', newcomment)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('invalid comment'):
                    statusCode = 404
                    errorMessage = "Comment id is not valid"
                    break;
                case error.message.includes('user doesnt exists'):
                    statusCode = 404
                    errorMessage = "User doesn't exists"
                    break;
                case error.message.includes('comment doesnt exists'):
                    statusCode = 404
                    errorMessage = "Comment doesn't exists"
                    break;
                case error.message.includes('comment not yours'):
                    statusCode = 404
                    errorMessage = "This comment doesn't belong to you"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}
export const deleteUploadComment = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId
        const commentId = Number(req.params.id)

        if (!commentId) {
            throw new Error('invalid comment')
        }
        const comment = await UploadComment.findOne({
            where: {
                id: commentId
            }
        })
        if (!comment) {
            throw new Error('comment doesnt exists')
        }
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        if (!user) {
            throw new Error('user doesnt exists')
        } else if (!user.uploadComments.some(commentItem => commentItem.id === comment.id)) {
            throw new Error('comment not yours')
        }

        await UploadComment.delete(commentId)

        tryStatus(res, 'Upload comment deleted', null)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('invalid comment'):
                    statusCode = 404
                    errorMessage = "Comment id is not valid"
                    break;
                case error.message.includes('user doesnt exists'):
                    statusCode = 404
                    errorMessage = "User doesn't exists"
                    break;
                case error.message.includes('comment doesnt exists'):
                    statusCode = 404
                    errorMessage = "Upload comment doesn't exists"
                    break;
                case error.message.includes('comment not yours'):
                    statusCode = 404
                    errorMessage = "This comment doesn't belong to you"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}