const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/revenue", authMiddleware, adminController.getTotalRevenue);
router.get("/popular-dishes", authMiddleware, adminController.getPopularDishes);
router.get("/customer-satisfaction",authMiddleware,adminController.getCustomerSatisfaction);
router.get("/delivery-performance", authMiddleware,adminController.getDeliveryPerformance);
router.get("/table-turnover",authMiddleware,adminController.getTableTurnoverRate);

module.exports = router;
