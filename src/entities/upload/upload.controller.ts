import { Request, Response } from "express";
import { catchStatus, tryStatus } from "../../utils/resStatus";
import { Upload } from "./Upload";
import fs from "fs";
import path from "path";
import { ReadStream } from 'fs';

interface FilesContainer {
    files: ReadStream[];
}

const __fileName = __filename
const __filePath = path.dirname(__fileName)


export const getAllUploads = async (req: Request, res: Response) => {
    try {
        const uploads = await Upload.find({ relations: ["liked", "uploadComments", "posts", "user"] })

        tryStatus(res, 'Uploads succesfully called!', uploads)
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

export const createUpload = async (req: Request, res: Response) => {
    try {

        const { name, description, downloadable, file } = req.body

        if (!name || !file) {
            throw new Error('required fields')
        }

        if (!Buffer.isBuffer(file)) {
            throw new Error('invalid file');
        }

        const newUpload = await Upload.create({
            name: name,
            description: description,
            downloadable: downloadable,
            // file: file
        })


        tryStatus(res, 'New upload created!', newUpload)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('required fields'):
                    statusCode = 410
                    errorMessage = 'You need a 3D model and a name for it!'
                    break;
                case error.message.includes('invalid file'):
                    statusCode = 402
                    errorMessage = 'You need valid file!'
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT CREATE UPLOAD', new Error(errorMessage))
    }
}
