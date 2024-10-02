const asyncHandler=require('express-async-handler');
const Menu = require('../model/menuModel');
const { fileSizeFormatter } = require('../utils/fileUploads');
const couldinary=require('cloudinary').v2


//create Menu
 const createMenu=asyncHandler( async (req,res)=>{

    const {name,ingredients,price,category}= req.body;

     //handle Upload Image

 let fileData={};
 if(req.file){

  //save image to cloudinary
  let uploadFile;
  try {
    uploadFile=await couldinary.uploader.upload(req.file.path,{
        folder:"Menu Pizza",resource_type:'image'
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

 const menu=await Menu.create({
    price,
    ingredients,
    name,
    image:Object.keys(fileData).length === 0 ? 'there is error' : fileData,
    category
 })

 res.status(201).json(menu)

 } )


 //get all Menu

 const getMenu=asyncHandler( async (req,res)=>{
    try {
      
      const getItems=await Menu.find();

      if(!getItems){
        res.status(404).json('Menu Not Found')
      }

      res.status(200).json(getItems)

    } catch (error) {
      res.status(500).json(error.message)
    }
 } )

//delete the menu item

const deleteMenuItem=asyncHandler( async (req,res)=>{
     const {id}=req.params;
     const menuItem=await Menu.findById(id)
     
     if(!menuItem){
      res.status(404).json('Item not Found')
     }

     await menuItem.deleteOne()

     res.status(200).json('item Deleted Successfully')
})

//get item by id

const getItemById=asyncHandler( async (req,res)=>{
   const {id}=req.params;

   const pizza=await Menu.findById(id)
   if(!pizza){
    res.status(404).json('Order not Found')
   }

   res.status(200).json(pizza)
   
} )


//updated the menu
  

 
 module.exports={
    createMenu,
    getMenu,
    deleteMenuItem,
    getItemById
 }