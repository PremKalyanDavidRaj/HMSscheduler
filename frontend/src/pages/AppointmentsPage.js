import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
} from "@mui/material";
import axios from "axios";

function AppointmentsPage() {
  const [doctorId, setDoctorId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [medicalCode, setMedicalCode] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [doctors, setDoctors] = useState([]);

  // Sample medical codes array
  const medicalCodes = [
    { code: "A00", description: "Cholera" },
    { code: "B01", description: "Varicella [chickenpox]" },
    { code: "C22", description: "Liver cell carcinoma" },
    { code: "D50", description: "Iron deficiency anemia" },
    { code: "E11", description: "Type 2 diabetes mellitus" },
    { code: "F32", description: "Major depressive disorder, single episode" },
    { code: "G40", description: "Epilepsy" },
    { code: "H25", description: "Age-related cataract" },
    { code: "I10", description: "Essential hypertension" },
    { code: "J45", description: "Asthma" },
    { code: "K35", description: "Acute appendicitis" },
    { code: "L40", description: "Psoriasis" },
    { code: "M16", description: "Osteoarthritis of hip" },
    { code: "N18", description: "Chronic kidney disease" },
    { code: "O24", description: "Diabetes mellitus in pregnancy" },
    { code: "P07", description: "Disorders related to short gestation and low birth weight" },
    { code: "Q20", description: "Congenital malformations of the heart" },
    { code: "R10", description: "Abdominal pain" },
    { code: "S72", description: "Fracture of femur" },
    { code: "T14", description: "Injury, unspecified" },
    { code: "U07", description: "COVID-19" },
    { code: "V71", description: "Observation and evaluation of mental health" },
    { code: "W00", description: "Fall on same level from slipping, tripping, and stumbling" },
    { code: "X71", description: "Intentional self-harm by hanging, strangulation, and suffocation" },
    { code: "Y93", description: "Activity, other" },
    { code: "Other", description: "Other medical condition" } 
 
  ];
  

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/doctors")
      .then((res) => setDoctors(res.data))
      .catch((err) => console.error("Error fetching doctors:", err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!dateTime) {
      alert("Please select a valid date and time");
      return;
    }

    const formData = new FormData();
    formData.append("doctor_id", doctorId);
    formData.append("date_time", dateTime);
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
        },
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
        <Typography variant="h4" align="center" gutterBottom>
          Book an Appointment
        </Typography>
        <form onSubmit={handleSubmit}>
          {/* Doctor Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="doctor-select-label">Select Doctor</InputLabel>
            <Select
              labelId="doctor-select-label"
              value={doctorId}
              onChange={(e) => setDoctorId(e.target.value)}
              required
            >
              {doctors.map((doc) => (
                <MenuItem key={doc.id} value={doc.id}>
                  {doc.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Date & Time Selection */}
          <TextField
            label="Date & Time"
            type="datetime-local"
            fullWidth
            margin="normal"
            variant="outlined"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
            required
            InputLabelProps={{ shrink: true }}
          />

          {/* Medical Code Selection */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="medical-code-select-label">Medical Code</InputLabel>
            <Select
              labelId="medical-code-select-label"
              value={medicalCode}
              onChange={(e) => setMedicalCode(e.target.value)}
              required
            >
              {medicalCodes.map((code) => (
                <MenuItem key={code.code} value={code.code}>
                  {code.code} - {code.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Description Input */}
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

          {/* File Upload */}
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

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            style={{ marginTop: "20px" }}
          >
            Book Appointment
          </Button>
        </form>
      </Paper>
    </Container>
  );
}

export default AppointmentsPage;
