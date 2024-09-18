const asyncHandler=require('express-async-handler')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const User=require('../model/userModel')

//generate Token

const generateToken=(id)=>{
   return jwt.sign({ id },process.env.JWT_SECRET,{expiresIn:'1d'})
}

const registerUser=asyncHandler( async (req,res)=>{
    const {name,email,password}=req.body;

    if(!name || !email || !password ){
        res.status(400) 
        throw new Error('fill all fields')
    }

   //check email is exist or not

   const EmailExist=await User.findOne({email})

   if(EmailExist){
    res.status(400)
    throw new Error('Email Already Exist!Please Login')
   }

   if(password.length < 6){
    res.status(400)
    throw new Error('Password must be 6 character')
   }

   //cerate a user

   const user=await User.create({
      name,
      password,
      email
   })
    
   //generate Token
   const token=generateToken(user._id)

   //send HTTP-only cookie

  res.cookie('token',token,{
    path:'/',
    httpOnly:true,
    expires:new Date(Date.now() + 1000 * 86400),
    sameSite:'none',
    secure:true
  })

  if(user){
      const {_id,name,email}=user;
      res.status(201).json({
        _id,
        name,
        email
      })
  }else{
     res.status(401)
     throw new Error('invlid user data')
  }

})


//login user

const loginUser=asyncHandler( async (req,res)=>{
    const {email,password}=req.body;

  //validate request
  if(!email || !password){
    res.send(400)
    throw new Error('Enter Email and Password')
  }

//find user exist
const user=await User.findOne({email});


if(!user){
  res.status(400)
  throw new Error('User not found,Please SignUp')
}

//token generate
const token=generateToken(user._id)

//check password
const passwordIsCorrect=await bcrypt.compare(password,user.password)

if(passwordIsCorrect){

//send HTTP-only cookie
  res.cookie("token",token,{
    path:'/',
    httpOnly:true,
    expires:new Date(Date.now() + 1000 * 86400), //1 day
    sameSite:'none',
    secure:true
  })
}

if(user && passwordIsCorrect){
  const {_id,name,email,role}=user;
  res.status(200).json(
    {
      _id,
      name,
      email,
      role,
      token
    }
  )
}else{
  res.status(400)
  throw new Error('Invalid Details')
}
} )


//logout user
const logoutUser=asyncHandler(async (req,res)=>{
    res.cookie('token','',{
        path:'/',
        httpOnly:true,
        expires:new Date(0),
        sameSite:'none',
        secure:true
    })

    return res.status(200).json({message:'Logout Successfully'})
})

//get logout status

const loginStatus=asyncHandler( async (req,res)=>{
    const token= req.cookies.token;
    
    if(!token){
     return res.json(false)
    }
 
    //verified the token
    const verified=jwt.verify(token,process.env.JWT_SECRET);
    if(verified){
     return res.json(true)
    }
    return res.json(false)

} )

//get user
const getUser= asyncHandler(async (req,res)=>{

     const user=await User.findById(req.user._id);

     if(user){
        const {_id,name,email}=user;
        res.status(200).json({
            _id,
            email,
            name
        })
     }else{
        res.status(401)
        throw new Error('Unathorization User')
     }
})

module.exports={
    registerUser,
    loginUser,
    logoutUser,
    loginStatus,
    getUser
}