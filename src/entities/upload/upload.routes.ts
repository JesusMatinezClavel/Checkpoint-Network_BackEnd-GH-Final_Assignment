import { Router } from "express";
import { getAllUploadFiles, getAllUploads,  } from "../upload/upload.controller";

const router = Router()

router.get('/all', getAllUploadFiles)


export default router