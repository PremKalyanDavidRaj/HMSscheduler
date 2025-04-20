import React from "react";
import { Container, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md" style={{ marginTop: 40 }}>
      <Typography variant="h4" gutterBottom>
        Admin Dashboard
      </Typography>
      <Stack spacing={2}>
        <Button variant="contained" onClick={() => navigate("/admin/users")}>View All Users</Button>
        <Button variant="contained" onClick={() => navigate("/admin/appointments")}>View All Appointments</Button>
        <Button variant="contained" onClick={() => navigate("/admin/patients-by-code")}>Patients by Medical Code</Button>
      </Stack>
    </Container>
  );
};

export default AdminDashboard;