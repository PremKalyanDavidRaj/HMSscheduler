const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../config/db");

// Register User
exports.registerUser = async (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10); // Hash password before storing

    let assignedRole = role;
    if (email === "admin@example.com") { // Only this email gets admin role
        assignedRole = "admin";
    }

    pool.query(
        "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, assignedRole],
        (err, result) => {
            if (err) {
                console.error("Error registering user:", err);
                return res.status(500).json({ message: "Error registering user" });
            }
            res.status(201).json({ message: "User registered successfully", userId: result.insertId });
        }
    );
};

// Login User
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    pool.query("SELECT * FROM users WHERE email = ?", [email], async (err, result) => {
        if (err || result.length === 0) return res.status(401).json({ message: "Invalid credentials" });

        const user = result[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user.id, role: user.role, user_id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.status(200).json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
    });
};
