const pool = require("../config/db");

// Get Patients Assigned to a Doctor
exports.getDoctorPatients = (req, res) => {
    const { user_id } = req.user;
    pool.query(
        `SELECT DISTINCT u.id, u.name, u.email 
         FROM users u 
         JOIN appointments a ON u.id = a.patient_id 
         WHERE a.doctor_id = ?`,
        [user_id],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.status(200).json(results);
        }
    );
};

// Get Medical Records of a Patient
exports.getMedicalRecords = (req, res) => {
    const { patient_id } = req.params;
    const { user_id } = req.user;
    pool.query(
        `SELECT * FROM medical_records WHERE patient_id = ? AND doctor_id = ?`,
        [patient_id, user_id],
        (err, results) => {
            if (err) return res.status(500).json(err);
            res.status(200).json(results);
        }
    );
};

// Get all doctors
exports.getAllDoctors = (req, res) => {
    pool.query("SELECT id, name FROM users WHERE role = 'doctor'", (err, results) => {
        if (err) {
            console.error("Error retrieving doctors:", err);
            return res.status(500).json({ message: "Error retrieving doctors" });
        }
        res.status(200).json(results);
    });
};

// Add or Update Medical Records
exports.addMedicalRecord = (req, res) => {
    const { patient_id, diagnosis, prescription } = req.body;
    const { user_id } = req.user;
    pool.query(
        `INSERT INTO medical_records (patient_id, doctor_id, diagnosis, prescription, date) 
         VALUES (?, ?, ?, ?, CURDATE()) 
         ON DUPLICATE KEY UPDATE diagnosis = VALUES(diagnosis), prescription = VALUES(prescription)`,
        [patient_id, user_id, diagnosis, prescription],
        (err, result) => {
            if (err) return res.status(500).json(err);
            res.status(200).json({ message: "Medical record updated" });
        }
    );
};
