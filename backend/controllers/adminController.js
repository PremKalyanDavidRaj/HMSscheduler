const pool = require("../config/db");

// Fetch All Users (Admins Only)
exports.getAllUsers = (req, res) => {
    pool.query("SELECT id, name, email, role FROM users", (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ message: "Error fetching users" });
        }
        res.status(200).json(results);
    });
};

// Fetch All Appointments (Admins Only)
exports.getAllAppointments = (req, res) => {
    const query = `
        SELECT a.id, a.date_time, a.medical_code, a.description, a.status, 
               p.name AS patient_name, p.email AS patient_email,
               d.name AS doctor_name, d.email AS doctor_email
        FROM appointments a
        JOIN users p ON a.patient_id = p.id
        JOIN users d ON a.doctor_id = d.id
    `;

    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching appointments:", err);
            return res.status(500).json({ message: "Error fetching appointments" });
        }
        res.status(200).json(results);
    });
};
