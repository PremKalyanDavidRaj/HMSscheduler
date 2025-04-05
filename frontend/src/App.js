import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AppointmentsPage from "./pages/AppointmentsPage"; // for patients
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PatientDashboard from "./pages/PatientDashboard"; //  Import the new Patient Dashboard

function App() {
    return (
        <Router>
            <NavBar />
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/appointments" element={<AppointmentsPage />} />
                <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/patient-dashboard" element={<PatientDashboard />} /> 
            </Routes>
        </Router>
    );
}

export default App;
