import React, { useEffect, useState } from "react";
import { Container, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import axios from "axios";

const AdminAppointments = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/admin/appointments", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => setAppointments(res.data))
    .catch((err) => console.error("Error fetching appointments:", err));
  }, []);

  return (
    <Container maxWidth="lg">
      <Typography variant="h5" gutterBottom>All Appointments</Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Patient Name</TableCell>
              <TableCell>Doctor Name</TableCell>
              <TableCell>Date & Time</TableCell>
              <TableCell>Medical Code</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {appointments.map((appt) => (
              <TableRow key={appt.id}>
                <TableCell>{appt.patient_name}</TableCell>
                <TableCell>{appt.doctor_name}</TableCell>
                <TableCell>{new Date(appt.date_time).toLocaleString()}</TableCell>
                <TableCell>{appt.medical_code}</TableCell>
                <TableCell>{appt.description}</TableCell>
                <TableCell>{appt.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default AdminAppointments;
