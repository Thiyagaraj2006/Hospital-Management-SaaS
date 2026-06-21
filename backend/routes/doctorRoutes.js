const express = require("express");
const router = express.Router();
const {
  getMyDashboard,
  getMyPatients,
  addConsultationNote,
  getConsultationNotes,
  markAppointmentCompleted,
} = require("../controllers/doctorController");
const { verifyToken, requireRole } = require("../middleware/auth");

router.get("/me/dashboard", verifyToken, requireRole("doctor"), getMyDashboard);
router.get("/me/patients", verifyToken, requireRole("doctor"), getMyPatients);

router.post("/appointments/:appointmentId/notes", verifyToken, requireRole("doctor"), addConsultationNote);
router.get("/appointments/:appointmentId/notes", verifyToken, requireRole("doctor", "admin"), getConsultationNotes);
router.patch("/appointments/:appointmentId/complete", verifyToken, requireRole("doctor"), markAppointmentCompleted);

module.exports = router;
