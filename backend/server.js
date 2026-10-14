
const express = require("express");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middleware/authMiddleware");
const cors = require("cors");
require("dotenv").config();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("./config/db");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Home route
app.get("/", (req, res) => {
  res.send("Healthcare API is running");
});

// Test MySQL connection
app.get("/api/test-db", async (req, res) => {
  try {
    const [rows] = await db.query("SELECT 1 AS result");

    res.json({
      success: true,
      message: "MySQL connected successfully",
      data: rows,
    });
  } catch (error) {
    console.error("Database error:", error.message);

    res.status(500).json({
      success: false,
      message: "Database connection failed",
    });
  }
});

// Get doctors
app.get("/api/doctors", async (req, res) => {
  try {
    const [rows] = await db.execute(`
      SELECT
        id,
        name,
        specialty,
        experience,
        fee,
        rating,
        available
      FROM doctors
      ORDER BY id ASC
    `);

    res.json({
      success: true,
      doctors: rows,
    });
  } catch (error) {
    console.error("Fetch doctors error:", error.message);

    res.status(500).json({
      success: false,
      message: "Failed to fetch doctors.",
    });
  }
});

// Register patient
app.post("/api/patients/register", async (req, res) => {
  try {
    const { name, email, password } = req.body || {};

    if (!name?.trim() || !email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and password are required.",
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters long.",
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const [existingPatients] = await db.execute(
      "SELECT id FROM patients WHERE email = ?",
      [normalizedEmail]
    );

    if (existingPatients.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const [result] = await db.execute(
      `INSERT INTO patients (name, email, password_hash)
       VALUES (?, ?, ?)`,
      [name.trim(), normalizedEmail, passwordHash]
    );

    return res.status(201).json({
      success: true,
      message: "Patient registered successfully!",
      patientId: result.insertId,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message: "This email is already registered.",
      });
    }

    console.error("Registration error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Registration failed. Please try again.",
    });
  }
});

// Patient login
app.post("/api/patients/login", async (req, res) => {
  try {
    const { email, password } = req.body || {};

    if (!email?.trim() || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const [patients] = await db.execute(
      `SELECT id, name, email, password_hash
       FROM patients
       WHERE email = ?`,
      [email.trim().toLowerCase()]
    );

    if (patients.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const patient = patients[0];

    const isPasswordValid = await bcrypt.compare(
      password,
      patient.password_hash
    );

    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!process.env.JWT_SECRET) {
      console.error("JWT_SECRET is missing from backend .env");
      return res.status(500).json({
        success: false,
        message: "Server authentication configuration error.",
      });
    }

    const token = jwt.sign(
      {
        patientId: patient.id,
        email: patient.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    return res
      .cookie("patientToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 1000,
        path: "/",
      })
      .json({
        success: true,
        message: "Login successful!",
        patient: {
          id: patient.id,
          name: patient.name,
          email: patient.email,
        },
      });
  } catch (error) {
    console.error("Patient login error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Login failed. Please try again.",
    });
  }
});

// Book appointment (login required)

app.post("/api/appointments", authMiddleware, async (req, res) => {
  try {
   
    const patientId = req.patient.patientId;
    const {
      doctor_id,
      appointment_date,
      appointment_time,
      reason,
    } = req.body || {};

    // Step 1: Validate required appointment details
    if (!doctor_id || !appointment_date || !appointment_time) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required appointment details.",
      });
    }

    // Step 2: Get the logged-in patient's actual details
    const [patients] = await db.execute(
      "SELECT name, email FROM patients WHERE id = ?",
      [patientId]
    );

    if (patients.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Patient not found. Please register again.",
      });
    }

    const [doctors] = await db.execute(
      "SELECT id FROM doctors WHERE id = ?",
      [doctor_id]
    );

    if (doctors.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid doctor selected. Please choose a valid doctor.",
      });
    }

    const selectedDate = new Date(`${appointment_date}T00:00:00`);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (Number.isNaN(selectedDate.getTime()) || selectedDate < today){
      return res.status(400).json({
        success: false,
        message: "Please select today or a future date.",
      });
    }

    const appointmentDateTime = new Date(`${appointment_date}T${appointment_time}`);
    const currentDateTime = new Date();
    if(Number.isNaN(appointmentDateTime.getTime()) || appointmentDateTime <= currentDateTime) {
      return res.status(400).json({
        success: false,
        message: "Please select a future appointment date and time.",
      });
    }
    const patient = patients[0];

    // Step 3: Save the appointment using database patient details
    const sql = `
      INSERT INTO appointments
      (
        patient_id,
        doctor_id,
        patient_name,
        email,
        appointment_date,
        appointment_time,
        reason
      )
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      patientId,
      doctor_id,
      patient.name,
      patient.email,
      appointment_date,
      appointment_time,
      reason?.trim() || null,
    ];

    const [result] = await db.execute(sql, values);

    return res.status(201).json({
      success: true,
      message: "Appointment booked successfully!",
      appointmentId: result.insertId,
    });
  } catch (error) {
    console.error("Appointment booking error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to book appointment.",
    });
  }
});


// Get appointments for the logged-in patient
app.get("/api/appointments", authMiddleware, async (req, res) => {
  try {
    const patientId = req.patient.patientId;

    const [rows] = await db.execute(
      `SELECT
        appointments.id,
        appointments.patient_name,
        appointments.email,
        appointments.appointment_date,
        appointments.appointment_time,
        appointments.reason,
        doctors.name AS doctor_name,
        doctors.specialty AS doctor_specialty
      FROM appointments
      JOIN doctors
        ON appointments.doctor_id = doctors.id
      WHERE appointments.patient_id = ?
      ORDER BY appointments.id DESC`,
      [patientId]
    );

    return res.json({
      success: true,
      appointments: rows,
    });
  } catch (error) {
    console.error("Fetch appointments error:", error.message);

    return res.status(500).json({
      success: false,
      message: "Failed to fetch appointments.",
    });
  }
});


app.post("/api/patients/logout", (req, res) => {
  res.clearCookie("patientToken", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  return res.json({
    success: true,
    message: "Logged out successfully!",
  });
});

app.get("/api/patients/me", authMiddleware, (req, res) => {
  return res.json({
    success: true,
    patient: req.patient,
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
