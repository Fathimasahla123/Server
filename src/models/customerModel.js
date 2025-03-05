const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: Number,required: true},
  phoneNumber: { type: String, required: true },
  address: { type: String },
  loyaltyPoints: { type: Number, default: 0 },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  feedbackHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Customer', customerSchema);