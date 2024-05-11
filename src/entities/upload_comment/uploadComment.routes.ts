import { Router } from "express";

// Middlewares
import { auth } from "../../middlewares/auth-middleware";
import { createUploadComment, deleteUploadComment, getAllUpladComments, getMyComments, updateUploadComment } from "./uploadComment.controller";


const router = Router()

router.get('/all', auth, getAllUpladComments)
router.get('/own', auth, getMyComments)
router.post('/new/:id', auth, createUploadComment)
router.put('/update/:id', auth, updateUploadComment)
router.delete('/delete/:id', auth, deleteUploadComment)


export default router