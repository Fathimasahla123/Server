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

//Order endpoints
router.post("/add-order", authMiddleware, customerController.addOrder);
router.get("/view-order/:id",authMiddleware, customerController.viewOrder);
router.get("/list-orders",authMiddleware, customerController.listOrders);
router.put("/update-order/:id", authMiddleware, customerController.updateOrder);
router.delete("/delete-order/:id",authMiddleware, customerController.deleteOrder);

//Reservation endpoints
router.post("/add-reservation",authMiddleware, customerController.addReservation);
router.get("/view-reservation/:id",authMiddleware, customerController.viewReservation);
router.get("/list-reservations", authMiddleware, customerController.listReservations);
router.put("/update-reservation/:id", authMiddleware,  customerController.updateReservation);
router.delete("/delete-reservation/:id",authMiddleware,  customerController.deleteReservation);

router.post("/submit-feedback", authMiddleware, customerController.submitFeedback);
router.get("/order-details/:id", authMiddleware, customerController.viewOrderDetails);
router.get("/feedback", authMiddleware, customerController.viewMyFeedback);

module.exports = router;

