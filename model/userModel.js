const mongoose=require('mongoose')
const bycrypt=require('bcryptjs')

const userSchema=mongoose.Schema(
    {
        name:{
            type:String,
            required:[true,'Please Add Name']
        },
        password:{
            type:String,
            required:function (){
                return !this.googleId
            },
            minLength:[6,'password must be a 6 characters']
        },
        email:{
            type:String,
            required:[true,'Please add a Email'],
            unique:true,
            match:[
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                "Please Enter a valid Email"
            ]
        },
       role:{
        type:String,
        required:true,
        default:'user'
       },
       googleId:{
        type:String,
        unique:true,
        sparse: true
       },
       profilePic:{
        type:String,
        default:'https://avatar.iran.liara.run/public/boy'
       }
    },
    {
        timestamps:true
    }
)


userSchema.pre('save',async function(next){
     if(!this.isModified('password')){
         next()
     }

     const salt=await bycrypt.genSalt(10)
     const hashedPassword=await bycrypt.hash(this.password,salt)
     this.password=hashedPassword
     next();
})


const User=mongoose.model('User',userSchema)
module.exports=User;

