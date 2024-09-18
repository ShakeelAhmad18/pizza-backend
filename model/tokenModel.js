const mongoose=require('mongoose')

const tokenSchema=mongoose.Schema(
    {
       userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
       },
       token:{
        type:String,
        required:true,
       },
       createdAt:{
        type:String,
        required:true
       },
       expireAt:{
        type:String,
        required:true
       }
    }
)

const Token=mongoose.model('Token',tokenSchema)
module.exports=Token;