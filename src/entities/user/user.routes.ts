import { Router } from "express";

// Middlewares
import { auth } from "../../middlewares/auth-middleware";
import { getOwnProfile, getProfile } from "./user.controller";

// Controllers



const router = Router()

router.get('/profile/:id', auth, getProfile)
router.get('/profile/', auth, getOwnProfile)


export default router