const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Customer', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' }, // Optional: Link feedback to a specific order
  reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' }, // Optional: Link feedback to a reservation
  rating: { type: Number, min: 1, max: 5, required: true }, // Rating out of 5
  comment: { type: String }, // Optional: Customer's written feedback
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Feedback', feedbackSchema);