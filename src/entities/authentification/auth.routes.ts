import { Router } from "express";
import { register } from "./auth.controller";

const router = Router()

router.get('/register', register)


export default router