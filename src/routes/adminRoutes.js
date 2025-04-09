const express = require("express");
const router = express.Router();
const  authMiddleware = require("../middleware/authMiddleware");
const adminController = require("../controllers/adminController");

router.get('/adminDashboard', authMiddleware,adminController.adminDashboard);
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
router.post("/add-order", authMiddleware, adminController.addOrder);
router.get("/view-order/:id",authMiddleware, adminController.viewOrder);
router.get("/list-orders",authMiddleware, adminController.listOrders);
router.put("/update-order/:id", authMiddleware,adminController.updateOrder);
router.delete("/delete-order/:id",authMiddleware, adminController.deleteOrder);

//Reservation endpoints
router.post("/add-reservation",authMiddleware, adminController.addReservation);
router.get("/view-reservation/:id",authMiddleware, adminController.viewReservation);
router.get("/list-reservations", authMiddleware, adminController.listReservations);
router.put("/update-reservation/:id", authMiddleware,  adminController.updateReservation);
router.delete("/delete-reservation/:id",authMiddleware,  adminController.deleteReservation);



router.get("/get-available-options", authMiddleware, adminController.getAvailableOptions);
router.get("/get-customers", authMiddleware, adminController.getCustomers);
router.get("/get-orders", authMiddleware,  adminController.getOrders);
router.get("/get-staffs",authMiddleware, adminController.getStaffs);
module.exports = router;
