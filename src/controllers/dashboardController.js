// Provide summary/analytics data
import transactModel from "../models/transaction.js";
import mongoose from "mongoose";

//Viewer Can view dashboard BUT only their own data i.e their total income,their expenses,their categories

//Analyst Can view dashboard Can see ALL users’ aggregated data

//Admin Full access Same as analyst

/*
if user role=="viewer" -> show only users data
else show system wide data
*/
export const getDashboardSummary=async (request,response)=>{
    //returns multiple insights

    //Total income -> sum of all transaction records where type=="income"
    //Total expenses -> sum of all transaction records where type=="expense"
    //Net balance -> income - expense
    //Category wise totals -> group by category
    //Recent activity -> latest tranasactions
    //Monthly or weekly trends

    try {
        
        
        let matchStage = {};

        //filter based on role  BECZ user should only be able to see their own data while analyst and admin should be able to see system wide data
        if(request.user.role === "viewer"){
            matchStage.userId = new mongoose.Types.ObjectId(request.user.userId);
        }

        //total income
        const income = await transactModel.aggregate([
            { $match: { ...matchStage, type: "income" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        //total expense
        const expense = await transactModel.aggregate([
            { $match: { ...matchStage, type: "expense" } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        //category breakdown
        const categoryBreakdown = await transactModel.aggregate([
            { $match: matchStage },
            {
                $group: {
                _id: "$category",
                total: { $sum: "$amount" }
                }
            }
        ]);

        //recent transactions
        const recent = await transactModel.find(matchStage).sort({ createdAt: -1 }).limit(5);  //give latest 5 transactions

        //net balance
        const totalIncome = income[0]?.total || 0;
        const totalExpense = expense[0]?.total || 0;

        const netBalance = totalIncome - totalExpense;

        response.status(200).send({
            message: "Dashboard summary fetched successfully",
            success: true,
            result: {
                totalIncome,
                totalExpense,
                netBalance,
                categoryBreakdown,
                recentTransactions: recent
            }
        });

    } 
    catch (error) {
        console.log(error.message)
        response.status(500).send({"message":"Something went wrong","success":false,"result":null})
    }

}



