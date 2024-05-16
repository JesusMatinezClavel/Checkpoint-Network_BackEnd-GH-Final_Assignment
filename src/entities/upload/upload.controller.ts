import { Request, Response } from "express";
import { catchStatus, tryStatus } from "../../utils/resStatus";
import { Upload } from "./Upload";
import { User } from "../user/User";
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
        const limit = 6
        const page = Number(req.query.page) || 1
        const skip = (page - 1) * limit
        const lengPosts = await Upload.find()

        if (page <= 0 || !Number.isInteger(page)) {
            throw new Error('page invalid')
        }
        if (skip >= lengPosts.length) {
            throw new Error('no more uploads')
        }

        const uploads = await Upload.find({
            skip: skip,
            take: limit,
            relations: ["liked", "uploadComments", "posts", "user"]
        })

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
                case error.message.includes('page invalid'):
                    statusCode = 400
                    errorMessage = 'Page selected is not valid'
                    break;
                case error.message.includes('no more uploads'):
                    statusCode = 400
                    errorMessage = 'There are no more users to show!'
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT LOGIN', new Error(errorMessage))
    }
}

export const getOwnUploads = async (req: Request, res: Response) => {
    try {

        const userId = req.tokenData.userId

        const limit = 3
        const page = Number(req.query.page) || 1
        const skip = (page - 1) * limit
        const lengPosts = await Upload.find({
        })
        if (page <= 0 || !Number.isInteger(page)) {
            throw new Error('page invalid')
        }
        if (skip >= lengPosts.length) {
            throw new Error('no more uploads')
        }

        const user = await User.findOne({
            where: {
                id: userId
            }
        })

        const uploads = await Upload.find({
            relations: ["user"],
        })

        const userUploads = uploads.filter(upload => upload.user.id === userId)

        tryStatus(res, 'Uploads by id succesfully called!', userUploads)
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
        catchStatus(res, statusCode, 'CANNOT GET UPLOADS BY ID', new Error(errorMessage))
    }
}

export const createUpload = async (req: Request, res: Response) => {
    try {

        const { name, description, downloadable } = req.body
        const userId = req.tokenData.userId

        const user = await User.findOne({
            where: {
                id: userId
            },
            relations: ['uploads']
        })
        console.log("PREVIOUSUSUSUS -> ", user);


        if (!user) {
            throw new Error('user doesnt exists')
        }
        if (!name) {
            throw new Error('required fields')
        }

        const newUpload = await Upload.create({
            name: name,
            description: description,
            downloadable: downloadable,
            user: {
                id: userId
            }
        }).save()

        const userP = await User.findOne({
            where: {
                id: userId
            },
            relations: ['uploads']
        })

        console.log("NEW UPLOADES -> ", userP);


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
export const deleteOwnUpload = async (req: Request, res: Response) => {
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

        const filePath = path.join(__dirname, '../../../', `3D-Models/${user.name}`, `${upload.name}`)

        if (!fs.existsSync(filePath)) {
            throw new Error('file not found')
        }

        fs.unlinkSync(filePath)

        await Upload.delete(uploadId)

        const userUploads = await Upload.find({
            where: {
                user: {
                    id: userId
                }
            }
        })

        tryStatus(res, 'Upload deleted!', userUploads)
    } catch (error) {
        let statusCode: number = 500
        let errorMessage: string = 'Unkown error ocurred...'

        if (error instanceof Error)
            switch (true) {
                case error.message.includes('user doesnt exists'):
                    statusCode = 409
                    errorMessage = "User doesn't exists"
                    break;
                case error.message.includes('upload doesnt exists'):
                    statusCode = 409
                    errorMessage = "Upload doesn't exists"
                    break;
                case error.message.includes('file not found'):
                    statusCode = 409
                    errorMessage = "Cannot find the model!"
                    break;
                default:
                    break;
            }
        catchStatus(res, statusCode, 'CANNOT DELETE UPLOAD', new Error(errorMessage))
    }
}