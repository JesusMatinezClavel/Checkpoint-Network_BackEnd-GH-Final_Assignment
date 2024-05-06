import { Router } from "express";
import { getAllUploads,  } from "../upload/upload.controller";

const router = Router()

router.get('/all', getAllUploads)


export default router