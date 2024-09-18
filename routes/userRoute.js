const express=require('express');
const { registerUser, loginUser, logoutUser, loginStatus, getUser } = require('../controller/userController');
const protecter = require('../middleware/authMiddleware');

const router=express.Router();

router.post('/registerUser',registerUser)
router.post('/loginUser',loginUser)
router.get('/logout',logoutUser)
router.get('/loginStatus',loginStatus)
router.get('/getUser',protecter,getUser)

module.exports=router;

