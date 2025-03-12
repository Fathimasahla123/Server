// controllers/feedbackController.js
const Feedback = require('../models/feedbackModel');
const Customer = require('../models/customerModel');
const Order = require('../models/orderModel');
const Reservation = require('../models/reservationModel');

// Submit feedback
const submitFeedback = async (req, res) => {
  const { customerId, orderId, reservationId, rating, comment } = req.body;

  try {
    const feedback = new Feedback({ customerId, orderId, reservationId, rating, comment });
    await feedback.save();

    // Update customer's feedback history
    await Customer.findByIdAndUpdate(customerId, { $push: { feedbackHistory: feedback._id } });

    // Update order or reservation with feedback reference (if applicable)
    if (orderId) {
      await Order.findByIdAndUpdate(orderId, { feedback: feedback._id });
    }
    if (reservationId) {
      await Reservation.findByIdAndUpdate(reservationId, { feedback: feedback._id });
    }

    res.status(201).json({ message: 'Feedback submitted successfully', feedback });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all feedback
const getFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.find({});
    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get specific feedback by ID
const getFeedbackById = async (req, res) => {
  const { id } = req.params;

  try {
    const feedback = await Feedback.findById(id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update feedback
const updateFeedback = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const feedback = await Feedback.findByIdAndUpdate(id, updates, { new: true });
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.status(200).json(feedback);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete feedback
const deleteFeedback = async (req, res) => {
  const { id } = req.params;

  try {
    const feedback = await Feedback.findByIdAndDelete(id);
    if (!feedback) {
      return res.status(404).json({ error: 'Feedback not found' });
    }
    res.status(200).json({ message: 'Feedback deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  submitFeedback,
  getFeedback,
  getFeedbackById,
  updateFeedback,
  deleteFeedback,
};