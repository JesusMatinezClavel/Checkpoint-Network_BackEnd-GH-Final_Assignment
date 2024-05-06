import { Request, Response } from "express";
import fs from "fs";

export const registerAvatar = async (req: Request, res: Response) => {
    try {
        console.log(req.file.originalname);

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

