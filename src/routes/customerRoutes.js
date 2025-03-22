const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customerController");
const authMiddleware = require("../middleware/authMiddleware");
const {uploadMiddleware} = ("../config/cloudinaryConfig");

router.post("/register", authMiddleware,customerController.registerCustomer);
router.post("/login",customerController.loginCustomer);
