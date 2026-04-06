import userModel from '../models/user.js'

import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

//create a new user -> when user does self registration
export const registerUser=async (request,response)=>{
    //input validation
    //check if user already exists -> if yes return
    //hash password 
    //store user in database
    try {
        let {name,email,password}=request.body;
        let emailCheck = false;

        
        if(email){
            let k=email.toLowerCase(); //converting email to lowercase as emails are not case sensitive
            email=k

            
            //checking valid email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            emailCheck=emailRegex.test(email)
        }


        if(!name || !emailCheck || !password || password.length<8){
            return response.status(400).send({"message":"Invalid data!Please enter valid name and email address.Password length should be at least 8 characters","success":false,"result":null})
        }

        //valid credentials entered
        //check if user already exists
        const isUserExist=await userModel.findOne({email})

        if(isUserExist!=null){
            //means user with the given credentials already exist
            return response.status(400).send({"message":"User already exists","success":false,"result":null})
        }

        //user doesnot exist
        //so we will create a new user
        const newObj={name,email}

        
        //hash password and then store in database
        const salt=await bcrypt.genSalt(10)
        //console.log(salt)
        const h=await bcrypt.hash(password,salt) //returns hashed password string
        newObj.password=h;

        const newUser=await userModel.create(newObj)
        return response.status(201).send({"message":"Registration successful!New user created","success":true,"result":{"_id":newUser._id,name,email,"role":"viewer","status":"active"}})
    } 
    catch (error) {
        console.log(error.message)
        response.status(500).send({"message":"Something went wrong","success":false,"result":null})
    }
}
/*
In self registration:

IGNORE role from request
IGNORE status from request

beacuse user can also send the role as Admin which may compromise the security of our system
*/


//authenticate user
//user will login by email and password
export const loginUser=async (request,response)=>{
    //valid inputs -> check email ->if user exists-> compare hashed password-> generate JWT token -> return token+user info
    //we send user info also becuase frontend needs to know so as to provide access based on role of the user.This also helps avoid extra API call becuase we already have the user info
    try {
        let {email,password}=request.body
        email=email.toLowerCase(); //converting email to lowercase as emails are not case sensitive
        
        if(!email || !password){
            return response.status(400).send({"message":"Please enter a valid email and password","success":false})
        }

        let isUserExist=await userModel.findOne({email})

        if(isUserExist==null){
            //means no user exist with the given email
            return response.status(401).send({"message":"Invalid credentials","success":false})
        }

        //if user exists but the status of the user is inactive Then he shouldnt be allowed to login -> BLOCK LOGIN
        if(isUserExist.status=="inactive"){
            return response.status(403).send({"message":"Inactive user!Not allowed to login","success":false})
        }

        //means user with the given email exist in our database
        //now we will compare the password
        const isPassMatch=await bcrypt.compare(password,isUserExist.password)

        if(isPassMatch==false){
            //means incorrect password
            return response.status(401).send({"message":"Invalid credentials","success":false})
        }

        //means email+password both match
        //generate JWT token

        const payload = {
                userId: isUserExist._id,
                role: isUserExist.role
                }
        const userInfo = {
            _id: isUserExist._id,
            name: isUserExist.name,
            email: isUserExist.email,
            role: isUserExist.role,
            status: isUserExist.status
        } //so that we can return user info
        
        const token=jwt.sign(payload,process.env.JWT_SECRET,{ expiresIn: "1d" })
        //payload is the info that we want to store inside the token
        //toekn stores the id of the user and the role of the user ->required later for role based middleware
       
       response.status(200).send({
            message: "Logged in successfully",
            success: true,
            token: token,
            user: userInfo
        })

    } 
    catch (error) {
        console.log(error.message)
        response.status(500).send({"message":"Something went wrong","success":false})
    }
}


/*
❓ What is jwt.sign()?
-core of authentication system
jwt.sign() creates a token (digital identity card)

📦 It takes:
Payload (data)
Secret key
Options (expiry)
🔐 Example
jwt.sign(payload, secret, { expiresIn: "1d" })

👉 Output:
A long string like:
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

🧠 What this token does
Proves user is logged in
Sent with every request
Backend verifies it
*/

/*
Flow
User logs in -> Backend creates token-> Client stores token -> Client sends token in headers -> Backend verifies token
*/

