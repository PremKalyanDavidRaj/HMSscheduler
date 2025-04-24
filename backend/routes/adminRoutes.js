const express = require("express");
const {
    getAllUsers,
    getAllAppointments,
    getPatientsByMedicalCode
} = require("../controllers/adminController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/users", authenticate, getAllUsers);
router.get("/appointments", authenticate, getAllAppointments);
router.get("/patients-by-medical-code", authenticate, getPatientsByMedicalCode); // 

module.exports = router;
