import { Request, Response } from "express";
import { catchStatus, tryStatus } from "../../utils/resStatus";

// Models
import { User } from "./User";


export const getProfile = async (req: Request, res: Response) => {
    try {
        const userId = Number(req.params.id)

        const user = await User.findOne({
            where: {
                id: userId
            }
        })

        if (!user) {
            throw new Error('user doesnt exists')
        }

        const { password, ...restUser } = user

        tryStatus(res, `${user.name}'s profile called succesfully`, restUser!)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 409
                    errorMessage = "User doesn't exists"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}

export const getOwnProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId

        const user = await User.findOne({
            where: {
                id: userId
            },
            relations: ["role", "uploads", "uploadComments.upload", "postComments.post","followers","following","likes",]
        })

        if (!user) {
            throw new Error('user doesnt exists')
        }

        tryStatus(res, 'Own profile called succesfully', user!)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 409
                    errorMessage = "User doesn't exists"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}