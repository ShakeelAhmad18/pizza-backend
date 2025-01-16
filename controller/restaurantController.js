const Settings = require("../model/settingModel");
const TimeSlot = require("../model/TimeSlotModel");


const addTimeSlot = async (req, res) => {

  try {
    // Fetch the admin settings from the database
    const settings = await Settings.findOne();

    if (!settings) {
      return res.status(404).send({ message: "Settings not found." });
    }

    const { openingTime, closingTime, interval } = settings;

    // Convert opening and closing times to Date objects
    const openDate = new Date(`1970-01-01T${convertTo24HourFormat(openingTime)}:00`);
    const closeDate = new Date(`1970-01-01T${convertTo24HourFormat(closingTime)}:00`);
    const intervalMinutes = Number(interval);

    if (isNaN(intervalMinutes)) {
      return res.status(400).send({ message: "Invalid interval in settings." });
    }

    if (openDate >= closeDate) {
      return res.status(400).send({ message: "Opening time must be earlier than closing time." });
    }

    const today = new Date().toISOString().split("T")[0];
    let timeSlots = [];

    // Generate time slots based on settings
    for (
      let currentTime = new Date(openDate);
      currentTime < closeDate;
      currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes)
    ) {
      timeSlots.push({
        time: currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: today,
        available: true,
      });
    }

    // Delete expired time slots (yesterday's slots)
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayDate = yesterday.toISOString().split("T")[0];
    await TimeSlot.deleteMany({ date: yesterdayDate });

    // Save new slots for today
    await TimeSlot.insertMany(timeSlots);

    res.status(200).send({ message: "Time slots updated successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error generating time slots." });
  }
};

// Convert time from 12-hour to 24-hour format
const convertTo24HourFormat = (time) => {
  const [hourMin, modifier] = time.split(" ");
  let [hours, minutes] = hourMin.split(":").map(Number);
  if (modifier.toLowerCase() === "pm" && hours < 12) hours += 12;
  if (modifier.toLowerCase() === "am" && hours === 12) hours = 0;
  return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
};




// Generate slots for the next day
const generateNextDaySlots = async () => {
  try {
    // Fetch settings
    const settings = await Settings.findOne();
    if (!settings) {
      console.error("Settings not found.");
      return;
    }

    const { openingTime, closingTime, interval } = settings;

    const openDate = new Date(`1970-01-01T${convertTo24HourFormat(openingTime)}:00`);
    const closeDate = new Date(`1970-01-01T${convertTo24HourFormat(closingTime)}:00`);
    const intervalMinutes = Number(interval);

    if (openDate >= closeDate) {
      console.error("Invalid opening or closing time in settings.");
      return;
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowDate = tomorrow.toISOString().split("T")[0];

    let timeSlots = [];

    for (
      let currentTime = new Date(openDate);
      currentTime < closeDate;
      currentTime.setMinutes(currentTime.getMinutes() + intervalMinutes)
    ) {
      timeSlots.push({
        time: currentTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        date: tomorrowDate,
        available: true,
      });
    }

    // Save slots for the next day
    await TimeSlot.insertMany(timeSlots);
    console.log("Next day's time slots generated successfully.");
  } catch (error) {
    console.error("Error generating next day's time slots:", error);
  }
};




module.exports = {
  addTimeSlot,
  generateNextDaySlots,
};
