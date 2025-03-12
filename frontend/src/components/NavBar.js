import React from "react";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

const NavBar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")); // Get user from localStorage
  const role = user?.role; // Extract user role

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Hospital Management System
        </Typography>

        {/* Show options based on role */}
        {role === "doctor" && (
          <Button color="inherit" component={Link} to="/doctor-dashboard">
            Doctor Dashboard
          </Button>
        )}
        {role === "patient" && (
          <>
            <Button color="inherit" component={Link} to="/appointments">
              Book Appointment
            </Button>
            <Button color="inherit" component={Link} to="/patient-dashboard">
              My Appointments
            </Button>
          </>
        )}
        {role === "admin" && (
          <Button color="inherit" component={Link} to="/admin-dashboard">
            Admin Dashboard
          </Button>
        )}

        {/* Show Register/Login if No User is Logged In */}
        {!role ? (
          <>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
          </>
        ) : (
          // Show Logout Button if User is Logged In
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
