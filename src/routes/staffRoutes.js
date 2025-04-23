const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const staffController = require("../controllers/staffController");
 
router.post("/staff-login", authMiddleware, staffController.loginStaff);

router.get("/view-orders", authMiddleware, staffController.getStaffOrders);
router.get("/received-feedback", authMiddleware, staffController.getStaffFeedback);

 module.exports = router;