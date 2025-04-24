import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import AppointmentsPage from "./pages/AppointmentsPage"; // For patients
import DoctorDashboard from "./pages/DoctorDashboard";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAppointments from "./pages/admin/AdminAppointments";
import PatientsByMedicalCode from "./pages/admin/PatientsByMedicalCode";
import PatientDashboard from "./pages/PatientDashboard";
import MedicalCodesPage from "./pages/MedicalCodesPage";

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
                <Route path="/patient-dashboard" element={<PatientDashboard />} />
                <Route path="/medical-codes" element={<MedicalCodesPage />} />

                {/* Admin Pages */}
                <Route path="/admin-dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<AdminUsers />} />
                <Route path="/admin/appointments" element={<AdminAppointments />} />
                <Route path="/admin/patients-by-code" element={<PatientsByMedicalCode />} />
            </Routes>
        </Router>
    );
}

export default App;
