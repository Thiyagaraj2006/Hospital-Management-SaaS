const express = require("express");
const router = express.Router();
const { getMyProfile, updateMyProfile } = require("../controllers/patientController");
const { verifyToken, requireRole } = require("../middleware/auth");

router.get("/me", verifyToken, requireRole("patient"), getMyProfile);
router.put("/me", verifyToken, requireRole("patient"), updateMyProfile);

module.exports = router;
