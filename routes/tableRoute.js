const express=require('express');
const { createTableBooking, getBookingsWithDate } = require('../controller/tableController');

const router=express.Router()

router.post('/createTableBooking',createTableBooking)
router.post('/getBookingwithTime',getBookingsWithDate)

module.exports=router;

