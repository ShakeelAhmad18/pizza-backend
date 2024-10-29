const asyncHandler =require('express-async-handler');
const Order = require('../model/orderModel');
const axios=require('axios')
  const formData = require('form-data');
  const Mailgun = require('mailgun.js');
  const mailgun = new Mailgun(formData);
  const mg = mailgun.client({username: 'delicious Pizza', key: process.env.MAILGUN_API_KEY || '1d544788b383d19ebc4edf19de2bccec-3724298e-60105952'});


const createOrder=asyncHandler( async (req,res)=>{
     
    const {phone,address,totalPrice,items,orderNo}=req.body;

    if( !phone || !address || !totalPrice || !Array.isArray(items) ){
        res.status(401)
        throw new Error('Fill All Fields')
    }
    
    const order=await Order.create({
        userId:req.user.id,
        orderNo,
        items,
        phone,
        address,
        totalPrice
    })

    res.status(201).json(order)

} )


//get all orders
const getOrders=asyncHandler( async (req,res)=>{

    const orders=await Order.find({userId:req.user.id}).populate({
        path:'items.itemId',
        select:"name image price"
    }).sort('-createdAt')

    res.status(200).json(orders)
} )

//get order by id
const getOrder=asyncHandler( async (req,res)=>{
    
   const {id}=req.params;
   const order=await Order.findById(id).populate({
    path:'items.itemId',
    select:'name image.filePath'
   });

   if(!order){
    res.status(404).json('Order not found')
   }
   
   if(order.userId.toString() !== req.user.id){
         res.status(403).json('Unathorized User');
   }


   res.status(200).json(order)

})


//delete the orderId
const delelteOrder=asyncHandler( async (req,res)=>{
     const {id}=req.params;
     //find the order
     const order=await Order.findById(id)
     if(!order){
        res.status(404).json('Order not Found')
     }
     
     if(order.userId.toString() !== req.user.id){
         res.status(403).json('Unathorized User')
     }
      

    await order.deleteOne();
    res.status(200).json('Order Successfully Deleted')
} )


//track order by order number

const trackOrder=asyncHandler( async (req,res)=>{

   const {orderNo}=req.body;
   const order=await Order.findOne({orderNo}).populate({
    path:'items.itemId',
    select:'name image.filePath'
   })

   if(!order){
     return res.status(404).json({error:'Order not Found'})
   }

   res.status(200).json(order);

})

  

const sendEmail = asyncHandler(async (req, res) => {
  const {user_name, user_email, items, totalPrice,orderNo} = req.body;

  if(!Array.isArray(items)){
    console.log('items is not array')
  }

  const apiKey = 'mlsn.5ae9b50004bc60bd2a09a98d501563d6b46c03db2415a4267ee09a6f4687739c';
  
  const itemsList = items.map(item => {
    return `
      <p>Item: <span class="highlight">${item.name}</span></p>
      <p>Quantity: <span class="highlight">${item.quantity}</span></p>
      <p>Total Price for Item: <span class="highlight">$${item.totalPrice}</span></p>
      <img src="${item.image?.filePath}" alt="${item.name}" style="width: 100px;" />
      <hr />
    `;
  }).join('');

  const emailData = {
    from: {
      email: 'no-reply@trial-jy7zpl9r2r3l5vx6.mlsender.net', 
      name: 'Pizza Delicious',
    },
    to: [
      {
        email: user_email,
        name: user_name,
      },
    ],
    subject: 'Order Confirmation',
    html: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        .card {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          color: #063970;
          max-width: 500px;
          margin: 20px auto;
          background-color: #fff;
          border-radius: 12px;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
          overflow: hidden;
          border: 1px solid #e0e0e0;
        }
        .card-header, .card-footer {
          background-color: #f8f8f8;
          padding: 20px;
          text-align: center;
          border-bottom: 1px solid #e0e0e0;
        }
        .card-header h1 {
          color: #4A90E2;
          font-size: 24px;
          margin-bottom: 10px;
        }
        .card-body {
          padding: 20px;
        }
        .card-body h2 {
          color: #76b5c5;
          font-size: 20px;
          margin-bottom: 20px;
          border-bottom: 2px solid #4A90E2;
          padding-bottom: 10px;
        }
        .card-body p {
          font-size: 16px;
          line-height: 1.6;
          margin-bottom: 15px;
        }
        .highlight {
          font-weight: bold;
          color: #063970;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="card-header">
          <h1>Dear ${user_name}</h1>
          <h2>Order No:${orderNo}</h2>
          <p>Thank you for your order at The Pizza Delicious!</p>
        </div>
        <div class="card-body">
          <h1>Your order has been confirmed</h1>
          <h2>Order Details</h2>
          ${itemsList}
          <p>Pay on Delivery: <span class="highlight">$${totalPrice}</span></p>
        </div>
        <div class="card-footer">
          <p>Best regards,<br>The Pizza Delicious Team</p>
        </div>
      </div>
    </body>
    </html>
    `,
  };

  
  try {
    const response = await axios.post('https://api.mailersend.com/v1/email', emailData, {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    res.status(200).send('Order confirmation email sent successfully');
  } catch (error) {
    res.status(500).send(`Failed to send email: ${JSON.stringify(error.response ? error.response.data : error.message)}`);
  }
});

  
module.exports={
    createOrder,
    getOrders,
    getOrder,
    delelteOrder,
    trackOrder,
    sendEmail
}

