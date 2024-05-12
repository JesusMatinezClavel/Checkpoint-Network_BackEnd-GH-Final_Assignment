import { Router } from "express";

// Middlewares
import { auth } from "../../middlewares/auth-middleware";
import { addRemoveLikes, deleteOwnUser, deleteUserBySuperadmin, followUnfollow, getAllUsersBySuperadmin, getOwnProfile, getProfile, updateOwnProfile } from "./user.controller";

// Controllers



const router = Router()

router.get('/superadmin', auth, getAllUsersBySuperadmin)
router.delete('/superadmin/:id', auth, deleteUserBySuperadmin)

router.get('/profile/:id', auth, getProfile)
router.get('/profile/', auth, getOwnProfile)
router.put('/profile/update', auth, updateOwnProfile)
router.delete('/delete', auth, deleteOwnUser)
router.put('/like/:id', auth, addRemoveLikes)
router.put('/follow/:id', auth, followUnfollow)


export default router