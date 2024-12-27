const express=require('express');
const protecter = require('../middleware/authMiddleware');
const { createReservation, getBookingTimes, getReservationsByUser, getAllReservations } = require('../controller/tableReservationController');

const router=express.Router();

router.post('/createreservation',protecter,createReservation);
router.post('/gettime',getBookingTimes);
router.get('/getReservationbyUser',protecter,getReservationsByUser);
router.get('/getAllreservations',getAllReservations);

module.exports=router;

