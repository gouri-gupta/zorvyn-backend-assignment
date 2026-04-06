import mongoose from "mongoose";

const userSchema=mongoose.Schema({
    name:{
        type:String,
        required:[true,"User name is required"]
    },
    email:{
        type:String,
        required:[true,"User email is required"],
        unique:true, //prevents duplicate users -> improves search performance
        index:true    //email is used for login -> search user by email
    },
    password:{
        type:String,
        required:[true,"Password is mandatory"]
    },
    role:{
        type:String,
        enum:["viewer","analyst","admin"],
        default:"viewer"
    },
    status:{
        type:String,
        enum:["active","inactive"],
        default:"active"
    }
},
{
    timestamps:true
})

const userModel=mongoose.model("users",userSchema)
export default userModel;


/*•	name
•	email
•	password   - we will store hashed password
•	role (viewer / analyst / admin)
•	status (active / inactive)
 */
