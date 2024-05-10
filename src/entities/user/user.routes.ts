import { Router } from "express";

// Middlewares
import { auth } from "../../middlewares/auth-middleware";
import { deleteOwnUser, getOwnProfile, getProfile, updateOwnProfile } from "./user.controller";

// Controllers



const router = Router()

router.get('/profile/:id', auth, getProfile)
router.get('/profile/', auth, getOwnProfile)
router.put('/profile/update', auth, updateOwnProfile)
router.delete('/delete', auth, deleteOwnUser)


export default router