// routes/orderRoutes.js
const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
} = require('../controllers/orderController');

const router = express.Router();

// Create an order (accessible to Customers)
router.post('/', authenticate, authorize('Customer'), createOrder);

// Get all orders (accessible to Admin and Staff)
router.get('/', authenticate, authorize(['Admin', 'Staff']), getOrders);

// Get a specific order by ID (accessible to Admin, Staff, and the Customer who placed the order)
router.get('/:id', authenticate, getOrderById);

// Update an order (accessible to Admin and Staff)
router.put('/:id', authenticate, authorize(['Admin', 'Staff']), updateOrder);

// Delete an order (accessible to Admin and Staff)
router.delete('/:id', authenticate, authorize(['Admin', 'Staff']), deleteOrder);

module.exports = router;