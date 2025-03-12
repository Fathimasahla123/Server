// routes/staffRoutes.js
const express = require("express");
const { authenticate, authorize } = require("../middleware/authMiddleware");
const { getStaffDashboard } = require("../controllers/staffController");

const router = express.Router();

// Staff dashboard route
router.get("/dashboard", authenticate, authorize("Staff"), getStaffDashboard);

module.exports = router;