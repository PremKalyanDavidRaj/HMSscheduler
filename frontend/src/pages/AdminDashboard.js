import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import axios from "axios";

function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
    fetchAppointments();
  }, []);

  // Fetch All Users
  const fetchUsers = () => {
    axios.get("http://localhost:5001/api/admin/users", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
    })
    .then((res) => {
      setUsers(res.data);
      setLoading(false);
    })
    .catch((err) => {
      console.error("Error fetching users:", err);
      setLoading(false);
    });
  };

  // Fetch All Appointments
  const fetchAppointments = () => {
    axios.get("http://localhost:5001/api/admin/appointments", {
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

  return (
    <Container maxWidth="lg">
      <Paper style={{ marginTop: 20, padding: 20 }}>
        <Typography variant="h4" gutterBottom>
          Admin Dashboard
        </Typography>

        {/*  All Users Table */}
        <Typography variant="h5" gutterBottom>All Users</Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/*  All Appointments Table */}
        <Typography variant="h5" gutterBottom style={{ marginTop: "30px" }}>
          All Appointments
        </Typography>
        <TableContainer>
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
      </Paper>
    </Container>
  );
}

export default AdminDashboard;
