import { createTransaction,getTransaction,getTransactions,updateTransaction,deleteTransaction } from "../controllers/transactionController.js";
import express from 'express'
import authMiddleware from "../middleware/authmiddleware.js";
import roleMiddleware from "../middleware/rolemiddleware.js";

const router=express.Router()

//Get ALL transactions (with role logic)
// Viewer → own transactions
//Analyst/Admin → all transactions
router.get("/", authMiddleware, getTransactions)  //handle roles inside controller
/*
Inside getTransactions
if(user.role === "viewer"){
   → return only user's transactions
}
else{
   → return all transactions
}
*/

//read details of a particular transaction
router.get("/:id",authMiddleware,getTransaction)

//create a tranasaction -ADMIN
router.post("/",authMiddleware,roleMiddleware("admin"),createTransaction)

//update a transaction - ADMIN
router.patch("/:id",authMiddleware,roleMiddleware("admin"),updateTransaction)

//delete a transaction - ADMIN
router.delete("/:id",authMiddleware,roleMiddleware("admin"),deleteTransaction)


export default router

//here as we know only admin can create,update or delete a record So in some of  these routes later we will add rolemiddleware
//so that based on roles user can perform their functionality


