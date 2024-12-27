const Table = require("../model/tableModel");
const { fileSizeFormatter } = require('../utils/fileUploads');
const couldinary=require('cloudinary').v2;


// Add Table
const addTable = async (req, res) => {
  try {
    const { name, capacity, tableDescription } = req.body;

    // Validate required fields
    if (!name || !capacity || !tableDescription) {
      return res.status(400).json({ message: 'All fields are required' }); // Send response and exit
    }

    let fileData = {};
    if (req.file) {
      // Save image to Cloudinary
      try {
        const uploadFile = await couldinary.uploader.upload(req.file.path, {
          folder: "Table",
          resource_type: 'image',
        });

        fileData = {
          fileName: req.file.originalname,
          filePath: uploadFile.secure_url,
          fileType: req.file.mimetype, // Fixed to use `mimetype`
          fileSize: fileSizeFormatter(req.file.size, 2),
        };
      } catch (error) {
        return res.status(500).json({ message: 'Image could not be uploaded', error: error.message }); // Send response and exit
      }
    }

    // Create new table
    const table = new Table({
      name,
      capacity,
      tableDescription,
      image: Object.keys(fileData).length === 0 ? null : fileData,
    });

    // Save table to database
    await table.save();

    // Send success response
    return res.status(201).json({ message: 'Table added successfully', table });
  } catch (error) {
    // Handle errors
    return res.status(500).json({ message: 'Error adding table', error: error.message });
  }
};



//delete Table
 const deleteTable=async (req, res) => {

    try {
      const table = await Table.findById(req.params.id);
      if (!table) {
        res.status(404);
        throw new Error('Table not found');
      }
  
      await table.remove();
      res.json({ message: 'Table deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting table', error: error.message });
    }
  };

  // Update Table

const updateTable=async (req, res) => {

      const { name, capacity, tableDescription} = req.body;
      const {id}=req.params;
  
      const table = await Table.findById(id);

      if (!table) {
        res.status(404);
        throw new Error('Table not found');
      }


      //handle Upload Image
    let fileData={};

   if(req.file)
  {
   //save image to cloudinary
   let uploadFile;

   try {
     uploadFile=await couldinary.uploader.upload(req.file.path,{
         folder:"Table",resource_type:'image'
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

   
  const UpdateTable=await Table.findByIdAndUpdate({_id:id},{
    name,
    capacity,
    tableDescription,
    image:Object.keys(fileData).length === 0 ? table?.image : fileData,
  },{
    new:true,
    runValidators:true
  })

  res.status(201).json(UpdateTable)

}

//get all Tables
const getTables=async (req, res) => {
    try {
        const tables = await Table.find();
        res.json(tables);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching tables', error: error.message });
      }
}

//get single table 
const getTable=async (req, res) => {
    try {
        const table = await Table.findById(req.params.id);
        if (!table) {
          res.status(404);
          throw new Error('Table not found');
        }
        res.json(table);
      } catch (error) {
        res.status(500).json({ message: 'Error fetching table', error: error.message });
      }
}


module.exports = { 
     addTable, 
     deleteTable, 
     updateTable, 
     getTables, 
     getTable 
    };

