const express=require('express');
const { createDrinks, getAllDrinks, deleteDrink } = require('../controller/drinksControllers');
const { upload } = require('../utils/fileUploads');

const router=express.Router()


router.post('/createdrink',upload.single("image"),createDrinks)
router.get('/getdrinks',getAllDrinks)
router.delete('/deletedrink/:id',deleteDrink)


module.exports=router;