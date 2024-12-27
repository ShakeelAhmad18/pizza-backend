const TableReservation = require("../model/tableReservationModel");

//create Reservation
const createReservation = async (req, res) => {
    try {
        const { tableId, phone, bookingDate, bookingTime, message, totalPeople, orderNo } = req.body;

        const reservation = new TableReservation({
            userId:req.user.id,
            tableId,
            phone,
            bookingDate,
            bookingTime,
            message,
            totalPeople,
            orderNo,
        });

        await reservation.save();
        res.status(201).json({ message: 'Reservation created successfully', reservation });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};



//get time in spoecific Date for specific table

const getBookingTimes = async (req, res) => {
    try {
        const { tableId, date } = req.body;

        const reservations = await TableReservation.find({
            tableId,
            bookingDate: new Date(date),
        }).select('bookingTime');

        if(reservations.length === 0){
            return res.status(200).json({ bookingTimes: [] });
        }

        const bookingTimes = reservations.map(reservation => reservation.bookingTime);

        res.status(200).json({ bookingTimes });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//update Reservation
const updateReservationStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const reservation = await TableReservation.findById(id);
        if (!reservation) {
            return res.status(404).json({ message: 'Reservation not found' });
        }

        reservation.status = status;
        await reservation.save();

        res.status(200).json({ message: 'Reservation status updated successfully', reservation });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};


//get all Reservations
const getAllReservations = async (req, res) => {

    try {
        const reservations = await TableReservation.find().populate('tableId','name image').populate('userId', 'name email');
        res.status(200).json({ reservations });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


//get all Reservations by user
const getReservationsByUser = async (req, res) => {

    try {
         
        const reservations = await TableReservation.find({ userId:req.user.id }).populate('tableId','name image bookingTime bookingDate').sort('-createdAt');
        res.status(200).json({ reservations });

    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}


module.exports={
    createReservation,
    getBookingTimes,
    updateReservationStatus,
    getAllReservations,
    getReservationsByUser
}