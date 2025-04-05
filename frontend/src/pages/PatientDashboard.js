import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";

function PatientDashboard() {
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

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

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete this appointment?")) {
          axios
            .delete(`http://localhost:5001/api/appointments/delete/${id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            })
            .then(() => {
              alert("Appointment deleted successfully.");
              fetchAppointments(); // refresh data
            })
            .catch((err) => {
              console.error("Delete error:", err.response?.data || err.message);
              alert("Failed to delete appointment.");
            });
        }
      };
      

    return (
        <Container maxWidth="lg">
          <Paper style={{ marginTop: 20, padding: 20 }}>
            <Typography variant="h4" gutterBottom>
              My Appointments
            </Typography>
      
            {loading ? (
              <Typography>Loading...</Typography>
            ) : appointments.length > 0 ? (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Doctor Name</TableCell>
                      <TableCell>Date & Time</TableCell>
                      <TableCell>Medical Code</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Treatment / Follow-Up</TableCell>
                      <TableCell>Actions</TableCell> {}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {appointments.map((appt) => (
                      <TableRow key={appt.id}>
                        <TableCell>{appt.doctor_name || "Not Available"}</TableCell>
                        <TableCell>{new Date(appt.date_time).toLocaleString()}</TableCell>
                        <TableCell>{appt.medical_code}</TableCell>
                        <TableCell>{appt.description}</TableCell>
                        <TableCell>{appt.status}</TableCell>
                        <TableCell>{appt.treatment || "No follow-up yet"}</TableCell>
                        <TableCell>
                          <button
                            style={{
                              backgroundColor: "red",
                              color: "white",
                              padding: "6px 12px",
                              border: "none",
                              borderRadius: "4px",
                              cursor: "pointer",
                            }}
                            onClick={() => handleDelete(appt.id)}
                          >
                            Delete
                          </button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            ) : (
              <Typography>No appointments found.</Typography>
            )}
          </Paper>
        </Container>
      );
      
}

export default PatientDashboard;
