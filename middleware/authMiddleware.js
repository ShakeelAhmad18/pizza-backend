const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken');
const User = require('../model/userModel');

const protecter=asyncHandler( async (req,res,next)=>{

    try {

        const token=req.cookies.token;
        
        if(!token){
           res.status(401)
           throw new Error('Unauthorized user,please login')
        }
    
        const verified=jwt.verify(token,process.env.JWT_SECRET)
    
        //get user id from Token
    
        const user=await User.findById(verified.id).select('-password')
        
        if(!user){
            res.status(401)
            throw new Error('User not found')
        }
    
        req.user=user;
        next();
    
      } catch (error) {
    
        res.status(401)
        throw new Error('Not Authorized User')
      }
    
  } )
  
  module.exports=protecter;