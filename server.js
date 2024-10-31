const express=require('express')
const mongoose=require('mongoose')
const dotenv=require('dotenv').config()
const pizzaRoutes=require('./routes/pizzaRoutes')
const path=require('path')
const cookieParse=require('cookie-parser')
const bodyParser=require('body-parser')
const cors=require('cors')
const userRoute=require('./routes/userRoute')
const orderRoute=require('./routes/orderRoute')
const passportAuth2=require('passport-google-oauth2').Strategy;
const session=require('express-session')
const passport = require('passport')
const User = require('./model/userModel')
const drinkRoute=require('./routes/drinkRoute')
const tableRoute=require('./routes/tableRoute')
const contactRoute=require('./routes/contactRoute')

const app=express();
app.use(express.json())
app.use(cookieParse())
app.use(bodyParser.json())
app.use(express.urlencoded({extended:false}))
app.use(cors(
    {
        origin:['http://localhost:3000'],
        methods:'GET,POST,DELETE,PUT',
        credentials:true
    }
))


const PORT=8000


//session setup for google login

app.use(session({
    secret:'9394urhhjrjuei433nnfbiwi**#',
    resave:false,
    saveUninitialized:true
}))


//setup of passport
app.use(passport.initialize())
app.use(passport.session())
passport.use(
    new passportAuth2({
        clientID:process.env.CLIENT_ID,
        clientSecret:process.env.CLIENT_SECRET,
        callbackURL:'http://localhost:8000/api/auth/callback/google',
        scope:['profile','email']
    },
 async (accessToken,refreshToken,profile,done)=>{
   try {
       
       let user=await User.findOne({googleId:profile.id})
       if(!user){
          user=new User({
            googleId:profile.id,
            name:profile.displayName,
            email:profile.emails[0].value,
            profilePic:profile.photos[0].value
        })
        await user.save();
       }

      return done(null,user)

   } catch (error) {

    return done(error,null)

   }
 })
 )

 passport.serializeUser((user,done)=>{
   done(null,user)
 })

 passport.deserializeUser((user,done)=>{
      done(null,user)
 })

 //initailized google auth login
 app.get('/api/auth/callback',passport.authenticate('google',{scope:['profile','email']}))
 app.get('/api/auth/callback/google',passport.authenticate('google',{
    successRedirect:'http://localhost:3000/dashboard',
    failureRedirect:'http://localhost:3000/login'
 }))

 mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.get('/',(req,res)=>{
        res.send('Home Page pizza')
    })
 })
   
  
  app.use('/uploads', express.static(path.join(__dirname,'uploads')))
  app.use('/api/pizza',pizzaRoutes)
  app.use('/api/user',userRoute)
  app.use('/api/order',orderRoute)
  app.use('/api/drink',drinkRoute)
  app.use('/api/table',tableRoute)
  app.use('/api/contact',contactRoute)
  
  

 app.listen(PORT,(req,res)=>{
    console.log(`The server is running on port ${PORT}`)
 })
