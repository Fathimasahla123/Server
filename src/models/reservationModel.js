const mongoose = require('mongoose');
const masterSchema = require("./masterModel");

const reservationSchema = new mongoose.Schema({
  ...masterSchema.obj,
  customerName: { type: String, required: true },
  phoneNumber: { type: Number, required: true},
  date: { type: String, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  specialRequests: { type: String },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback'},
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reservation', reservationSchema);