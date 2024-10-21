const express=require('express');
const { createTableBooking } = require('../controller/tableController');

const router=express.Router()

router.post('/createTableBooking',createTableBooking)

module.exports=router;

