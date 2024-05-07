import { Router } from "express";
import { getAllUploads, getUploadFile,  } from "../upload/upload.controller";

const router = Router()

router.get('/all', getAllUploads)
router.get('/download/:id',getUploadFile)


export default router