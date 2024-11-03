const express=require('express')
const { upload } = require('../utils/fileUploads')
const {createMenu, getMenu, deleteMenuItem, getItemById, updateMenu} = require('../controller/pizzaController')


 const router=express.Router()

 router.post('/menu',upload.single("image"),createMenu)
 router.get('/menu',getMenu)
 router.delete('/menu/:id',deleteMenuItem)
 router.get('/getItem/:id',getItemById)
 router.patch('/updateMenu/:id',upload.single("image"),updateMenu)

 module.exports=router;