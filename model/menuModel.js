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
        discount:{
            type:Number,
            default:0
        },
        sizes:[
            {
            size:{
                type:String,
                default:'small'
            }
           }
        ],
        flavors:[
            {
            flavor:{
                type:String
            }
           }
        ],
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