const User = require("../models/userModel");
const Staff = require("../models/staffModel");
const Order = require("../models/orderModel");
const Feedback = require("../models/feedbackModel");
const Reservation = require("../models/reservationModel");
const bcrypt = require("bcryptjs");

exports.addUser = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const { name, email, password, role } = req.body;
    console.log("Extracted role:", role);
    if (!["Customer", "Staff"].includes(role))
      return res.status(400).json({ msg: "Invalid role" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role,
      createdBy: req.user._id,
    });
    console.log(newUser);
    await newUser.save();
    res.status(201).json({ msg: "user created successfully", user: newUser });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

exports.viewUser = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "user not found" });
    res.json({ user });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const user = await User.find();
    res.json({ user });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) return res.status(404).json({ message: "user not found" });
    res.json({ message: " user updated successfully", user });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: " User deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//staff endpoints
exports.addStaff = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const {
      name,
      email,
      password,
      phoneNumber,
      incharge,
      tasks,
      attendance,
      role,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const staff = new Staff({
      name,
      email,
      password: hashedPassword,
      phoneNumber,
      incharge,
      role,
      tasks,
      attendance,
      createdBy: req.user._id,
    });
    await staff.save();
    res.status(201).json({ msg: "staff created successfully", staff });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};
exports.viewStaff = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const staff = await Staff.findOne({ _id: req.params.id, role: "Staff" });
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json({ staff });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.listStaffs = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const staff = await Staff.find({ role: "Staff" });
    res.json({ staff });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const staff = await Staff.findOneAndUpdate(
      { _id: req.params.id, role: "Staff" },
      req.body,
      { new: true }
    );
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: " Staff updated successfully", staff });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const staff = await Staff.findOneAndDelete({
      _id: req.params.id,
      role: "Staff",
    });
    if (!staff) return res.status(404).json({ message: "Staff not found" });
    res.json({ message: " Staff deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//Order functions
exports.addOrder = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const { customerId, items, totalAmount, orderType, deliveryAddress } =
      req.body;
    const customer = await User.findOne({ _id:customerId, role: "Customer"});
    if (!customer) {
      return res.status(400).json({ message: "Invalid customerId" });
    }
    const order = new Order({
      customerId,
      items,
      totalAmount,
      orderType,
      deliveryAddress,
      createdBy: req.user._id,
    });
    await order.save();
    res.status(201).json({ msg: "order created successfully", order });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

exports.viewOrder = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.listOrders = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const order = await Order.find();
    res.json({ order });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: " Order updated successfully" , order});
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: " Order deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//Reservation functions

exports.addReservation = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const { customerName, customerId, date, time, guests, specialRequests } =
      req.body;
      const customer = await User.findOne({ _id:customerId, role: "Customer"});
      if (!customer) {
        return res.status(400).json({ message: "Invalid customerId" });
      }
     
    const reservation = new Reservation({
      customerName,
      customerId,
      date,
      time,
      guests,
      specialRequests,
      createdBy: req.user._id,
    });
    await reservation.save();
    res
      .status(201)
      .json({ msg: "reservation created successfully", reservation });
  } catch (error) {
    res
      .status(500)
      .json({ msg: "Internal server error", error: error.message });
  }
};

exports.viewReservation = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    res.json({ reservation });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.listReservations = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const reservation = await Reservation.find();
    res.status(200).json({ success: true, reservation });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const reservation = await Reservation.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    res.json({ message: " Reservation updated successfully" ,reservation});
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    res.json({ message: " Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//get available options

exports.getAvailableOptions = async (req, res) => {
  try {
    const staffs = await User.findOne({ role: "Staff" });
    const orders = await Order.find();

    return res.status(200).json({ staffs, orders });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getStaffs = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const staffs = await User.find({ role: "Staff" });
    res.json(staffs);
  } catch (error) {
    console.error("Error fetching staffs:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getCustomers = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const customers = await User.find({ role: "Customer" });
    res.json(customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

//Analytic functions

exports.getTotalRevenue = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const orders = await Order.find();
    if (!orders) return res.status(404).json({ message: "Order not found" });
    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );
    res.status(200).json({ totalRevenue });
  } catch (error) {
    console.error("Error fetching total revenue:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getPopularDishes = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const orders = await Order.find();
    if (!orders) return res.status(404).json({ message: "Order not found" });
    const dishCounts = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (dishCounts[item.dishName]) {
          dishCounts[item.dishName] += item.quantity;
        } else {
          dishCounts[item.dishName] = item.quantity;
        }
      });
    });
    const popularDishes = Object.entries(dishCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5); // Top 5 popular dishes

    res.status(200).json({ popularDishes });
  } catch (error) {
    console.error("Error fetching popular dishes:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getCustomerSatisfaction = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const feedback = await Feedback.find();
    const totalRatings = feedback.reduce((sum, fb) => sum + fb.rating, 0);
    const averageRating = totalRatings / feedback.length;
    res.status(200).json({ averageRating });
  } catch (error) {
    console.error("Error fetching customer satisfaction:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getDeliveryPerformance = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const orders = await Order.find({ orderType: "Delivery" });
    const onTimeDeliveries = orders.filter(
      (order) => order.status === "Delivered"
    ).length;
    const deliveryPerformance = (onTimeDeliveries / orders.length) * 100; // Percentage of on-time deliveries
    res.status(200).json({ deliveryPerformance });
  } catch (error) {
    console.error("Error fetching delivery performance:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getTableTurnoverRate = async (req, res) => {
  try {
    if (req.user.role === "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const reservations = await Reservation.find({});
    const totalReservations = reservations.length;
    const completedReservations = reservations.filter(
      (reservation) => reservation.status === "Completed"
    ).length;
    const turnoverRate = (completedReservations / totalReservations) * 100; // Percentage of completed reservations
    res.status(200).json({ turnoverRate });
  } catch (error) {
    console.error("Error fetching table turnover rate:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
