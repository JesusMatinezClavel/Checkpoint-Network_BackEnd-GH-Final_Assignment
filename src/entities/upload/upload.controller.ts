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
        const uploads = await Upload.find({ relations: ["liked", "uploadComments","posts","user"] })


        console.log(uploads);


        // res.setHeader('Content-Type', 'application/octet-stream')

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

const cubePath = 'D:/GeeksHub/Trabajos/GeeksHub_FinalAssignment_Chekpoint-Network/Checkpoint_Backend/3D-Models/Seeders/cube.fbx'

export const getUploadFile = async (req: Request, res: Response) => {
    try {
        const uploadId = Number(req.params.id)
        const upload = await Upload.findOne({ where: { id: uploadId } });
        if (!upload) {
            return res.status(404).send('Upload not found');
        }


        const absolutePath = path.resolve(cubePath)

        res.sendFile(absolutePath);
    } catch (error) {
        res.status(500).send('Error retrieving the file: ' + error);
    }
};


