import React from "react";
import { Container, Typography, Paper } from "@mui/material";

function HomePage() {
    return (
        <Container maxWidth="md">
            <Paper elevation={3} style={{ padding: "20px", marginTop: "50px", textAlign: "center" }}>
                <Typography variant="h3">Welcome to the Hospital Management System</Typography>
                <Typography variant="body1" style={{ marginTop: "20px" }}>
                    Please use the navigation to Register, Login, or access your dashboard.
                </Typography>
            </Paper>
        </Container>
    );
}

export default HomePage;
