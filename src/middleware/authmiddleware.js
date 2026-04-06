import jwt from 'jsonwebtoken'

const authMiddleware=(request,response,next)=>{
    try {
        //Extract authorisation header
    let k=request.headers.authorization; //this gives something like Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

    //Check if header exists
    if(!k){
        return response.status(401).send({"message":"Unauthorized"})
    }

    //Authorization header format is "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    let t=k.split(" ") //gives ["Bearer", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."]

    if(t[0]!="Bearer"){
        return response.status(401).send({"message":"Unauthorized"}) 
    }

    let token=t[1];  //actual token

    //Verify token
    let decodedData=jwt.verify(token,process.env.JWT_SECRET) //Check if the token is valid AND extract the data inside it
    /*
    jwt.verify()=This function:Checks signature,Checks expiry

    1.Checks signature - Was this token created using MY secret key?
    2.Expiry check - Is this toekn stilll valid?
    3.Payload extraction -If everything is valid->It returns the original payload
    else throws error
    */

    //decodedData is the payload you gave during jwt.sign() -> this is very USEFUL Becz now in any API you can check request.user => u can know who user is?What is its role Without worrying to make API calls again and again
    //Attach Decoded Data To Request i.e attach user to request
        request.user=decodedData;
        next() //passes control to actual route controller
    
    } 
    catch (error) {
        console.log(error.message)
        return response.status(401).send({"message":"Unauthorized"})
    }
}

export default authMiddleware
/*
1 User logs in → gets token
2 Sends token in header
3 Middleware extracts token
4 jwt.verify() checks:
    valid? ✔
    expired? ✔
    signed by you? ✔
5 Returns payload
6 You attach it to request
7 Controllers use it
*/