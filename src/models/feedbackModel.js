const mongoose = require('mongoose');
const masterSchema = require("./masterModel");

const feedbackSchema = new mongoose.Schema({
  ...masterSchema.obj,
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' ,required: true},
  reservationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Reservation' ,required: true}, 
  staffId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' ,required: true}, 
  ratings:{
    costomerService: { type: Number, min: 1, max: 5, required: true },
    punctuality: { type: Number, min: 1, max: 5, required: true },
},
  comments: { type: String }, 
  week:{ type: String, required: true}, 
});

module.exports = mongoose.model('Feedback', feedbackSchema);