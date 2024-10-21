const asyncHandler=require('express-async-handler');
const Table = require('../model/tableModel');


const createTableBooking=asyncHandler( async (req,res)=>{
    const {name,email,phone,date,Time,persons}=req.body;

    if(!name || !email || !phone || !date || !Time || !persons){
        return res.status(401).json('Fill All Fields')
    }

   const table=await Table.create({
     name,
     email,
     phone,
     date,
     Time,
     persons
   })

   res.status(201).json(table)


} )

 const getBookingsWithDate=asyncHandler( async (req,res)=>{

    
   
 } )

 
 module.exports={
  createTableBooking
 }