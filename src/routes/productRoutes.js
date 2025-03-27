const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/upload-product", authMiddleware, adminController.uploadProduct);
router.get("/get-products", authMiddleware, adminController.getProducts);

module.exports = router;