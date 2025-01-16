const Table = require("../model/tableModel"); // Assuming Table model is in the 'models' folder
const TableReservation = require("../model/tableReservationModel");
const { fileSizeFormatter } = require('../utils/fileUploads');
const couldinary=require('cloudinary').v2

// Create a new table
const addTable = async (req, res) => {

  const { tableId, name, type, capacity, area } = req.body;
  try {
      
       let fileData={};
       if(req.file){
        //save image to cloudinary
        let uploadFile;
        try {
          uploadFile=await couldinary.uploader.upload(req.file.path,{
              folder:"Menu Pizza",resource_type:'image'
          })
          
        } catch (error) {
          res.status(500)
          throw new Error('Images could not be uploaded')
        }
          fileData = {
              fileName:req.file.originalname,
              filePath:uploadFile.secure_url,
              fileType:req.file.type,
              fileSize: fileSizeFormatter(req.file.size,2)
          }
      }
      
    const newTable = new Table({
      tableId,
      name,
      type,
      capacity,
      area,
      image:Object.keys(fileData).length === 0 ? 'there is error' : fileData,
      reservations: []
    });

    await newTable.save();
    res.status(201).json({ message: 'Table added successfully', table: newTable });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an existing table by tableId
const updateTable = async (req, res) => {

  try {
    const { tableId } = req.params;
    const { name, type, capacity, area } = req.body;

    // Find the table by tableId
    const table = await Table.findOne({tableId});
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    let fileData={};
    
       if(req.file)
      {
       //save image to cloudinary
       let uploadFile;
       try {
         uploadFile=await couldinary.uploader.upload(req.file.path,{
             folder:"Menu Pizza",resource_type:'image'
         })
       } catch (error) {
         res.status(500)
         throw new Error('Images could not be uploaded')
       }
    
       fileData = {
        fileName:req.file.originalname,
        filePath:uploadFile.secure_url,
        fileType:req.file.type,
        fileSize: fileSizeFormatter(req.file.size,2)
    }
    
      }

      const updateData={
        name,
        type,
        capacity,
        area
      }

      if (Object.keys(fileData).length !== 0) {
        updateData.image = fileData; // Add the image only when `fileData` is valid
    }

     
  
    const updateTable=await Table.findOneAndUpdate({tableId:tableId},
      updateData,
    {
      new:true,
      runValidators:true
    })

    res.status(200).json({ message: 'Table updated successfully', updateTable });
  } catch (error) {
    res.status(500).json({ message: 'Error updating table', error });
  }
};

// Delete a table by tableId
const deleteTable = async (req, res) => {
  try {
    const { tableId } = req.params;

    // Find the table by tableId and delete it
    const table = await Table.findOneAndDelete({ tableId });
    if (!table) {
      return res.status(404).json({ message: 'Table not found' });
    }

    res.status(200).json({ message: 'Table deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting table', error });
  }
};



const getAvailTables=async (req, res) => {
  const { date, time, capacity } = req.query;

  try {
    // Convert the date from string to a Date object and remove time part
      // Normalize the date to ignore the time part

    // Find tables that have sufficient capacity and are not reserved at the selected date/time
    const availableTables = await Table.find({
      capacity: { $gte: capacity },  // Only tables with sufficient capacity
      reservations: { 
        $not: { 
          $elemMatch: { 
            date: date, 
            time: time 
          } 
        }
      }
    });

    if (availableTables.length === 0) {
      return res.status(200).json({ message: 'No available tables found for the selected date, time, and capacity.' });
    }

    res.status(200).json({ availableTables });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


const getTables= async (req,res)=>{

  const table=await Table.find();

  if(!table){
    res.status(400).json('Tables Not Found');
 }

 res.status(200).json({table})

 }

module.exports = { 
     addTable, 
     deleteTable, 
     updateTable,
     getAvailTables,
     getTables
    };

