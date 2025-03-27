const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const feedbackSchema = new mongoose.Schema({
  ...masterSchema.obj,
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,},
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true,},
  staffId: { type: mongoose.Schema.Types.ObjectId,ref: "Staff",required: true,},
  rating: {
    customerService: { type: Number, min: 1, max: 5, required: true },
    punctuality: { type: Number, min: 1, max: 5, required: true },
  },
  comment: { type: String },
  week: { type: String, required: true },
});

module.exports = mongoose.model("Feedback", feedbackSchema);
