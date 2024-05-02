import { Router } from "express";

import authRoute from "./entities/authentification/auth.routes";
import userRoute from "./entities/user/user.routes";


const router = Router()


router.use('/auth', authRoute)
router.use('/user', userRoute)



export default router