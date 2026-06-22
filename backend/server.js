require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const authRoutes = require("./routes/authRoutes");
const appointmentRoutes = require("./routes/appointmentRoutes");
const patientRoutes = require("./routes/patientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");
const adminRoutes = require("./routes/adminRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const receptionRoutes = require("./routes/receptionRoutes");
const { notFound, errorHandler } = require("./middleware/errorHandler");

const app = express();

// CORS Configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://medicaresaas-hospital-management.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware
app.use(express.json());
app.use(
  morgan(process.env.NODE_ENV === "production" ? "combined" : "dev")
);

// Test Routes
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "MediCare SaaS API is running",
  });
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "ok",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api", appointmentRoutes);
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reception", receptionRoutes);

// Error Handling
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`MediCare SaaS API listening on port ${PORT}`);
});

module.exports = app;