import userModel from '../models/user.js'
import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

//create a user [ONLY ADMIN] -role based middleware
//this is when admin creates users
export const createUser=async (request,response)=>{
    try {
        //only admin can create USERS
        if(request.user.role!=="admin"){ 
            return response.status(403).send({
            message: "Access denied!Cannot add users",
            success: false
            });
        }

        //role is valid 
        let {name,email,password,role,status}=request.body
        //now this is admin creating the user SO he can assign any role,status  etc to the user SO we need to consider all the details

        //but while creating any user 3 details are necesssary i.e name,email and password
        if(!name || !email || !password){
            return response.status(400).send({
                "message":"Invalid data!Please enter all the details of name,email and password",
                "success":false,
                "result":null
            })
        }

        name = name?.trim();

        //email validation
        if(email){
            email = email?.trim();
            email=email.toLowerCase();
        }

        //checking valid email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        let emailCheck=emailRegex.test(email)

        if(!emailCheck){
            return response.status(400).send({
                "message":"Invalid data!Please enter a valid email",
                "success":false,
                "result":null
            })
        }

        //password validation
        if (password.length < 8) {
            return response.status(400).send({
                message: "invalid data!Password must be at least 8 characters",
                success: false,
                result: null
            });
        }

        //role validation
        if(role){
            role=role?.trim().toLowerCase();
        }

        if(role && role!=="viewer" && role!=="analyst" && role!=="admin"){
            return response.status(400).send({
                "message":"Invalid data!Role can be a viewer,analyst or admin",
                "success":false,
                "result":null
            })
        }

        //status validation
        if(status){
            status = status?.trim().toLowerCase();
        }

        if(status && status!=="active" && status!=="inactive"){
            return response.status(400).send({
                "message":"Invalid data!Status can be a active or inactive",
                "success":false,
                "result":null
            })
        }
        role = role || "viewer";
        status = status || "active";

        //data entered is VALID
        //but also check whether the user with the given email already exists or not
        const existingUser = await userModel.findOne({ email });

        if (existingUser) {
            return response.status(400).send({
                message: "User already exists",
                success: false,
                result: null
            });
        }


        //hash the password
        //hash password and then store in database
        const salt=await bcrypt.genSalt(10)
        //console.log(salt)
        const h=await bcrypt.hash(password,salt) //returns hashed password string

        //so now we can create a user
        const newObj={name,email,role,status,password:h}
        const newUser=await userModel.create(newObj)

        const userResponse={
            "_id":newUser._id,
            "name":newUser.name,
            "email":newUser.email,
            "role":newUser.role,
            "status":newUser.status
        }

        response.status(201).send({
            "message":"User created successfully",
            "success":true,
            "result":userResponse
        })
    } 
    catch (error) {
        console.log(error.message)
        response.status(500).send({"message":"Something went wrong","success":false,"result":null})    
    }
}

//update a user [ONLY ADMIN] -role based middleware
export const updateUser=async (request,response)=>{
    try {
        //only admin can update USERS
        if(request.user.role!=="admin"){ 
            return response.status(403).send({
            message: "Access denied!Cannot update users",
            success: false,
            result:null
            });
        }

        let {id}=request.params;
        //we have to update the details of the user with this id

        if(!id){
            return response.status(400).send({
            "message":"Invalid user ID",
            success:false,
            result:null
            })
        }
        
        //check whether is it a valid mongodb object ID or not
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).send({
                message: "Invalid user ID format",
                success: false,
                result:null
            });
        }

        //user can update any field in the user 
        //he can update the name,email,password,role,status
        let {name,email,password,role,status}=request.body

        const newObj={}; //this is the obj which we will be sending for update

        //updating name -> no check required
        if(name){
            name=name?.trim()
            newObj.name=name;
        }

        //updating email -> check whether proper email format @gmail
        if(email){
            email = email?.trim().toLowerCase();

            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let emailCheck=emailRegex.test(email)

            if(!emailCheck){
                return response.status(400).send({
                    "message":"Invalid data!Please enter a valid email",
                    "success":false,
                    "result":null
                })
            }

            //if admin updates email -> there may be a chance of duplicate users
            const existingUser = await userModel.findOne({ email });

            if (existingUser && existingUser._id.toString() !== id) {
                return response.status(400).send({
                    message: "Email already in use",
                    success: false,
                    result: null
                });
            }

            newObj.email=email
        }

        //can also update the password ->check whether passsword lenght is at least 8
        if(password && password.length<8){
            return response.status(400).send({
                message: "invalid data!Password must be at least 8 characters",
                success: false,
                result: null
            });
        }
        else if(password && password.length>=8){
            //hash the password and then store in newObj
            const salt=await bcrypt.genSalt(10)
            //console.log(salt)
            const h=await bcrypt.hash(password,salt) //returns hashed password string
            newObj.password=h;
        }

        //can also update the role -> But check role can only be 3 = "viewer","analyst","admin"
        if(role){
            role=role?.trim().toLowerCase()

            if(role!=="admin" && role!=="viewer" && role!=="analyst"){
                return response.status(400).send({
                    "message":"Invalid data!Role can be a viewer,analyst or admin",
                    "success":false,
                    "result":null
                })
            }

            newObj.role=role;
        }

        //can also update the status -> But check it can only be 2 = "active" , "inactive"
        if(status){
            status=status?.trim().toLowerCase()

            if(status!=="active" && status !=="inactive"){
                return response.status(400).send({
                    "message":"Invalid data! status can be active or inactive",
                    "success":false,
                    "result":null
                })
            }
            newObj.status=status
        }

        //what if user sends empty object ->so we need to prevent empty update
        if (Object.keys(newObj).length === 0) {
            return response.status(400).send({
                message: "No fields provided for update",
                success: false,
                result: null
            });
        }

        //all validations done
        //now final updation

        const updatedUser=await userModel.findByIdAndUpdate(id,newObj,{returnDocument: "after",runValidators:true})

        if(!updatedUser){
            return response.status(404).send({
                message: "User not found",
                success: false,
                "result":null
            });
        }

        const userResponse = {
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            status: updatedUser.status
        };

        response.status(200).send({
            "message":"User updated successfully",
            success:true,
            result:userResponse
        })
        
    } 
    catch (error) {
        console.log(error.message)
        response.status(500).send({"message":"Something went wrong","success":false,"result":null})
    }
}

//get all the users [ONLY ADMIN] -role based middleware
//here also we will add filters So that admin can filter by roles,or by status OR both
export const getUsers=async (request,response)=>{
    try {
        //only admin can access all the users
        if(request.user.role!=="admin"){ 
            return response.status(403).send({
            message: "Access denied!Cannot view users",
            success: false,
            result:null
            });
        }

        //filtering by role,status
        let filter = {};

        if (request.query.role) {
            const role = request.query.role.toLowerCase();

            if(role!=="admin" && role!=="viewer" && role!=="analyst"){
                return response.status(400).send({
                    message: "Invalid role filter",
                    success: false,
                    result:null
                });
            }

            filter.role = role;
        }

        if (request.query.status) {
            const status=request.query.status.toLowerCase()

            if(status!="active" && status!="inactive"){
                return response.status(400).send({
                    message: "Invalid role filter",
                    success: false,
                    result:null
                });
            }

            filter.status = status;
        }

        //user is an admin -> we will simply return all the data EXCEPT User passwords(which are hashed)
        const allUsers=await userModel.find(filter,{password:0}).sort({createdAt:-1}) //sorting

        response.status(200).send({
            "message":"Users data fetched successfully",
            "success":true,
            "result":allUsers
        })
    } 
    catch (error) {
        console.log(error.message)
        response.status(500).send({"message":"Something went wrong","success":false,"result":null})
    }
}

//get the details of a single user 
//Admin can view the details of all the users
//a aprticualr user can view his details only and not details of other users
export const getSingleUser=async (request,response)=>{
    try {
        
        let {id}=request.params;
        //we have to get the details of the user with this id 
        //we wont return the hashed password

        if(!id){
            return response.status(400).send({
            "message":"Invalid user ID",
            success:false,
            result:null
            })
        }
        
        //check whether is it a valid mongodb object ID or not
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return response.status(400).send({
                message: "Invalid user ID format",
                success: false,
                result:null
            });
        }

        //now id is valid
        const u=await userModel.findById(id,{password:0})

        if(!u){
            return response.status(404).send({
                message: "User not found",
                success: false,
                "result":null
            });
        }

        if (request.user.role !== "admin" && request.user.userId !== u._id.toString()) {
            return response.status(403).send({
                message: "Access denied! Cannot view user",
                success: false,
                result: null
            });
        }

        response.status(200).send({
            "message":"User details fetched successfully",
            "success":true,
            "result":u
        })
    } 
    catch (error) {
        console.log(error.message)
        response.status(500).send({"message":"Something went wrong","success":false,"result":null})
    }
}


/*
ADMIN can Create users ,Update users ,Possibly deactivate users 
Instead of deleting user we can make the status of the user as "inactive" 
For making the status as inactive we can till use updateUsers ONLY*/

//User can register themselves ✅
//OR Admin can also create users ✅

