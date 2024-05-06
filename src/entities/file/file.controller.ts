import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Upload } from "../upload/Upload";

const __fileName = __filename
const __filePath = path.dirname(__fileName)

export const registerAvatar = async (req: Request, res: Response) => {
    try {
        if (req.file.mimetype !== 'image/png' && req.file.mimetype !== 'image/jpg' && req.file.mimetype !== 'image/jpeg' && req.file.mimetype !== 'image/svg') {
            return res.status(400).json({
                success: false,
                message: 'Avatar format incorrect!'
            })
        }
        const newPath = `img/avatars/${req.file.originalname}`
        fs.renameSync(req.file.path, newPath)

        res.send({
            success: true,
            message: 'avatar uploaded correctly!',
            data: newPath
        })
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'CANNOT UPLOAD AVATAR',
            error: error
        })
    }
}

export const getUploadFile = async (req: Request, res: Response) => {
    try {
        const fileId = Number(req.params.id)
        const file = await Upload.findOne({
            where: {
                id: fileId
            }
        })
        
        if (!file) {
            res.status(401).json({
                success: false,
                message: 'File does not exist'
            })
        }
        const filePath = path.join(__dirname, '../../../', '3D-Models/Seeders',`${file!.name.split("-")[1]}`)        

        if (!fs.existsSync(filePath)) {
            return res.status(400).json({
                success: false,
                message: "File not found"
            })
        }
        // try {
        //     await fs.promises.access(filePath);
        // } catch (error) {
        //     return res.status(400).json({
        //         success: false,
        //         message: "File not found"
        //     });
        // }
        const fileStream = fs.createReadStream(filePath)
        fileStream.pipe(res)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'CANNOT GET UPLOAD',
            error: error
        })
    }
}