import mongoose from "mongoose";

const transactionSchema=mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
       required: true,
       index:true
    },
    amount:{
        type:Number,
        required:true
    },
    type:{
        type:String,
        enum:["income","expense"],
        required:true
    },
    category:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now        //if user sends the date then that value will be used otherwise current date will be used
    },
    notes:String
},
{
    timestamps:true
})

const transactModel=mongoose.model("transactions",transactionSchema)
export default transactModel


/*
•	userId (important 🔥)
•	amount
•	type (income / expense)
•	category
•	date
•	notes or description
 */

// userId reference _id of users collection?
//Every document in MongoDB has _id .You store that _id of users collection (for that specific user) in transaction.userId
//i.e 1 user can have many transactions i.e 1-many relationship



