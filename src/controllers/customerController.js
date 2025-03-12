// controllers/customerController.js
const Order = require('../models/orderModel');
const Reservation = require('../models/reservationModel');
const Payment = require('../models/paymentModel');
const Feedback = require('../models/feedbackModel');

// Get customer dashboard data
const getCustomerDashboard = async (req, res) => {
  try {
    const orders = await Order.find({ customerId: req.user._id });
    const reservations = await Reservation.find({ customerId: req.user._id });
    const payments = await Payment.find({ customerId: req.user._id });
    const feedback = await Feedback.find({ customerId: req.user._id });

    res.status(200).json({
      orders,
      reservations,
      payments,
      feedback,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getCustomerDashboard };