import { Router } from "express";
import multer from "multer";
import fs from "fs";

import authRoute from "./entities/authentification/auth.routes";
import userRoute from "./entities/user/user.routes";
import fileRoute from "./entities/file/file.routes";


const router = Router()


router.use('/auth', authRoute)
router.use('/user', userRoute)
router.use('/file/', fileRoute)


export default router