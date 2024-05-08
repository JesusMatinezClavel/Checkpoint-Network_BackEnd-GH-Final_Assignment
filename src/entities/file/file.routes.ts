import { Router } from "express";
import multer from "multer";

// Controllers
import { getAvatar, registerAvatar } from "./file.controller";
import { auth } from "../../middlewares/auth-middleware";

// Instances
const router = Router()
const uploadAvatar = multer({ dest: 'img/avatars' })

router.post('/avatar', uploadAvatar.single('avatar'), registerAvatar)
router.get('/avatar/:filename', auth, getAvatar)


export default router