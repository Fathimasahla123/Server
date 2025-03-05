const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  date: { type: Date, required: true },
  totalRevenue: { type: Number, required: true },
  popularDishes: [
    {
      dishName: { type: String, required: true },
      quantitySold: { type: Number, required: true },
    },
  ],
  customerSatisfaction: { type: Number, min: 0, max: 5 }, // Average rating
  deliveryPerformance: { type: Number }, // Percentage of on-time deliveries
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Analytics', analyticsSchema);