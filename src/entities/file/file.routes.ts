import { Router } from "express";
import multer from "multer";

// Controllers
import { registerAvatar } from "./file.controller";

// Instances
const router = Router()
const uploadAvatar = multer({ dest: 'img/avatars' })

router.post('/avatar', uploadAvatar.single('avatar'), registerAvatar)


export default router