import { Request, Response } from "express";
import fs from "fs";

export const registerAvatar = async (req: Request, res: Response) => {
    try {
        const newPath = `img/avatars/${req.file.originalname}`
        if (req.file.mimetype !== ('image/png' || 'image/jpg' || 'image/jpeg' || 'image/svg')){
            return res.status(400).json({
                success: false,
                message: 'Avatar format incorrect!'
            })
        }

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

