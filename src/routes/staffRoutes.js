const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const staffController = require("../controllers/staffController");
 

router.get("/customers", authMiddleware, staffController.viewStaffCustomer);
router.get("/feedbacks", authMiddleware, staffController.viewStaffFeddbacks);

 module.exports = router;