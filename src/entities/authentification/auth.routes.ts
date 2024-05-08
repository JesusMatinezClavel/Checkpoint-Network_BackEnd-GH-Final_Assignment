import { Router } from "express";
import { login, logout, register } from "./auth.controller";
import { auth } from "../../middlewares/auth-middleware";

const router = Router()

router.post('/register', register)
router.post('/login', login)
router.post('/logout', auth, logout)


export default router