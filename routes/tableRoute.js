const express = require('express');
const { upload } = require('../utils/fileUploads');
const authAdmin = require('../middleware/authAdmin');
const { addTable, deleteTable, updateTable, getTables, getTable } = require('../controller/tableController');

const router = express.Router();

router.post('/addTable',upload.single('image'),addTable);
router.delete('/deleteTable/:id',authAdmin,deleteTable);
router.patch('/updateTable/:id',authAdmin,upload.single('image'),updateTable);
router.get('/getTables',getTables);
router.get('/getTable/:id',getTable);


module.exports = router;
