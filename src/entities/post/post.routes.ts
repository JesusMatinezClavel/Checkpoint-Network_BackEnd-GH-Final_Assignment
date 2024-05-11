import { Router } from "express";

// Middlewares
import { auth } from "../../middlewares/auth-middleware";
import { createNewPost, deletePost, getAllPosts, getMyPosts, updatePost } from "./post.controller";


const router = Router()

router.get('/all', auth, getAllPosts)
router.get('/own', auth, getMyPosts)
router.post('/new/:id', auth, createNewPost)
router.put('/update/:id', auth, updatePost)
router.delete('/delete/:id', auth, deletePost)


export default router