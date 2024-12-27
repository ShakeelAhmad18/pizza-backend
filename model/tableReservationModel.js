const mongoose=require('mongoose')

const tableReservationSchema=mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'User'
    },
    tableId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:'Table'
    },
    phone:{
        type:String,
        required:true
    },
    bookingDate:{
        type:Date,
        required:true
    },
    bookingTime:{
        type:String,
        required:true
    },
    message:{
        type:String,
        default:''
    },
    status:{
        type:String,
        default:'Pending'
    },
    totalPeople:{
        type:Number,
        required:true
    },
    orderNo:{
        type:String,
        default:''
    },
    reservationType:{
        type:String,
        default:'Friend Party'
    }
},{
    timestamps:true
})

const TableReservation=mongoose.model('TableReservation',tableReservationSchema)
module.exports=TableReservation;
