import { Request, Response } from "express";
import { catchStatus, tryStatus } from "../../utils/resStatus";


const getOwnProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.tokenData.userId

        // tryStatus(res, 'Register succesful!', logged)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('required fields'):
                    statusCode = 400
                    errorMessage = 'email and password are necessary! '
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}