const mongoose = require('mongoose');

const tableSchema = new mongoose.Schema(
    {
  name: { 
    type: String,
     required: true 
    },
  capacity: { 
    type: Number,
     required: true 
    },
    tableDescription:{
        type:String,
        required:true
    },
  image: {
     type: Object, 
     default:{}
    },
    discount:{
        type:Number,
        default:0
    }
},
{
    timestamps:true
});


const Table=mongoose.model('Table',tableSchema);
module.exports = Table;


