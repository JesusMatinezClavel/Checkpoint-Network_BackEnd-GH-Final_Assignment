import { Router } from "express";


import authRoute from "./entities/authentification/auth.routes";
import userRoute from "./entities/user/user.routes";
import fileRoute from "./entities/file/file.routes";
import uploadRoute from "./entities/upload/upload.routes";
import uploadCommentRoute from "./entities/upload_comment/uploadComment.routes";


const router = Router()


router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/file', fileRoute)
router.use('/upload', uploadRoute)
router.use('/comment/upload', uploadCommentRoute)


export default router