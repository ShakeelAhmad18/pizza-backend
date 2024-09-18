const asyncHandler=require('express-async-handler')
const menu = require('../model/menuModel')


const pizzaDetails=asyncHandler( async (req,res,next)=>{

    const [pizzaId]=req.body
    console.log(pizzaId)

   if(!pizzaId){
    res.status(404)
    throw new Error('pizza id not Found')
   }

   const pizza=await menu.findById(pizzaId)

   if(!pizza){
    res.status(404)
    throw new Error('Pizza Not Found')
   }

   req.pizza=pizza;
   next();

} )


module.exports=pizzaDetails;