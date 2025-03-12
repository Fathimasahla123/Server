// controllers/staffController.js
const Order = require("../models/orderModel");
const Staff = require("../models/staffModel");

// Get staff dashboard data
const getStaffDashboard = async (req, res) => {
  try {
    // Fetch the logged-in staff member's data
    const staff = await Staff.findById(req.user._id);

    if (!staff) {
      return res.status(404).json({ error: "Staff member not found" });
    }

    // Extract tasks and attendance from the staff document
    const tasks = staff.tasks; // Assuming 'tasks' is a field in the Staff schema
    const attendance = staff.attendance; // Assuming 'attendance' is a field in the Staff schema

    // Fetch all orders (staff can view all orders)
    const orders = await Order.find({});

    res.status(200).json({
      tasks,
      attendance,
      orders,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { getStaffDashboard };
