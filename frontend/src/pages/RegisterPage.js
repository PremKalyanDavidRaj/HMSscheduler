import React, { useState } from "react";
import { Container, Paper, Typography, TextField, Button, Select, MenuItem } from "@mui/material";
import axios from "axios";

function RegisterPage() {
    const [user, setUser] = useState({ name: "", email: "", password: "", role: "patient" });

    const handleChange = (e) => {
        setUser({ ...user, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5001/api/users/register", user);
            alert("Registration successful. You can now log in.");
        } catch (error) {
            console.error(error);
            alert("Registration failed. Please try again.");
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: "20px", marginTop: "50px" }}>
                <Typography variant="h4" align="center" gutterBottom>Register</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField 
                        name="name" 
                        label="Name" 
                        fullWidth 
                        margin="normal" 
                        onChange={handleChange} 
                        required 
                    />
                    <TextField 
                        name="email" 
                        label="Email" 
                        fullWidth 
                        margin="normal" 
                        onChange={handleChange} 
                        required 
                    />
                    <TextField 
                        name="password" 
                        label="Password" 
                        type="password" 
                        fullWidth 
                        margin="normal" 
                        onChange={handleChange} 
                        required 
                    />

                    {/* ✅ Role Selection Dropdown */}
                    <Select
                        name="role"
                        value={user.role}
                        onChange={handleChange}
                        fullWidth
                        displayEmpty
                        style={{ marginTop: "10px" }}
                    >
                        <MenuItem value="patient">Patient</MenuItem>
                        <MenuItem value="doctor">Doctor</MenuItem>
                        <MenuItem value="admin">Admin</MenuItem>
                    </Select>

                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }}>
                        Register
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default RegisterPage;
