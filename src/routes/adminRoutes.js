const express = require("express");
const router = express.Router();
const  authMiddleware = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

//router.get('/adminDashboard', authMiddleware,adminController.adminDashboard);
//Customer endpoints;
router.post("/add-user", authMiddleware, adminController.addUser);
router.get("/view-user/:id",authMiddleware,adminController.viewUser);
router.get("/list-users",authMiddleware, adminController.listUsers);
router.put("/update-user/:id",authMiddleware, adminController.updateUser);
router.delete("/delete-user/:id",authMiddleware, adminController.deleteUser);

//Staff endpoints
router.post("/add-staff",authMiddleware, adminController.addStaff);
router.get("/view-staff/:id",authMiddleware, adminController.viewStaff);
router.get("/list-staffs",authMiddleware, adminController.listStaffs);
router.put("/update-staff/:id",authMiddleware,adminController.updateStaff);
router.delete("/delete-staff/:id",authMiddleware, adminController.deleteStaff);

//Order endpoints
 router.get("/list-orders",authMiddleware, adminController.listOrders);

 //Reservation endpoints
router.get("/list-reservations", authMiddleware, adminController.listReservations);
router.get("/list-feedbacks", authMiddleware, adminController.listFeedbacks);


router.get("/get-available-options", authMiddleware, adminController.getAvailableOptions);
router.get("/get-customers", authMiddleware, adminController.getCustomers);
router.get("/get-orders", authMiddleware,  adminController.getOrders);

module.exports = router;
