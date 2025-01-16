const mongoose=require('mongoose')


const reservationSchema = new mongoose.Schema({
    tableId: {
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Table', 
      required: true 
    },
    date: {
      type: String, // Store as YYYY-MM-DD format
      required: true
    },
    time: {
      type: String, // Store time in HH:MM format
      required: true
    },
    numPeople: {
      type: Number,
      required: true
    },
    customerName: {
      type: String,
      required: true
    },
    contactInfo: {
      type: String,
      required: true
    }
  });
  
  const TableReservation = mongoose.model('Reservation', reservationSchema);
  module.exports=TableReservation;