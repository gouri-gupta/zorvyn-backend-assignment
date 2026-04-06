import { getDashboardSummary } from "../controllers/dashboardController.js";
import express from 'express'
import authMiddleware from "../middleware/authmiddleware.js";

const router=express.Router()

//only logged in user can view the dashboard data So authmiddleware required
//no role based restriction as all including viewer,analyst,admin can view this dashboard data
router.get("/",authMiddleware,getDashboardSummary)

export default router
