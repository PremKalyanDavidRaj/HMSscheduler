import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, TextField, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import axios from "axios";

function DoctorDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [treatment, setTreatment] = useState("");
    const [open, setOpen] = useState(false);

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = () => {
        axios.get("http://localhost:5001/api/appointments/my-appointments", {
            headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
        .then((res) => {
            setAppointments(res.data);
            setLoading(false);
        })
        .catch((err) => {
            console.error("Error fetching appointments:", err);
            setLoading(false);
        });
    };

    //  Open Treatment Dialog
    const handleOpen = (appointment) => {
        setSelectedAppointment(appointment);
        setTreatment(appointment.treatment || ""); // Pre-fill if treatment exists
        setOpen(true);
    };

    // Close Dialog
    const handleClose = () => {
        setOpen(false);
        setSelectedAppointment(null);
    };

    //  Submit Treatment Update
    const handleUpdateTreatment = () => {
        if (!selectedAppointment) return;
    
        axios.put(`http://localhost:5001/api/appointments/update-treatment/${selectedAppointment.id}`, 
            { treatment: treatment.trim() },  // ✅ Ensure no empty values
            { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        )
        .then((res) => {
            console.log("Treatment update response:", res.data);
            alert("Treatment updated successfully!");
            fetchAppointments(); // Refresh data
            handleClose();
        })
        .catch((err) => {
            console.error("Error updating treatment:", err.response ? err.response.data : err.message);
            alert("Failed to update treatment.");
        });
    };
    

    // Delete Appointment
const handleDelete = (appointmentId) => {
    if (window.confirm("Are you sure you want to delete this appointment?")) {
        axios
            .delete(`http://localhost:5001/api/appointments/delete/${appointmentId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then((res) => {
                alert("Appointment deleted successfully.");
                fetchAppointments(); // Refresh table
            })
            .catch((err) => {
                console.error("Error deleting appointment:", err.response?.data || err.message);
                alert("Failed to delete appointment.");
            });
    }
};

return (
    <Container maxWidth="lg">
        <Paper style={{ marginTop: 20, padding: 20 }}>
            <Typography variant="h4" gutterBottom>
                Doctor Dashboard
            </Typography>

            {loading ? (
                <Typography>Loading...</Typography>
            ) : (
                <TableContainer>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>Patient Name</TableCell>
                                <TableCell>Date & Time</TableCell>
                                <TableCell>Medical Code</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Status</TableCell>
                                <TableCell>Treatment</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {appointments.map((appt) => (
                                <TableRow key={appt.id}>
                                    <TableCell>{appt.patient_name}</TableCell>
                                    <TableCell>{new Date(appt.date_time).toLocaleString()}</TableCell>
                                    <TableCell>{appt.medical_code}</TableCell>
                                    <TableCell>{appt.description}</TableCell>
                                    <TableCell>{appt.status}</TableCell>
                                    <TableCell>{appt.treatment || "No treatment yet"}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            style={{ marginRight: "8px" }}
                                            onClick={() => handleOpen(appt)}
                                        >
                                            Follow-Up
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="error"
                                            onClick={() => handleDelete(appt.id)}
                                        >
                                            Delete
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Treatment Update Modal */}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>Update Treatment</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Treatment"
                        fullWidth
                        multiline
                        rows={6}
                        style={{ minHeight: "120px" }}
                        value={treatment}
                        onChange={(e) => setTreatment(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="secondary">
                        Cancel
                    </Button>
                    <Button onClick={handleUpdateTreatment} color="primary">
                        Update
                    </Button>
                </DialogActions>
            </Dialog>
        </Paper>
    </Container>
);
}
export default DoctorDashboard;
