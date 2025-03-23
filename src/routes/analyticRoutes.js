const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/revenue", authMiddleware, adminController.totalRevenue);
router.get("/popular-dishes", authMiddleware, adminController.popularDishes);
router.get("/customer-satisfaction",authMiddleware,adminController.customerSatisfaction);
router.get("/delivery-performance", authMiddleware,adminController.deliveryPerformance);
router.get("/table-turnover",authMiddleware,adminController.tableTurnoverRate);

module.exports = router;
