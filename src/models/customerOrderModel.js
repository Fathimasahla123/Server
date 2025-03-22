const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const customerOrderReservationSchema = new mongoose.Schema({
    ...masterSchema.obj,
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order",
    required: true,
  },
  reservationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Reservation",
    required: true,
  },
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});

module.exports = mongoose.model("CustomerOrderReservation", customerOrderReservationSchema)