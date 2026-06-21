const express = require("express");
const router = express.Router();
const { listNotifications, markAsRead, markAllAsRead } = require("../controllers/notificationController");
const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, listNotifications);
router.patch("/:id/read", verifyToken, markAsRead);
router.patch("/read-all", verifyToken, markAllAsRead);

module.exports = router;
