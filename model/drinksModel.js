const mongoose=require('mongoose')

const drinksSchema=mongoose.Schema(
    {
        namedrink:{
            type:String,
            required:true
        },
        unitprice:{
            type:Number,
            required:true
        },
        quantity:{
            type:Number,
            default:1
        },
        image:{
            type:Object,
            default:{} 
        },
        soldOut:{
            type:Boolean,
            default:false
        },
        company:{
            type:String,
        }
    },
    {
        timestamps:true
    }
)


const Drinks=mongoose.model('Drinks',drinksSchema)
module.exports=Drinks;