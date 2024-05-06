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
        const uploads = await Upload.find()

        res.setHeader('Content-Type', 'application/octet-stream')

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

export const getAllUploadFiles = async (req: Request, res: Response) => {
    try {
        const streamToBlob = (stream: fs.ReadStream): Promise<Buffer> => {
            return new Promise((resolve, reject) => {
                const chunks: Buffer[] = []
                stream.on('data', (chunk) => {
                    if (Buffer.isBuffer(chunk)) {
                        chunks.push(chunk);
                    } else {
                        reject(new TypeError("Chunk is not a Buffer"));
                    }
                })
                stream.on('end', () => resolve(Buffer.concat(chunks)))
                stream.on('error', reject)
            })
        }
        const uploads = await Upload.find()
        const files: Buffer[] = []

        for (const upload of uploads) {
            const fileId = upload.id
            const file = await Upload.findOne({
                where: {
                    id: fileId
                }
            })
            if (!file) {
                throw new Error('invalid file')
            }
            const filePath = path.join(__dirname, '../../../', '3D-Models/seeders', `${upload!.name.split("-")[1]}`)
            if (!fs.existsSync(filePath)) {
                return res.status(400).json({
                    success: false,
                    message: "File not found"
                })
            }
            const fileStream = fs.createReadStream(filePath)
            files.push(await streamToBlob(fileStream))
        }


        tryStatus(res, 'Loggin succesful!', files)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('invalid file'):
                    statusCode = 404
                    errorMessage = 'Invalid type of file!'
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT GET UPLOAD', new Error(errorMessage))
    }
}