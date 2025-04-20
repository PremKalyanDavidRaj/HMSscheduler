import React, { useState } from "react";
import {
  Container, Typography, Paper, FormControl, InputLabel,
  Select, MenuItem, Table, TableHead, TableRow, TableCell, TableBody
} from "@mui/material";
import axios from "axios";

const medicalCodes = [
  "A00", "B01", "C22", "D50", "E11", "F20", "G40",
  "H10", "I10", "J45", "K35", "L20", "M54", "N39",
  "O80", "P07", "Q21", "R10", "S06", "T78", "Z00", "Other"
];

const PatientsByMedicalCode = () => {
  const [selectedCode, setSelectedCode] = useState("");
  const [patients, setPatients] = useState([]);

  const fetchPatients = async (code) => {
    try {
      const res = await axios.get(`http://localhost:5001/api/admin/patients-by-medical-code?code=${code}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setPatients(res.data);
    } catch (err) {
      console.error("Error fetching patients:", err);
      setPatients([]);
    }
  };

  const handleChange = (e) => {
    const code = e.target.value;
    setSelectedCode(code);
    fetchPatients(code);
  };

  return (
    <Container maxWidth="md">
      <Paper style={{ marginTop: 30, padding: 20 }}>
        <Typography variant="h5" gutterBottom>
          Patients by Medical Code
        </Typography>

        <FormControl fullWidth margin="normal">
          <InputLabel>Select Medical Code</InputLabel>
          <Select
            value={selectedCode}
            label="Select Medical Code"
            onChange={handleChange}
          >
            <MenuItem value=""><em>None</em></MenuItem>
            {medicalCodes.map((code) => (
              <MenuItem key={code} value={code}>{code}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {selectedCode && patients.length > 0 && (
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Patient Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Medical Code</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {patients.map((p, index) => (
                <TableRow key={index}>
                  <TableCell>{p.patient_name}</TableCell>
                  <TableCell>{p.patient_email}</TableCell>
                  <TableCell>{p.medical_code}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}

        {selectedCode && patients.length === 0 && (
          <Typography>No patients found for {selectedCode}.</Typography>
        )}
      </Paper>
    </Container>
  );
};

export default PatientsByMedicalCode;
