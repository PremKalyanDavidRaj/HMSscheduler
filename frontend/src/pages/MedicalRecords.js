import React, { useEffect, useState } from "react";
import { Container, Typography, List, ListItem, Paper, TextField, Button } from "@mui/material";
import axios from "axios";
import { useParams } from "react-router-dom";

function MedicalRecords() {
    const { patient_id } = useParams();
    const [records, setRecords] = useState([]);
    const [form, setForm] = useState({ diagnosis: "", prescription: "" });

    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const res = await axios.get(`http://localhost:5000/api/doctors/medical-records/${patient_id}`, {
                    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
                });
                setRecords(res.data);
            } catch (error) {
                console.error("Error fetching medical records:", error);
            }
        };

        fetchRecords();
    }, [patient_id]);

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/doctors/medical-records", {
                patient_id, 
                diagnosis: form.diagnosis,
                prescription: form.prescription
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
            });

            alert("Medical record updated!");
        } catch (error) {
            console.error("Error updating medical record:", error);
        }
    };

    return (
        <Container maxWidth="md">
            <Paper elevation={3} style={{ padding: "20px", marginTop: "50px" }}>
                <Typography variant="h4" align="center" gutterBottom>Medical Records</Typography>
                <List>
                    {records.map((record, index) => (
                        <ListItem key={index}>
                            <Typography variant="body1">
                                <strong>Date:</strong> {record.date} | <strong>Diagnosis:</strong> {record.diagnosis} | <strong>Prescription:</strong> {record.prescription}
                            </Typography>
                        </ListItem>
                    ))}
                </List>

                <Typography variant="h6" style={{ marginTop: "20px" }}>Update Medical Record</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField label="Diagnosis" name="diagnosis" fullWidth margin="normal" onChange={handleChange} required />
                    <TextField label="Prescription" name="prescription" fullWidth margin="normal" onChange={handleChange} required />
                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }}>
                        Submit
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default MedicalRecords;
