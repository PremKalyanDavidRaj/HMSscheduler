const express = require("express");
const { getAllUsers, getAllAppointments } = require("../controllers/adminController");
const authenticate = require("../middleware/authMiddleware");

const router = express.Router();

//  Route to get all users (Admin Only)
router.get("/users", authenticate, getAllUsers);

//  Route to get all appointments (Admin Only)
router.get("/appointments", authenticate, getAllAppointments);

module.exports = router;
