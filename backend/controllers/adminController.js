const pool = require("../config/db");

// Fetch All Users
exports.getAllUsers = (req, res) => {
    pool.query("SELECT id, name, email, role FROM users", (err, results) => {
        if (err) {
            console.error("Error fetching users:", err);
            return res.status(500).json({ message: "Error fetching users" });
        }
        res.status(200).json(results);
    });
};

// Fetch All Appointments
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
//  Get Patients by Medical Code (with query param ?code=A00)
exports.getPatientsByMedicalCode = (req, res) => {
    const { code } = req.query;

    if (!code) {
        return res.status(400).json({ message: "Medical code is required" });
    }

    const query = `
        SELECT u.name AS patient_name, u.email AS patient_email, a.medical_code
        FROM appointments a
        JOIN users u ON a.patient_id = u.id
        WHERE TRIM(a.medical_code) = ?
    `;

    pool.query(query, [code], (err, results) => {
        if (err) {
            console.error("Error fetching grouped patients:", err);
            return res.status(500).json({ message: "Error fetching grouped patients" });
        }

        res.status(200).json(results);
    });
};