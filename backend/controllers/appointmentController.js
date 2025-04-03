const pool = require("../config/db");
const sendEmail = require("../utils/emailService");

//  Book an Appointment with Additional Medical Details and File Upload
//  Book an Appointment with Additional Medical Details and File Upload
exports.bookAppointment = (req, res) => {
    const { doctor_id, date_time, medical_code, description } = req.body;
    const patient_id = req.user.id;
    const file_path = req.file ? req.file.path : null;

    console.log("Received date_time from frontend:", date_time);

    //  Check if date_time is valid
    const parsedDate = new Date(date_time);
    if (!date_time || isNaN(parsedDate.getTime())) {
        console.error("Invalid date_time:", date_time);
        return res.status(400).json({ message: "Invalid or missing date_time" });
    }

    //  Format the date to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
    const formattedDateTime = parsedDate.toISOString().slice(0, 19).replace("T", " ");
    console.log("Formatted DateTime:", formattedDateTime);

    //  Check if an appointment already exists at the same time for the doctor
    const checkQuery = `SELECT COUNT(*) AS count FROM appointments WHERE doctor_id = ? AND date_time = ?`;

    pool.query(checkQuery, [doctor_id, formattedDateTime], (err, result) => {
        if (err) {
            console.error("Error checking existing appointments:", err);
            return res.status(500).json({ message: "Error checking existing appointments" });
        }

        if (result[0].count > 0) {
            return res.status(400).json({ message: "Appointment time is already booked. Please choose a different time." });
        }

        //  Insert appointment
        const insertQuery = `
            INSERT INTO appointments (patient_id, doctor_id, date_time, status, medical_code, description, file_path)
            VALUES (?, ?, ?, 'scheduled', ?, ?, ?)
        `;

        pool.query(insertQuery, [patient_id, doctor_id, formattedDateTime, medical_code, description, file_path], (err, result) => {
            if (err) {
                console.error("Error inserting appointment:", err);
                return res.status(500).json({ message: "Error booking appointment" });
            }

            //  Fetch emails
            const emailQuery = `
                SELECT p.email AS patient_email, p.name AS patient_name, d.email AS doctor_email 
                FROM users p
                JOIN users d ON d.id = ? 
                WHERE p.id = ?
            `;

            pool.query(emailQuery, [doctor_id, patient_id], (err, results) => {
                if (err) {
                    console.error("Error fetching emails:", err);
                    return res.status(500).json({ message: "Error booking appointment" });
                }

                if (results.length === 0) {
                    return res.status(404).json({ message: "User emails not found" });
                }

                const { patient_email, patient_name, doctor_email } = results[0];

                // Send emails
                sendEmail(patient_email, "Appointment Confirmation", `Hello ${patient_name}, Your appointment is booked on ${formattedDateTime}.`);
                sendEmail(doctor_email, "New Appointment Assigned", `You have a new appointment with ${patient_name} on ${formattedDateTime}.`);

                return res.status(201).json({ message: "Appointment booked successfully, email sent" });
            });
        });
    });
};


// Get Appointments for a User (Doctor or Patient)
exports.getAppointments = (req, res) => {
    const { role, id } = req.user;
    let query = "";

    if (role === "doctor") {
        // Fetch patient details along with appointment information for doctors
        query = `
            SELECT a.id, a.patient_id, a.doctor_id, a.date_time, a.medical_code, a.description, 
                   a.file_path, a.status, a.treatment, u.name AS patient_name, u.email AS patient_email
            FROM appointments a
            JOIN users u ON a.patient_id = u.id
            WHERE a.doctor_id = ?
        `;
    } else {
        // Fetch doctor details and treatment updates when a patient views their own appointments
        query = `
            SELECT a.id, a.date_time, a.medical_code, a.description, 
                   a.file_path, a.status, a.treatment, d.name AS doctor_name, d.email AS doctor_email
            FROM appointments a
            JOIN users d ON a.doctor_id = d.id
            WHERE a.patient_id = ?
        `;
    }

    pool.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error retrieving appointments:", err);
            return res.status(500).json({ message: "Error retrieving appointments" });
        }

        res.status(200).json(results);
    });
};


// Doctors Can Update Treatment (Follow-up)
exports.updateTreatment = (req, res) => {
    const { id } = req.params; // Appointment ID
    const { treatment } = req.body;
    const doctor_id = req.user.id; // Doctor's ID from authentication token

    console.log(`Update Treatment Request for Appointment ID: ${id} by Doctor ID: ${doctor_id}`);

    if (!treatment || treatment.trim() === "") {
        return res.status(400).json({ message: "Treatment field cannot be empty" });
    }

    // Check if the doctor owns this appointment
    const checkQuery = `SELECT * FROM appointments WHERE id = ? AND doctor_id = ?`;

    pool.query(checkQuery, [id, doctor_id], (err, results) => {
        if (err) {
            console.error("Error checking appointment ownership:", err);
            return res.status(500).json({ message: "Error checking appointment ownership" });
        }

        if (results.length === 0) {
            console.log("Unauthorized update attempt: Doctor does not own this appointment.");
            return res.status(403).json({ message: "Unauthorized: You can only update your own patients' treatment." });
        }

        // Update the treatment for the appointment
        const updateQuery = `UPDATE appointments SET treatment = ? WHERE id = ?`;

        pool.query(updateQuery, [treatment, id], (err, result) => {
            if (err) {
                console.error("Error updating treatment:", err);
                return res.status(500).json({ message: "Error updating treatment" });
            }

            console.log("Treatment Updated Successfully:", result);
            res.status(200).json({ message: "Treatment updated successfully" });
        });
    });
};


// Cancel Appointment with Email Notification
exports.cancelAppointment = (req, res) => {
    const { id } = req.params;
    const query = `
        SELECT p.email AS patient_email, p.name AS patient_name, d.email AS doctor_email, d.name AS doctor_name, a.date_time 
        FROM appointments a 
        JOIN users p ON a.patient_id = p.id
        JOIN users d ON a.doctor_id = d.id
        WHERE a.id = ?
    `;
    
    pool.query(query, [id], (err, results) => {
        if (err) {
            console.error("Error fetching appointment for cancellation:", err);
            return res.status(500).json({ message: "Error canceling appointment" });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: "Appointment not found" });
        }

        const { patient_email, patient_name, doctor_email, doctor_name, date_time } = results[0];

        // Send email notifications
        sendEmail(patient_email, "Appointment Canceled", `Hello ${patient_name}, your appointment on ${date_time} has been canceled.`);
        sendEmail(doctor_email, "Appointment Canceled", `Hello Dr. ${doctor_name}, your appointment with ${patient_name} on ${date_time} has been canceled.`);

        pool.query("UPDATE appointments SET status = 'canceled' WHERE id = ?", [id], (err, result) => {
            if (err) {
                console.error("Error updating appointment status:", err);
                return res.status(500).json({ message: "Error canceling appointment" });
            }
            res.status(200).json({ message: "Appointment canceled, email sent" });
        });
    });
};

exports.deleteAppointment = (req, res) => {
    const { id } = req.params;
    const { id: userId, role } = req.user;

    // Build role-based query
    let checkQuery = "";
    if (role === "doctor") {
        checkQuery = `SELECT * FROM appointments WHERE id = ? AND doctor_id = ?`;
    } else if (role === "patient") {
        checkQuery = `SELECT * FROM appointments WHERE id = ? AND patient_id = ?`;
    } else {
        return res.status(403).json({ message: "Unauthorized role" });
    }

    pool.query(checkQuery, [id, userId], (err, results) => {
        if (err) {
            console.error("Error checking appointment ownership:", err);
            return res.status(500).json({ message: "Error checking appointment ownership" });
        }

        if (results.length === 0) {
            console.log("Unauthorized delete attempt: User does not own this appointment.");
            return res.status(403).json({ message: "Unauthorized: You can only delete your own appointments." });
        }

        const deleteQuery = `DELETE FROM appointments WHERE id = ?`;
        pool.query(deleteQuery, [id], (err, result) => {
            if (err) {
                console.error("Error deleting appointment:", err);
                return res.status(500).json({ message: "Error deleting appointment" });
            }

            console.log("Appointment Deleted Successfully:", result);
            res.status(200).json({ message: "Appointment deleted successfully" });
        });
    });
};


