const mongoose = require('mongoose');
const masterSchema = require("./masterModel");

const staffSchema = new mongoose.Schema({
  ...masterSchema.obj,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type:String, required: true},
  phoneNumber: { type: Number, required: true },
  incharge: { type: String, enum: ['Manager', 'Chef', 'Waiter', 'Delivery'], required: true },
  role: {type: String, enum: ["Customer", "Staff", "Admin"],default: "Staff" },
  tasks:  { type: String, required: true },
  attendance: { type: String, enum: ['Present', 'Absent'], required: true },
  createdAt: { type: Date, default: Date.now },
});


module.exports = mongoose.model('Staff', staffSchema);