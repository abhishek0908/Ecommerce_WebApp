const jwt = require('jsonwebtoken')
const {secretKey} = require('../config')
function adminMiddleware(req,res,next){
    const token = req.headers.authorization;
    if(!token)
    {
        return res.send("No Token Provided")
    }
    try{
        const words = token.split(" ")
        const decodedToken =  jwt.verify(words[1],secretKey)
        if(decodedToken.username)
        {
            next()
        }
        else{
         res.status(403).send("Invalid Token")
        }
        
    }
    catch(error)
    {
       if (error.name === "JsonWebTokenError")
        {
            return res.send("Invalid Token")
        }
        else if(error.name==="TokenExpiredError"){
           return res.send("Token Expired")
        }
        res.status(500).send('Internal server error');
    }
    
}

module.exports = {
    adminMiddleware
}