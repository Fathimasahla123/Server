const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const uploadController = require("../controllers/uploadController")
const authMiddleware = require("../middleware/authMiddleware");
const {upload} = require("../config/cloudinaryConfig");

router.post("/upload", authMiddleware, upload.single("image"), uploadController.uploadImage);
router.post("/upload-multiple", authMiddleware, upload.array("images", 5), uploadController.uploadMultipleImages);


router.post("/upload-product", authMiddleware, adminController.uploadProduct);
router.get("/get-products", authMiddleware, adminController.getProducts);
router.put("/update-product/:id", authMiddleware, adminController.updateProduct);
router.delete("/delete-product/:id", authMiddleware, adminController.deleteProduct);


module.exports = router;
