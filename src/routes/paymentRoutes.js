// // routes/paymentRoutes.js
// const express = require('express');
// const { authenticate, authorize } = require('../middleware/authMiddleware');
// const {
//   processPayment,
//   getPayments,
//   getPaymentById,
//   updatePaymentStatus,
// } = require('../controllers/paymentController');

// const router = express.Router();

// // Process a payment (accessible to Customers)
// router.post('/', authenticate, authorize('Customer'), processPayment);

// // Get all payments (accessible to Admin and Staff)
// router.get('/', authenticate, authorize(['Admin', 'Staff']), getPayments);

// // Get a specific payment by ID (accessible to Admin, Staff, and the Customer who made the payment)
// router.get('/:id', authenticate, getPaymentById);

// // Update payment status (e.g., mark as refunded) (accessible to Admin and Staff)
// router.put('/:id', authenticate, authorize(['Admin', 'Staff']), updatePaymentStatus);

// module.exports = router;