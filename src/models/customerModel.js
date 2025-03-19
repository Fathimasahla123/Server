const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String,required: true},
  phoneNumber: { type: Number, required: true },
  address: { type: String },
  loyaltyPoints: { type: Number, default: 0 },
  role: {type: String, enum: ["Customer", "Staff", "Admin"],default: "Customer" },
  orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }],
  feedbackHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Customer', customerSchema);