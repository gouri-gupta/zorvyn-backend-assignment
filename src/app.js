//deals with How app is built

import express from 'express'
import transactRoute from './routes/transactionRoute.js'
import userRoute from './routes/userRoute.js'
import authRoute from './routes/authRoute.js'
import dashboardRoute from './routes/dashboardRoute.js'
import errorMiddleware from './middleware/errormiddleware.js'


//Express app setup
const app=express()

//Middlewares
app.use(express.json())


//Routes
//defined a basic route for testing 
app.get("/",(request,response)=>{
    response.status(200).send("Zorvyn backend assessment route testing!Running successfully")
})

app.use("/api/transactions",transactRoute)
app.use("/api/users",userRoute)
app.use("/api/auth",authRoute)
app.use("/api/dashboard",dashboardRoute)

//error handling middleware
app.use(errorMiddleware)

export default app;


