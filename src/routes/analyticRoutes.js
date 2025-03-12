// routes/analyticsRoutes.js
const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const {
  getTotalRevenue,
  getPopularDishes,
  getCustomerSatisfaction,
  getDeliveryPerformance,
  getTableTurnoverRate,
} = require('../controllers/analyticController');

const router = express.Router();

// Analytics routes (only accessible to Admin)
router.get('/revenue', authenticate, authorize('Admin'), getTotalRevenue);
router.get('/popular-dishes', authenticate, authorize('Admin'), getPopularDishes);
router.get('/customer-satisfaction', authenticate, authorize('Admin'), getCustomerSatisfaction);
router.get('/delivery-performance', authenticate, authorize('Admin'), getDeliveryPerformance);
router.get('/table-turnover', authenticate, authorize('Admin'), getTableTurnoverRate);

module.exports = router;