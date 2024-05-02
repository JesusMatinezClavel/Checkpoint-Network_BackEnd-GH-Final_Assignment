import { Router } from "express";

import authRoute from "./entities/authentification/auth.routes";


const router = Router()


router.use('/auth', authRoute)



export default router