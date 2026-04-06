import { loginUser ,registerUser} from "../controllers/authController.js";
import express from 'express'

const router=express.Router()

router.post("/login",loginUser)

router.post("/register",registerUser)

export default router



