import { Router } from "express";
import { hola } from "./entities/authentification/auth.controller";

const router = Router()


router.use('/auth', hola)



export default router