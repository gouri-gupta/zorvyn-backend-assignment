import mongoose from "mongoose";

const connectDB=async ()=>{
    try {
        console.log("Connecting to mongodb...")
        await mongoose.connect(process.env.MONGO_URI)
        console.log("Successfully connected to mongodb")
    } 
    catch (error) {
        console.log("Mongo error",error.message);
        process.exit(1)
    }
}

export default connectDB;


