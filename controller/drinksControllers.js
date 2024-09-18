const asyncHandler=require('express-async-handler')
const  { fileSizeFormatter } = require('../utils/fileUploads');
const Drinks = require('../model/drinksModel');
const couldinary=require('cloudinary').v2

const createDrinks=asyncHandler(async (req,res)=>{

    const {namedrink,unitprice,company}= req.body;
     
    if (!namedrink || !unitprice ) {
        return res.status(400).json({ error: 'Fill all required fields' });
    }


    //handle Upload Image

 let fileData={};
 if(req.file){

     //save image to cloudinary
     let uploadFile;

     try {
         uploadFile=await couldinary.uploader.upload(req.file.path,{
         folder:"Drinks Menu",resource_type:'image'
      })

      } catch (error) {
        res.status(500)
        throw new Error('Images could not be uploaded')
      }

     fileData = {
        fileName:req.file.originalname,
        filePath:uploadFile.secure_url,
        fileType:req.file.type,
        fileSize: fileSizeFormatter(req.file.size,2)
     }

}


 const drink=await Drinks.create({
    namedrink,
    unitprice,
    image:Object.keys(fileData).length === 0 ? 'there is error' : fileData,
    company
 })

 await drink.save();

 res.status(201).json(drink)

})


//get all Drinks

const getAllDrinks=asyncHandler(async (req,res)=>{
    const drinks=await Drinks.find();

    if(!drinks){
       return res.status(404).json({error:'Drinks Not Found'})
    }


    res.status(200).json(drinks)
})

//delete the drinks

const deleteDrink=asyncHandler( async (req,res)=>{
     const {id}=req.params;
     const drink=await Drinks.findById(id)

     if(!drink){
        return res.status(404).json({error:'Drinks not Found'})
     }

     await drink.deleteOne()

     res.status(200).json('Drinks  delete sucessfully')

} )


module.exports={
    createDrinks,
    getAllDrinks,
    deleteDrink
}