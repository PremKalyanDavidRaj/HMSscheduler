const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // your email address
    pass: process.env.EMAIL_PASS, // your Gmail password or app-specific password
  },
});

transporter.sendMail({
  from: `"Test" <${process.env.EMAIL_USER}>`,
  to: "gaiprem451@gmail.com", // replace with an email you control
  subject: "Test Email",
  text: "Hello from Nodemailer",
}, (err, info) => {
  if (err) {
    console.error("Error sending test email:", err);
  } else {
    console.log("Test email sent successfully:", info.response);
  }
});
