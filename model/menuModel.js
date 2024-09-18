const mongoose=require('mongoose')

const menuSchema=mongoose.Schema(
     {
        image:{
            type:Object,
            default:{} 
        },
        name:{
            type:String,
            required:[true,'Add name']
        },
        ingredients:{
           type:String,
           required:true
        },
        soldOut:{
            type:Boolean,
            default:false
        },
        price:{
            type:String,
            required:[true,'Add Price']
        },
        quantity:{
            type:Number,
             default:1
        },
        totalPrice:{
            type:Number,
        },
        category:{
          type:String,
          default:'pizza'
        }
     },{
        timestamps:true
     }
)

const menu = mongoose.model('Menu',menuSchema)

module.exports = menu