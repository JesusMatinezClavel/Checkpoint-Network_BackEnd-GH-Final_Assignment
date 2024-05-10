import { Router } from "express";

// Middlewares
import { auth } from "../../middlewares/auth-middleware";
import { getOwnProfile, getProfile, updateOwnProfile } from "./user.controller";

// Controllers



const router = Router()

router.get('/profile/:id', auth, getProfile)
router.get('/profile/', auth, getOwnProfile)
router.put('/profile/update', auth, updateOwnProfile)


export default router