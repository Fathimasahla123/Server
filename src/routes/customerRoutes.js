const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");
const {uploadMiddleware} = ("../config/cloudinaryConfig");

router.post("/register", authMiddleware,customerController.registerCustomer);
router.post("/login",customerController.loginCustomer);

router.put("/change-password", authMiddleware, customerController.changePassword);
router.put("/update-profile", authMiddleware, updateProfile);
router.get("/profile", authMiddleware, customerController.viewProfile);
router.post("/upload-profile", authMiddleware, uploadMiddleware.single("profileImage") ,customerController.uploadProfileImage);

