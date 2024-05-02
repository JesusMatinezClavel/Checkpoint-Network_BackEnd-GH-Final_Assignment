import { Router } from "express";

// Middlewares
import { auth } from "../../middlewares/auth-middleware";
import { getProfile } from "./user.controller";

// Controllers



const router = Router()

router.get('/profile/:id', auth, getProfile)
router.get('/profile/', auth, getProfile)


export default router