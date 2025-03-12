// controllers/paymentController.js
const Payment = require('../models/paymentModel');
const Order = require('../models/orderModel');

// Process a payment
const processPayment = async (req, res) => {
  const { orderId, customerId, amount, paymentMethod, transactionId } = req.body;

  try {
    const payment = new Payment({ orderId, customerId, amount, paymentMethod, transactionId });
    await payment.save();

    // Update the order with the payment reference
    await Order.findByIdAndUpdate(orderId, { payment: payment._id });

    res.status(201).json({ message: 'Payment processed successfully', payment });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.find({});
    res.status(200).json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a specific payment by ID
const getPaymentById = async (req, res) => {
  const { id } = req.params;

  try {
    const payment = await Payment.findById(id);
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update payment status (e.g., mark as refunded)
const updatePaymentStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const payment = await Payment.findByIdAndUpdate(id, { status }, { new: true });
    if (!payment) {
      return res.status(404).json({ error: 'Payment not found' });
    }
    res.status(200).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  processPayment,
  getPayments,
  getPaymentById,
  updatePaymentStatus,
};