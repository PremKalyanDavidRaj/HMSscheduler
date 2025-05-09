
# Hospital Management System Scheduler (HMSS)

A full-stack hospital management system built with **React**, **Node.js**, **Express**, and **MySQL**, enabling secure role-based appointment scheduling, treatment tracking, and patient education using ICD-10 medical code integration.

## Features

- **Secure Authentication** using JWT
- **Role-Based Dashboards**: Patient, Doctor, and Admin
- **Appointment Scheduling** with file upload
- **ICD-10 Medical Code Lookup** (includes image & description)
- **Medical Codes Info Page** (with external learning links)
- **Email Notifications** using Nodemailer & Gmail SMTP
- **Prevents Doctor Double Booking** at the same time slot
- **Admin Overview of Patients by Medical Code**

## Project Structure

```
HOSPITAL-MANAGEMENT-SYSTEM/
├── backend/
│   ├── config/               # Database connection config
│   ├── controllers/          # Logic for users, appointments, admin
│   ├── middleware/           # Auth and request validation
│   ├── routes/               # API endpoints (users, admin, ICD, etc.)
│   ├── uploads/              # File uploads
│   ├── utils/                # Helper services (e.g., email)
│   ├── testEmail.js          # Test email sender
│   ├── server.js             # App entry point
│   └── .env                  # Environment variables
│
├── database/
│   └── schema.sql            # MySQL schema file
│
├── frontend/
│   ├── public/
│   │   └── assets/           # Medical condition images and Static ICD or JSON datasets
│   ├── src/
│   │   ├── components/       # Reusable UI components
│   │   ├── pages/            # Login, Register, Dashboards
│   │   ├── App.js            # Main app router
│   │   └── index.js          # Entry point
│
├── .gitignore
├── README.md
└── package.json
```

## 🛠️ Tech Stack

| Layer        | Technology                |
|--------------|---------------------------|
| Frontend     | React, Material UI        |
| Backend      | Node.js, Express          |
| Database     | MySQL                     |
| Auth         | JWT (JSON Web Token)      |
| Mail Service | NodeMailer + Gmail SMTP   |
| AI Lookup    | OpenAI GPT-3.5 (for ICD)  |

## How to Run the Project

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env   # Set your DB, Gmail, OpenAI creds
node server.js         # or use nodemon
```

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

### Database Setup

- Import the SQL file:

```sql
mysql -u root -p < database/schema.sql
```

## Environment Variables (`.env`)

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=hospital_db
PORT=5001
JWT_SECRET=your_jwt_secret
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
OPENAI_API_KEY=your_openai_key
```

## Author

**Prem Kalyan David Raj**  
Master’s Student @ UNH  
Email: PremKalyanDavidRaj.Gai@unh.edu

