import { Router } from "express";
import { createUpload, deleteOwnUpload, getAllUploads, getOwnUploads } from "../upload/upload.controller";
import { auth } from "../../middlewares/auth-middleware";

const router = Router()

router.get('/all', getAllUploads)
router.get('/user', auth, getOwnUploads)
router.post('/upload', auth, createUpload)
router.delete('/delete/:id', auth, deleteOwnUpload)

export default router