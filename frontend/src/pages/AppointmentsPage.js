import React, { useState, useEffect } from "react";
import { Container, Typography, Paper, FormControl, InputLabel, Select, MenuItem, TextField, Button } from "@mui/material";
import axios from "axios";


function AppointmentsPage() {
  const [doctorId, setDoctorId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [medicalCode, setMedicalCode] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [doctors, setDoctors] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5001/api/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Sending date_time to backend:", dateTime); // 🛠️ Debug

    if (!dateTime) {
      alert("Please select a valid date and time");
      return;
    }

    const formData = new FormData();
    formData.append("doctor_id", doctorId);
    formData.append("date_time", dateTime); // 🧠 Should be a proper ISO format
    formData.append("medical_code", medicalCode);
    formData.append("description", description);
    if (file) {
      formData.append("file", file);
    }

    try {
      await axios.post("http://localhost:5001/api/appointments/book", formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        }
      });
      alert("Appointment booked successfully!");
      // Optional: reset form
      setDoctorId("");
      setDateTime("");
      setMedicalCode("");
      setDescription("");
      setFile(null);
    } catch (error) {
      console.error("Booking error:", error.response?.data || error.message);
      alert("Booking failed: " + (error.response?.data?.message || "Unknown error"));
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: "20px", marginTop: "50px" }}>
        <Typography variant="h4" align="center" gutterBottom>Book an Appointment</Typography>
        <form onSubmit={handleSubmit}>
          <FormControl fullWidth margin="normal">
            <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
            <Select
              labelId="doctor-select-label"
              value={doctorId}
              label="Select Doctor"
              onChange={(e) => setDoctorId(e.target.value)}
              required
            >
              {doctors.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>{doc.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Date & Time"
            type="datetime-local"
            fullWidth
            margin="normal"
            variant="outlined"
            value={dateTime} // Controlled input
            onChange={(e) => setDateTime(e.target.value)}
            required
            InputLabelProps={{ shrink: true }} //  Makes label show on filled date
          />
          <TextField 
            label="Medical Code" 
            fullWidth 
            margin="normal" 
            variant="outlined" 
            value={medicalCode}
            onChange={(e) => setMedicalCode(e.target.value)} 
            required 
          />
          <TextField 
            label="Description" 
            fullWidth 
            margin="normal" 
            variant="outlined" 
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)} 
            required 
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            style={{ marginTop: "20px" }}
          >
            Upload File
            <input
              type="file"
              hidden
              onChange={(e) => setFile(e.target.files[0])}
            />
          </Button>
          <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }}>
            Book Appointment
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default AppointmentsPage;
