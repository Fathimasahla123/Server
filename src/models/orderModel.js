const mongoose = require('mongoose');
const masterSchema = require("./masterModel");

const orderSchema = new mongoose.Schema({
  ...masterSchema.obj,
  //customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  customerName: {type: String, required: true  },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'Staff', required: true },
  items: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
      price: { type: Number, required: true },
    },
  ],
  totalAmount: { type: Number, required: true },
  orderType: { type: String, enum: ['Delivery', 'Pickup'],default: 'Delivery', required: true },
  deliveryAddress: { type: String }, // Only for delivery orders
  status: { type: String, enum: ['Pending', 'Preparing', 'Ready', 'Delivered'], default: 'Pending' },
 // feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);