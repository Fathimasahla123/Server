const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

//Customer endpoints
router.post("/add-user", adminController.addUser);
router.get("/view-user/:id", adminController.viewUser);
router.get("/list-users/:id", adminController.listUsers);
router.put("/update-user/:id", adminController.updateUser);
router.delete("/delete-user/:id", adminController.deleteUser);

//Staff endpoints
router.post("/add-staff", adminController.addStaff);
router.get("/view-staff/:id", adminController.viewStaff);
router.get("/list-staffs/:id", adminController.listStaffs);
router.put("/update-staff/:id", adminController.updateStaff);
router.delete("/delete-staff/:id", adminController.deleteStaff);

//Order endpoints
router.post("/add-order", adminController.addOrder);
router.get("/view-order/:id", adminController.viewOrder);
router.get("/list-orders/:id", adminController.listOrders);
router.put("/update-order/:id",  adminController.updateOrder);
router.delete("/delete-order/:id", adminController.deleteOrder);

//Reservation endpoints
router.post("/add-reservation", adminController.addReservation);
router.get("/view-reservation/:id", adminController.viewReservation);
router.get("/list-reservationss/:id", adminController.listReservations);
router.put("/update-reservation/:id",  adminController.updateReservation);
router.delete("/delete-reservation/:id", adminController.deleteReservation);



router.get("/get-available-options", adminController.getAvailableOptions);
router.get("/get-customers",adminController.getCustomers);
router.get("/get-orders",adminController.getOrders);
router.get("/get-staffss",adminController.getStaffs);
module.exports = router;
