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


app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://medicaresaas-hospital-management.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan(process.env.NODE_ENV === "production" ? "combined" : "dev"));

app.get("/", (req, res) => {
  res.json({ success: true, message: "MediCare SaaS API is running" });
});
app.get("/api/health", (req, res) => res.json({ success: true, status: "ok" }));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api", appointmentRoutes); // exposes /api/doctors and /api/appointments/*
app.use("/api/patients", patientRoutes);
app.use("/api/doctors", doctorRoutes); // doctor-specific dashboard/notes endpoints
app.use("/api/admin", adminRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reception", receptionRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`MediCare SaaS API listening on port ${PORT}`);
});

module.exports = app;
