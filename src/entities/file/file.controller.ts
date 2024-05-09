import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { Upload } from "../upload/Upload";
import { tryStatus } from "../../utils/resStatus";
import { User } from "../user/User";

const __fileName = __filename
const __filePath = path.dirname(__fileName)

export const registerAvatar = async (req: Request, res: Response) => {
    try {
        console.log(req.body);

        if (!req.file) {
            return res.status(200).json({
                success: true,
                message: 'No file selected'
            });
        }

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

export const getAvatar = async (req: Request, res: Response) => {
    try {
        const fileName = req.params.id

        if (!fileName) {
            return res.status(400).json({
                success: false,
                message: 'Invalid file name!'
            })
        }
        const filePath = path.join(__dirname, '../../../', 'img/avatars', fileName)
        console.log(filePath);

        if (!fs.existsSync(filePath)) {
            return res.status(404).json({
                success: false,
                message: "File doesn't exist!"
            })
        }

        const fileStream = fs.createReadStream(filePath)
        fileStream.pipe(res)
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'unkown problem...',
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
        const filePath = path.join(__dirname, '../../../', '3D-Models/Seeders', `${file!.name.split("-")[1]}`)

        if (!fs.existsSync(filePath)) {
            return res.status(400).json({
                success: false,
                message: "File not found"
            })
        }
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

// export const getUploadFile = async (req: Request, res: Response) => {
//     try {
//         const uploadId = Number(req.params.id)
//         const upload = await Upload.findOne({ where: { id: uploadId } });
//         if (!upload) {
//             return res.status(404).send('Upload not found');
//         }

//         const filePath = `D:/GeeksHub/Trabajos/GeeksHub_FinalAssignment_Chekpoint-Network/Checkpoint_Backend/3D-Models/Seeders/${upload.name.split("-")[1]}`

//         const absolutePath = path.resolve(filePath)

//         res.sendFile(absolutePath);
//     } catch (error) {
//         res.status(500).send('Error retrieving the file: ' + error);
//     }
// };

export const registerUpload = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: true,
                message: 'No file selected'
            });
        }

        if (req.file.mimetype !== 'application/octet-stream') {
            return res.status(400).json({
                success: false,
                message: 'FBX format incorrect!'
            })
        }

        const userId = req.tokenData.userId
        const user = await User.findOne({
            where: {
                id: userId
            }
        })
        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'user does not exist'
            })
        }
        const userFolder = `3D-models/${user.name}`

        if (!fs.existsSync(userFolder)) {
            fs.mkdirSync(userFolder), { recursive: true }
        }



        const newPath = `${userFolder}/${req.file.originalname}`
        fs.renameSync(req.file.path, newPath)

        res.send({
            success: true,
            message: '3D model uploaded correctly!',
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