// routes/dashboardRoutes.js
// const express = require('express');
// const { authenticate, authorize } = require('../middleware/authMiddleware');
// const { getCustomerDashboard } = require('../controllers/customerController');
// const { getStaffDashboard } = require('../controllers/staffController');
// const { getAdminDashboard } = require('../controllers/adminController');

// const router = express.Router();

// // Customer dashboard
// router.get('/customer', authenticate, authorize('Customer'), getCustomerDashboard);

// // Staff dashboard
// router.get('/staff', authenticate, authorize('Staff'), getStaffDashboard);

// // Admin dashboard
// router.get('/admin', authenticate, authorize('Admin'), getAdminDashboard);

// module.exports = router;