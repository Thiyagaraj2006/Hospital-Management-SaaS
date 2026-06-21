const express = require("express");
const router = express.Router();
const {
  listDoctors,
  bookAppointment,
  getPatientAppointments,
  getDoctorAppointments,
  updateAppointmentStatus,
} = require("../controllers/appointmentController");
const { verifyToken, requireRole } = require("../middleware/auth");

// Public: browse doctors for booking
router.get("/doctors", listDoctors);

// Patient books an appointment
router.post("/appointments/book", verifyToken, requireRole("patient"), bookAppointment);

// Patient's own appointment history
router.get("/appointments/patient/:id", verifyToken, requireRole("patient", "admin", "reception"), getPatientAppointments);

// Doctor's appointment list
router.get("/appointments/doctor/:id", verifyToken, requireRole("doctor", "admin", "reception"), getDoctorAppointments);

// Doctor/Admin/Reception updates appointment status
router.patch("/appointments/:id/status", verifyToken, requireRole("doctor", "admin", "reception"), updateAppointmentStatus);

module.exports = router;
