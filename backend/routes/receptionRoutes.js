const express = require("express");
const router = express.Router();
const { registerWalkIn, getTodayTokens } = require("../controllers/receptionController");
const { verifyToken, requireRole } = require("../middleware/auth");

router.post("/walkin", verifyToken, requireRole("reception", "admin"), registerWalkIn);
router.get("/tokens/today", verifyToken, requireRole("reception", "admin", "doctor"), getTodayTokens);

module.exports = router;
