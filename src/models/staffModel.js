const mongoose = require('mongoose');

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: Number, required: true},
  phoneNumber: { type: String, required: true },
  role: { type: String, enum: ['Manager', 'Chef', 'Waiter', 'Delivery'], required: true },
  tasks: [
    {
      taskName: { type: String, required: true },
      status: { type: String, enum: ['Pending', 'Completed'], default: 'Pending' },
    },
  ],
  attendance: [
    {
      date: { type: Date, required: true },
      status: { type: String, enum: ['Present', 'Absent'], required: true },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Staff', staffSchema);