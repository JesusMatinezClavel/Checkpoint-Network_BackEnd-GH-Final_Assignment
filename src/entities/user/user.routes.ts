import { Router } from "express";

// Middlewares
import { auth } from "../../middlewares/auth-middleware";
import { getOwnProfile } from "./user.controller";

// Controllers



const router = Router()

router.get('/profile/:id', auth, getOwnProfile)


export default router