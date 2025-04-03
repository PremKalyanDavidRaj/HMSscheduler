const express = require("express");
const multer = require("multer");
const {
    bookAppointment, 
    getAppointments, 
    cancelAppointment, 
    deleteAppointment,
    updateTreatment
} = require("../controllers/appointmentController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

//  Setup multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + "-" + file.originalname);
    },
});
const upload = multer({ storage });

// Route to book an appointment (with file upload and fields)
router.post("/book", authenticate, upload.single("file"), bookAppointment);

// Route to get appointments (doctor or patient)
router.get("/my-appointments", authenticate, getAppointments);

// Route to cancel an appointment
router.delete("/cancel/:id", authenticate, cancelAppointment);

// Route to delete an appointment (Doctor only)
router.delete("/delete/:id", authenticate, deleteAppointment);

// Route to update treatment (Follow-up)
router.put("/update-treatment/:id", authenticate, updateTreatment);

module.exports = router;
