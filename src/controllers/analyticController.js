// controllers/analyticsController.js
const Order = require('../models/orderModel');
const Feedback = require('../models/feedbackModel');
const Reservation = require('../models/reservationModel');

// Get total revenue
const getTotalRevenue = async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
    res.status(200).json({ totalRevenue });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get popular dishes
const getPopularDishes = async (req, res) => {
  try {
    const orders = await Order.find({});
    const dishCounts = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (dishCounts[item.dishName]) {
          dishCounts[item.dishName] += item.quantity;
        } else {
          dishCounts[item.dishName] = item.quantity;
        }
      });
    });

    const popularDishes = Object.entries(dishCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 popular dishes

    res.status(200).json({ popularDishes });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get customer satisfaction metrics
const getCustomerSatisfaction = async (req, res) => {
  try {
    const feedback = await Feedback.find({});
    const totalRatings = feedback.reduce((sum, fb) => sum + fb.rating, 0);
    const averageRating = totalRatings / feedback.length;
    res.status(200).json({ averageRating });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get delivery performance metrics
const getDeliveryPerformance = async (req, res) => {
  try {
    const orders = await Order.find({ orderType: 'Delivery' });
    const onTimeDeliveries = orders.filter((order) => order.status === 'Delivered').length;
    const deliveryPerformance = (onTimeDeliveries / orders.length) * 100; // Percentage of on-time deliveries
    res.status(200).json({ deliveryPerformance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get table turnover rate
const getTableTurnoverRate = async (req, res) => {
  try {
    const reservations = await Reservation.find({});
    const totalReservations = reservations.length;
    const completedReservations = reservations.filter((reservation) => reservation.status === 'Completed').length;
    const turnoverRate = (completedReservations / totalReservations) * 100; // Percentage of completed reservations
    res.status(200).json({ turnoverRate });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  getTotalRevenue,
  getPopularDishes,
  getCustomerSatisfaction,
  getDeliveryPerformance,
  getTableTurnoverRate,
};