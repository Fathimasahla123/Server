// controllers/orderController.js
const Order = require('../models/orderModel');

// Create a new order
const createOrder = async (req, res) => {
  const { customerId, items, totalAmount, orderType, deliveryAddress } = req.body;

  try {
    const order = new Order({ customerId, items, totalAmount, orderType, deliveryAddress });
    await order.save();
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all orders
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({});
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific order by ID
const getOrderById = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update an order
const updateOrder = async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  try {
    const order = await Order.findByIdAndUpdate(id, updates, { new: true });
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete an order
const deleteOrder = async (req, res) => {
  const { id } = req.params;

  try {
    const order = await Order.findByIdAndDelete(id);
    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }
    res.status(200).json({ message: 'Order deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  createOrder,
  getOrders,
  getOrderById,
  updateOrder,
  deleteOrder,
};