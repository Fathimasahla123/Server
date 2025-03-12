// controllers/adminController.js
const User = require('../models/userModel');
const Order = require('../models/orderModel');
const Reservation = require('../models/reservationModel');
const Payment = require('../models/paymentModel');
const Feedback = require('../models/feedbackModel');
// const Staff = require("../models/staffModel");

// Get admin dashboard data
const getAdminDashboard = async (req, res) => {
  try {
    const users = await User.find({});
    const orders = await Order.find({});
    const reservations = await Reservation.find({});
    const payments = await Payment.find({});
    const feedback = await Feedback.find({});
    // staff = await Staff.find({});

    res.status(200).json({
      users,
      orders,
      reservations,
      payments,
      feedback,
    //  staff,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getAdminDashboard };