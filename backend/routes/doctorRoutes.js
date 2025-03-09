const express = require("express");
const { getDoctorPatients, getMedicalRecords, getAllDoctors, addMedicalRecord } = require("../controllers/doctorController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

// Route to get all doctors.
// Remove 'authenticate' here if you want it to be publicly accessible.
router.get("/", getAllDoctors);

// Other protected routes:
router.get("/patients", authenticate, getDoctorPatients);
router.get("/medical-records/:patient_id", authenticate, getMedicalRecords);
router.post("/medical-records", authenticate, addMedicalRecord);

module.exports = router;
