import { createUser ,updateUser,getUsers,getSingleUser} from "../controllers/userController.js";
import express from 'express'
import authMiddleware from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/rolemiddleware.js";
const router=express.Router()

//create a user [ONLY ADMIN] -role based middleware
//this is when admin creates users
router.post("/",authMiddleware,roleMiddleware("admin"),createUser)


//update a user [ONLY ADMIN] -role based middleware
router.patch("/:id",authMiddleware,roleMiddleware("admin"),updateUser)


//get all the users [ONLY ADMIN] -role based middleware
router.get("/",authMiddleware,roleMiddleware("admin"),getUsers)


//get the details of a single user [ONLY ADMIN] -role based middleware
router.get("/:id",authMiddleware,getSingleUser)

export default router


