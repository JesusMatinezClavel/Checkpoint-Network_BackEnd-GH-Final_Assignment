import { Request, Response } from "express";
import { catchStatus, tryStatus } from "../../utils/resStatus";
import { User } from "../user/User";
import { Upload } from "../upload/Upload";
import { UploadComment } from "./UploadComment";


export const getAllUploadComments = async (req: Request, res: Response) => {
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

        const { message, uploadId } = req.body.message

        if (!message || !uploadId) {
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

        await UploadComment.create({
            message: message,
            upload: upload,
            author: user
        }).save()



        tryStatus(res, 'User deleted', null)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 409
                    errorMessage = "User doesn't exists"
                    break;
                case error.message.includes('no message'):
                    statusCode = 409
                    errorMessage = "No message inputed"
                    break;
                case error.message.includes('upload doesnt exists'):
                    statusCode = 409
                    errorMessage = "Upload doesn't exists"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}