import { Router } from "express";
import { createUpload, getAllUploads} from "../upload/upload.controller";
import { auth } from "../../middlewares/auth-middleware";

const router = Router()

router.get('/all', getAllUploads)
router.post('/upload', auth, createUpload)

export default router