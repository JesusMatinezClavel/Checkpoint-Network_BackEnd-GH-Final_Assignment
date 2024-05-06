import { Request, Response } from "express";
import { catchStatus, tryStatus } from "../../utils/resStatus";
import { Upload } from "./Upload";


export const getAllUploads = async (req: Request, res: Response) => {
    try {
        const uploads = await Upload.find()

        tryStatus(res, 'Loggin succesful!', uploads)
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
