const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");
const {uploadMiddleware} = require("../config/cloudinaryConfig");


router.post("/customer-login",authMiddleware, customerController.loginCustomer);

router.put("/change-password", authMiddleware, customerController.changePassword);
router.put("/update-profile", authMiddleware, customerController.updateProfile);
router.get("/profile/:id", authMiddleware, customerController.viewProfile);
router.post("/upload-profile", authMiddleware, uploadMiddleware.single("profileImage") ,customerController.uploadProfileImage);

router.post("/submit-feedback", authMiddleware, customerController.submitFeedback);
router.get("/order-details/:id", authMiddleware, customerController.viewOrderDetails);
router.get("/feedback", authMiddleware, customerController.viewMyFeedback);

module.exports = router;

