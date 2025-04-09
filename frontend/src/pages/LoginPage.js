import React, { useState } from "react";
import { TextField, Button, Container, Typography, Paper } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5001/api/users/login", { email, password });
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data.user));
            
            //  Redirect based on the user's role
            const userRole = res.data.user.role;
            if (userRole === "doctor") {
                navigate("/doctor-dashboard");
            } else if (userRole === "admin") {
                navigate("/admin-dashboard");
            } else if (userRole === "patient") {
                navigate("/patient-dashboard"); //  Redirect patients to their dashboard
            } else {
                navigate("/"); // Default homepage
            }
        } catch (error) {
            console.error("Login error:", error.response?.data || error.message);
            alert("Login failed: " + (error.response?.data?.message || "Please try again"));
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} style={{ padding: "20px", marginTop: "50px" }}>
                <Typography variant="h4" align="center" gutterBottom>Login</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField 
                        label="Email" 
                        fullWidth 
                        margin="normal" 
                        variant="outlined" 
                        onChange={(e) => setEmail(e.target.value)} 
                        required 
                    />
                    <TextField 
                        label="Password" 
                        type="password" 
                        fullWidth 
                        margin="normal" 
                        variant="outlined" 
                        onChange={(e) => setPassword(e.target.value)} 
                        required 
                    />
                    <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: "20px" }}>
                        Login
                    </Button>
                </form>
            </Paper>
        </Container>
    );
}

export default LoginPage;
