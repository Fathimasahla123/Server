const User = require("../models/userModel");
const Staff = require("../models/staffModel");
const Order = require("../models/orderModel");
const Feedback = require("../models/feedbackModel");
const Reservation = require("../models/reservationModel");
const Product = require("../models/productModel");
const bcrypt = require("bcryptjs");

// Add this at the top of your existing adminController.js
exports.adminDashboard = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ msg: "Access denied" });
    }

    // Basic counts for dashboard cards
    const [users, staff, orders, reservations, products] = await Promise.all([
      User.countDocuments(),
      Staff.countDocuments(),
      Order.countDocuments(),
      Reservation.countDocuments(),
      Product.countDocuments()
    ]);

    res.status(200).json({
      success: true,
      navigation: {
        users: "/admin/users",
        staff: "/admin/staff",
        orders: "/admin/orders",
        reservations: "/admin/reservations",
        products: "/admin/products",
        analytics: "/admin/analytics"
      },
      quickStats: {
        totalUsers: users,
        totalStaff: staff,
        totalOrders: orders,
        totalReservations: reservations,
        totalProducts: products
      },
      sections: {
        userManagement: {
          list: "/admin/users",
          create: "/admin/users/create",
          update: "/admin/users/:id",
          delete: "/admin/users/:id"
        },
        staffManagement: {
          list: "/admin/staff",
          create: "/admin/staff/create",
          update: "/admin/staff/:id",
          delete: "/admin/staff/:id"
        },
        orderManagement: {
          list: "/admin/orders",
          create: "/admin/orders/create",
          update: "/admin/orders/:id",
          delete: "/admin/orders/:id"
        },
        reservationManagement: {
          list: "/admin/reservations",
          create: "/admin/reservations/create",
          update: "/admin/reservations/:id",
          delete: "/admin/reservations/:id"
        },
        productManagement: {
          list: "/admin/products",
          create: "/admin/products/create",
          update: "/admin/products/:id",
          delete: "/admin/products/:id"
        },
        analytics: {
          revenue: "/admin/analytics/revenue",
          popularDishes: "/admin/analytics/popular-dishes",
          customerSatisfaction: "/admin/analytics/satisfaction",
          deliveryPerformance: "/admin/analytics/delivery",
          tableTurnover: "/admin/analytics/turnover"
        }
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      msg: "Failed to load dashboard",
      error: error.message 
    });
  }
};

exports.addUser = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const { name, email, password, role } = req.body;
    console.log("Extracted role:", role);
    if (!["Customer,Staff"].includes(role))
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
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const user = await User.find();
    res.json({ user });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const staff = await Staff.find({ role: "Staff" });
    res.json({ staff });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateStaff = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const {
      customerId,
      staffId,
      items,
      totalAmount,
      orderType,
      deliveryAddress,
    } = req.body;
    const customer = await User.findOne({ _id: customerId, role: "Customer" });
    if (!customer) {
      return res.status(400).json({ message: "Invalid customerId" });
    }
    const staff = await Staff.findOne({ _id: staffId, role: "Staff" });
    if (!staff) {
      return res.status(400).json({ message: "Invalid staffId" });
    }
    const order = new Order({
      customerId,
      staffId,
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
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const order = await Order.find();
    res.json({ order });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ message: " Order updated successfully", order });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const { customerName, customerId, date, time, guests, specialRequests } =
      req.body;
    const customer = await User.findOne({ _id: customerId, role: "Customer" });
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
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const reservation = await Reservation.find();
    res.status(200).json({ success: true, reservation });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
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
    res.json({ message: " Reservation updated successfully", reservation });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.deleteReservation = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
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
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const result = await Order.aggregate([
      { $match: { status: { $ne: "Cancelled" } } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    res.status(200).json({
      success: true,
      totalRevenue: result[0]?.total || 0,
    });
  } catch (error) {
    console.error("Revenue error:", error);
    res.status(500).json({ success: false, message: "Failed to get revenue" });
  }
};

exports.getPopularDishes = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const result = await Order.aggregate([
      { $unwind: "$items" },
      {
        $group: {
          _id: "$items.dishName",
          totalOrders: { $sum: "$items.quantity" },
        },
      },
      { $sort: { totalOrders: -1 } },
      { $limit: 5 },
    ]);

    res.status(200).json({
      success: true,
      popularDishes: result,
    });
  } catch (error) {
    console.error("Dishes error:", error);
    res.status(500).json({ success: false, message: "Failed to get dishes" });
  }
};

exports.getCustomerSatisfaction = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const result = await Feedback.aggregate([
      {
        $group: {
          _id: null,
          avgRating: { $avg: "$rating" },
          totalFeedbacks: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      averageRating: result[0]?.avgRating?.toFixed(2) || 0,
      totalFeedbacks: result[0]?.totalFeedbacks || 0,
    });
  } catch (error) {
    console.error("Satisfaction error:", error);
    res.status(500).json({ success: false, message: "Failed to get ratings" });
  }
};

exports.getDeliveryPerformance = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const result = await Order.aggregate([
      { $match: { orderType: "Delivery" } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          delivered: {
            $sum: { $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0] },
          },
        },
      },
    ]);

    const performance = result[0]
      ? (result[0].delivered / result[0].total) * 100
      : 0;

    res.status(200).json({
      success: true,
      performance: performance.toFixed(2) + "%",
      delivered: result[0]?.delivered || 0,
      total: result[0]?.total || 0,
    });
  } catch (error) {
    console.error("Delivery error:", error);
    res
      .status(500)
      .json({ success: false, message: "Failed to get performance" });
  }
};

exports.getTableTurnoverRate = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const result = await Reservation.aggregate([
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          completed: {
            $sum: { $cond: [{ $eq: ["$status", "Completed"] }, 1, 0] },
          },
        },
      },
    ]);

    const rate = result[0] ? (result[0].completed / result[0].total) * 100 : 0;

    res.status(200).json({
      success: true,
      turnoverRate: rate.toFixed(2) + "%",
      completed: result[0]?.completed || 0,
      total: result[0]?.total || 0,
    });
  } catch (error) {
    console.error("Turnover error:", error);
    res.status(500).json({ success: false, message: "Failed to get turnover" });
  }
};

exports.uploadProduct = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied.",
      });
    }

    const { name, category, image, price, description } = req.body;
    if (!name || !category || !image || !price || !description) {
      return res.status(400).json({
        success: false,
        message:
          "All fields (name, category, image, price, description) are required",
      });
    }

    const newProduct = new Product({
      ...req.body,
      createdBy: req.user.id,
    });

    await newProduct.save();

    res.status(201).json({
      success: true,
      message: "Product uploaded successfully",
      product: {
        id: newProduct._id,
        name: newProduct.name,
        category: newProduct.category,
        price: newProduct.price,
      },
    });
  } catch (error) {
    console.error("Product upload error:", error);

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation error",
        errors: error.errors,
      });
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const { category, minPrice, maxPrice, search } = req.query;
    const filter = {};

    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = minPrice;
      if (maxPrice) filter.price.$lte = maxPrice;
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const products = await Product.find(filter).select("-__v").lean();

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching products",
      error: error.message,
    });
  }
};
