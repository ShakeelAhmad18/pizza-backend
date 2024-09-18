const express=require('express')
const protecter = require('../middleware/authMiddleware')
const { createOrder, getOrders, delelteOrder, getOrder, trackOrder, sendEmail } = require('../controller/orderController')

const router=express.Router()

router.post('/createOrder',protecter,createOrder)
router.get('/getOrders',protecter,getOrders)
router.delete('/orderdelete/:id',protecter,delelteOrder)
router.get('/getorder/:id',protecter,getOrder)
router.post('/trackorder',trackOrder)
router.post('/sendEmail',sendEmail)

module.exports=router;