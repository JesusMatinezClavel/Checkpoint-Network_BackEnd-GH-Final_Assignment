import { Router } from "express";
import { createUpload, deleteOwnUpload, getAllUploads } from "../upload/upload.controller";
import { auth } from "../../middlewares/auth-middleware";

const router = Router()

router.get('/all', getAllUploads)
router.post('/upload', auth, createUpload)
router.delete('/delete/:id', auth, deleteOwnUpload)

export default router