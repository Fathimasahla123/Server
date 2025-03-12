// routes/feedbackRoutes.js
const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const {
  submitFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
} = require('../controllers/feedbackController');

const router = express.Router();

// Submit feedback (accessible to Customers)
router.post('/', authenticate, authorize('Customer'), submitFeedback);

// Get all feedback (accessible to Admin and Staff)
router.get('/', authenticate, authorize(['Admin', 'Staff']), getFeedback);

// Get specific feedback by ID (accessible to Admin, Staff, and the Customer who submitted the feedback)
router.get('/:id', authenticate, getFeedbackById);

// Update feedback (accessible to Admin, Staff, and the Customer who submitted the feedback)
router.put('/:id', authenticate, updateFeedback);

// Delete feedback (accessible to Admin, Staff, and the Customer who submitted the feedback)
router.delete('/:id', authenticate, deleteFeedback);

module.exports = router;