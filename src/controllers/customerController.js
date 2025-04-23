require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Reservation = require("../models/reservationModel");
const Staff = require("../models/staffModel");
const Feedback = require("../models/feedbackModel");
const Order = require("../models/orderModel");
const Product = require("../models/productModel");
const multer = require("multer");
const path = require("path");
const { cloudinary } = require("../config/cloudinaryConfig");

exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await User.findOne({ email, role: "Customer" });
    if (!customer) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: customer._id,
        role: customer.role,
        email: customer.email,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        isFirstLogin: customer.isFirstLogin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};

exports.changePassword = async (req, res) => {
  try {
    if (req.user.role !== "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const { currentPassword, newPassword } = req.body;

    const customer = await User.findById(req.user.id);
    if (!customer || customer.role !== "Customer") {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    customer.password = await bcrypt.hash(newPassword, 10);
    customer.isFirstLogin = false;
    await customer.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Password change error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to change password",
      error: error.message,
    });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    if (req.user.role !== "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const { name, email, phoneNumber } = req.body;

    const customer = await User.findById(req.user.id);
    if (!customer || customer.role !== "Customer") {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    if (email && email !== customer.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({
          success: false,
          message: "Email already in use",
        });
      }
      customer.email = email;
    }

    if (name) customer.name = name;
    if (phoneNumber) customer.phoneNumber = phoneNumber;

    await customer.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phoneNumber: customer.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
      error: error.message,
    });
  }
};

exports.viewProfile = async (req, res) => {
  try {
    if (req.user.role !== "Customer") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    const customer = await User.findById(req.user.id)
      .select("-password -__v") // Exclude sensitive and unnecessary fields
      .populate("createdBy", "name email")
      .lean(); // Convert to plain JavaScript object

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found",
      });
    }

    // Add profileImageUrl if it exists
    const profileData = {
      ...customer,
      profileImageUrl: customer.profileImageUrl || null
    };

    res.status(200).json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error("Profile view error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch profile",
      error: error.message,
    });
  }
};


exports.uploadProfileImage = async (req, res) => {
  try {
    if (req.user.role !== "Customer")
      return res.status(403).json({ msg: "Access denied" });
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const customer = await User.findById(req.user.id);

    if (!customer || customer.role !== "Customer") {
      return res.status(403).json({
        message: "Unauthorized: Only customer can upload profile image",
      });
    }
    if (customer.profileImageUrl) {
      const publicId = customer.profileImageUrl.split("/").pop().split(".")[0];
      try {
        await cloudinary.uploader.destroy(`customer-profiles/${publicId}`);
      } catch (error) {
        console.error("Error deleting image from cloudinary:", error);
      }
    }

    customer.profileImageUrl = req.file.path;
    await customer.save();
    res.json({
      message: "Profile image uploaded successfully",
      profileImageUrl: customer.profileImageUrl,
    });
  } catch (error) {
    console.error("Error uploading profile image:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


exports.listStaffs = async (req, res) => {
  try {
    if (req.user.role !== "Customer") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }

    // Fetch from both User and Staff collections
    const [userStaff, adminStaff] = await Promise.all([
      User.find({ role: "Staff" }).select('-password'),
      Staff.find({ role: "Staff" })
    ]);

    // Combine results with type indicator
    const combinedStaff = [
      ...userStaff.map(user => ({ ...user.toObject(), staffType: "User" })),
      ...adminStaff.map(staff => ({ ...staff.toObject(), staffType: "Admin" }))
    ];

    res.status(200).json({
      success: true,
      data: combinedStaff,
      count: combinedStaff.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message
    });
  }
};

//Order functions
exports.addOrder = async (req, res) => {
  try {
    if (req.user.role !== "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const {
      customerName,
      staffId,
      items,
      totalAmount,
      orderType,
      deliveryAddress,
    } = req.body;
    const staff = await Staff.findOne({  role: "Staff" });
    if (!staff) {
      return res.status(400).json({ message: "Invalid staffId" });
    }
    const order = new Order({
      customerName,
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
    if (req.user.role !== "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: "Order not found" });
    res.json({ order });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.getMyOrders = async (req, res) => {
  try {
    if (req.user.role !==  "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const orders = await Order.find({ customerName: req.user.name, isActive: true })
    .populate('staffId', 'name email')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Order.countDocuments({ customerName: req.user.name, isActive: true });

  res.json({
    success: true,
    count: orders.length,
    data: orders,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    } 
    })
  }catch (error) {
      res.status(500).json({ msg: "Server error", error: error.message });
  }
}

exports.listOrders = async (req, res) => {
  try {
    if (req.user.role !==  "Customer")
      return res.status(403).json({ msg: "Access denied" });
   const order = await Order.find();
    res.json({ order});
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    if (req.user.role !== "Customer")
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
    if (req.user.role !== "Customer")
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
    if (req.user.role !== "Customer")
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
    if (req.user.role !== "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const reservation = await Reservation.findById(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    res.json({ reservation });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
exports.getMyReservations = async (req, res) => {
  try {
    if (req.user.role !==  "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const reservations = await Reservation.find({ customerName: req.user.name, isActive: true })
    .populate('date', 'guests')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const total = await Reservation.countDocuments({ customerName: req.user.name, isActive: true });

  res.json({
    success: true,
    count: reservations.length,
    data: reservations,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit
    } 
    })
  }catch (error) {
      res.status(500).json({ msg: "Server error", error: error.message });
  }
}
exports.listReservations = async (req, res) => {
  try {
    if (req.user.role !== "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const reservation = await Reservation.find();
    res.status(200).json({ success: true, reservation });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.updateReservation = async (req, res) => {
  try {
    if (req.user.role !== "Customer")
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
    if (req.user.role !== "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const reservation = await Reservation.findByIdAndDelete(req.params.id);
    if (!reservation)
      return res.status(404).json({ message: "Reservation not found" });
    res.json({ message: " Reservation deleted successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.submitFeedback = async (req, res) => {
  try {
    if (req.user.role !== "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const { staffId, orderId, rating, comment, week, reservationId } = req.body;

    const existingFeedback = await Feedback.findOne({
      customerId: req.user.id,
      staffId,
      orderId,
      reservationId,
      week,
    });

    if (existingFeedback) {
      return res.status(400).json({ message: "Feedback already submitted" });
    }

    const ratingFields = ["customerService", "punctuality"];
    for (const field of ratingFields) {
      if (!rating[field] || rating[field] < 1 || rating[field] > 5) {
        return res.status(400).json({
          message: `Invalid rating for ${field}. Must be between 1 and 5`,
        });
      }
    }

    const feedback = new Feedback({
      customerId: req.user.id,
      staffId,
      orderId,
      reservationId,
      week,
      rating,
      comment,
      createdBy: req.user.id,
    });

    await feedback.save();

    res.status(201).json({
      message: "Feedback submitted successfully",
      feedback,
    });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

exports.viewMyFeedback = async (req, res) => {
  try {
    if (req.user.role !== "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find({
      customerId: req.user.id,
      isActive: true,
    })
      .populate({
        path: "staffId",
        select: "name email",
      })
      .populate({
        path: "orderId",
        select: "items totalAmount status",
      })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments({
      customerId: req.user.id,
      isActive: true,
    });

    res.status(200).json({
      success: true,
      data: feedbacks,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Feedback view error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch feedback",
      error: error.message,
    });
  }
};

exports.getStaffs = async (req, res) => {
  try {
    if (req.user.role !== "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const staffs = await User.find({ role: "Staff" });
    res.json(staffs);
  } catch (error) {
    console.error("Error fetching staffs:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.listUsers = async (req, res) => {
  try {
    if (req.user.role !== "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const user = await User.find();
    res.json({ user });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};
