import { Router } from "express";
import multer from "multer";

// Controllers
import { getAvatar, getUploadFile, registerAvatar, registerUpload } from "./file.controller";
import { auth } from "../../middlewares/auth-middleware";

// Instances
const router = Router()
const uploadAvatar = multer({ dest: 'img/avatars' })
const uploadModel = multer({ dest: '3D-models/' })

router.post('/avatar', uploadAvatar.single('avatar'), registerAvatar)
router.post('/upload', uploadModel.single('uploadFile'), auth, registerUpload)
router.get('/avatar/:id', getAvatar)
router.get('/download/:id', getUploadFile)


export default router