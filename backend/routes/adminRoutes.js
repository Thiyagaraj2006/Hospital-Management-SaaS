const express = require("express");
const router = express.Router();
const { getStats, getRecentActivity } = require("../controllers/adminController");
const { verifyToken, requireRole } = require("../middleware/auth");

router.get("/stats", verifyToken, requireRole("admin"), getStats);
router.get("/activity", verifyToken, requireRole("admin"), getRecentActivity);

module.exports = router;
