const express=require('express')
const protecter = require('../middleware/authMiddleware')
const { contactUs } = require('../controller/contactController')

const router=express.Router()

router.post('/',protecter,contactUs)


module.exports=router;