import { Router } from "express";
import multer from "multer";

// Controllers
import { getUploadFile, registerAvatar } from "./file.controller";

// Instances
const router = Router()
const uploadAvatar = multer({ dest: 'img/avatars' })

router.post('/avatar', uploadAvatar.single('avatar'), registerAvatar)
router.get('/:id', getUploadFile)


export default router