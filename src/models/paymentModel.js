const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order', required: true },
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String, enum: ['Credit Card', 'Debit Card', 'UPI', 'Wallet'], required: true },
  status: { type: String, enum: ['Pending', 'Completed', 'Refunded'], default: 'Pending' },
  transactionId: { type: String, required: true }, // Unique ID from payment gateway
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payment', paymentSchema);