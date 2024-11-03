const asyncHandler = require('express-async-handler');
const User = require('../model/userModel');
const { sendEmail } = require('../utils/sendEmail');


const contactUs=asyncHandler( async (req,res)=>{

    const {message,subject}=req.body;

     const user=await User.findById(req.user._id);

     if(!user){
        return res.status(404).json('User Not Found! Please Sign Up')
     }

     //validators
     if(!message || !subject){
        return res.status(401).json('Fill All Fields')
     }

     send_from=process.env.EMAIL_USER;
     send_to=process.env.EMAIL_USER;
     reply_to=user.email;

     try{

     await sendEmail(message,subject,send_from,send_to,reply_to);
     res.status(200).json({success:true,message:'Email Send'})

     }catch(err){
       res.status(500).json(err.message)
     }
    
} )

module.exports={
    contactUs
}