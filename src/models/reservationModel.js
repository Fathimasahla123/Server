const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  // email: { type: String, required: true },
  // password:{ type: String, required: true },
  phonenumber: { type: Number, required: true},
  date: { type: Date, required: true },
  time: { type: String, required: true },
  guests: { type: Number, required: true },
  specialRequests: { type: String },
  status: { type: String, enum: ['Pending', 'Confirmed', 'Cancelled'], default: 'Pending' },
  feedback: { type: mongoose.Schema.Types.ObjectId, ref: 'Feedback' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reservation', reservationSchema);