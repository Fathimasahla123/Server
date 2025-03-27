const Order = require("../models/orderModel");
const Staff = require("../models/staffModel");
const Feedback = require("../models/feedbackModel");
const User = require("../models/userModel");
const Reservation = require("../models/reservationModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

exports.loginStaff = async (req, res) => {
  try {
    const { email, password } = req.body;

    const staff = await Staff.findOne({ email, role: "Staff" });

    if (!staff) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials please enter correct password",
      });
    }

    const token = jwt.sign(
      {
        id: staff._id,
        role: staff.role,
        email: staff.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      staff: {
        id: staff._id,
        name: staff.name,
        email: staff.email,
        incharge: staff.incharge,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

exports.getStaffOrders = async (req, res) => {
  try {
    if (req.user.role !== "Staff") {
      return res.status(403).json({
        success: false,
        message: "Access denied. Only staff can view orders.",
      });
    }

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const orders = await Order.find({
      staffId: req.user.id,
      isActive: true,
    })
      .populate({
        path: "customerId",
        model: "User",
        select: "name email ",
      })
      .populate({
        path: "feedback",
        select: "rating comment",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const totalOrders = await Order.countDocuments({
      staffId: req.user.id,
      isActive: true,
    });

    const formattedOrders = orders.map((order) => ({
      orderId: order._id,
      customer: order.customerId,
      items: order.items,
      totalAmount: order.totalAmount,
      status: order.status,
      createdAt: order.createdAt,
      feedback: order.feedback || null,
    }));

    res.status(200).json({
      success: true,
      data: formattedOrders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalOrders / limit),
        totalItems: totalOrders,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching staff orders:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
      error: error.message.includes("Schema")
        ? "Database configuration error"
        : error.message,
    });
  }
};

exports.getStaffFeedback = async (req, res) => {
  try {
    if (req.user.role !== "Staff") {
      return res.status(403).json({
        success: false,
        message: "Access denied",
      });
    }

    const feedbacks = await Feedback.find({
      staffId: req.user.id,
      isActive: true,
    })
      .populate({
        path: "customerId",
        select: "name email",
      })
      .populate({
        path: "orderId",
        select: "items totalAmount",
      })
      .sort({ createdAt: -1 });

    const avgRatings = await Feedback.aggregate([
      {
        $match: {
          staffId: new mongoose.Types.ObjectId(req.user.id),
          isActive: true,
        },
      },
      {
        $group: {
          _id: null,
          avgService: { $avg: "$rating.customerService" },
          avgPunctuality: { $avg: "$rating.punctuality" },
          totalFeedbacks: { $sum: 1 },
        },
      },
    ]);

    res.status(200).json({
      success: true,
      data: feedbacks,
      statistics: avgRatings[0] || {
        avgService: 0,
        avgPunctuality: 0,
        totalFeedbacks: 0,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};
