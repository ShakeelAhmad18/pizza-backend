const express=require('express')
const { upload } = require('../utils/fileUploads')
const {createMenu, getMenu, deleteMenuItem, getItemById} = require('../controller/pizzaController')


 const router=express.Router()

 router.post('/menu',upload.single("image"),createMenu)
 router.get('/menu',getMenu)
 router.delete('/menu/:id',deleteMenuItem)
 router.get('/getItem/:id',getItemById)

 module.exports=router;