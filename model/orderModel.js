const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    },
    items:[
      {
        itemId:{
          type:mongoose.Schema.Types.ObjectId,
          redquired:true,
          ref:'Menu'
        },
        quantity:{
          type:Number,
          default:1
        },
        itemtotalprice:{
          type:Number,
        }
      }
    ],
    orderNo:{
        type:String,
        default:''
    },
    phone: {
      type: String,
      required: [true, 'Add Number it is important to contact you']
    },
    address: {
      type: String,
      required: [true, 'Add Address']
    },
    totalPrice: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;


