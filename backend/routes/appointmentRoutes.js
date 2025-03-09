const express = require("express");
const { 
    bookAppointment, 
    getAppointments, 
    cancelAppointment, 
    deleteAppointment,  // ✅ Ensure this is correctly imported
    updateTreatment     // ✅ Ensure this is imported if used
} = require("../controllers/appointmentController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Route to book an appointment
router.post("/book", authenticate, bookAppointment);

// Route to get appointments (doctor or patient)
router.get("/my-appointments", authenticate, getAppointments);

//  Route to cancel an appointment
router.delete("/cancel/:id", authenticate, cancelAppointment);

//  Route to delete an appointment (Doctor only)
router.delete("/delete/:id", authenticate, deleteAppointment); 

//  Route to update treatment (Follow-up)
router.put("/update-treatment/:id", authenticate, updateTreatment); 

module.exports = router;
