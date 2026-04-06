//deals with How app is started

import dotenv from "dotenv";
import connectDB from './config/db.js'
import app from './app.js'


//loading environemnt variables
dotenv.config()

//Connect DB
const PORT=process.env.PORT || 3000

// start server only after DB connection
const startServer = async () => {
  try {
    await connectDB(); // wait for DB connection

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });

  } 
  catch (error) {
    console.log("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();

//Why do db connection first and then only start server
/*
Imagine:
DB is down
But server is running

👉 Any API using DB will crash
*/

//RUN COMMAND ->  npm run dev

//CORE dependencies - npm install express mongoose dotenv bcryptjs jsonwebtoken cors
//express → server
//mongoose → MongoDB ORM
//dotenv → environment variables
//bcryptjs → password hashing
//jsonwebtoken → authentication (JWT)
//cors → frontend/backend communication
//nodemon -> autorestarts server on changes