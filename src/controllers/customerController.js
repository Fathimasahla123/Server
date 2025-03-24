require("dotenv").config();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Reservation = require("../models/reservationModel");
const Staff = require("../models/staffModel");
const Feedback = require("../models/feedbackModel");
const Order = require("../models/orderModel");
const CustomerOrderReservation = require("../models/customerOrderModel")
const multer = require("multer");
const path = require("path");
const { cloudinary } = require("../config/cloudinaryConfig");


exports.registerCustomer = async (req, res) => {
  try {
    const { name, email } = req.body;
    if (req.user.role === "Admin")
      return res.status(403).json({ message: "Access denied" });

    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ msg: "User already exists" });
    }
    const defaultPassword = "customer";
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    const customer = User.create({
      name,
      email,
      password: hashedPassword,
      role: "Customer",
      createdBy: req.user._id,
      isFirstLogin: true,
    });
    
    res.status(201).json({
      msg: "Customer registered successfully",
      customer: {
        id: (await customer)._id,
        name: (await customer).name,
        email: (await customer).email,
        defaultPassword,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ msg: "Internal Server error", error });
  }
};

exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await User.findOne({ email, role: "Customer" });
    if (!customer) {
      return res.status(404).json({ msg: "Customer does not exist" });
    }
    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: customer._id, role: customer.role, email: customer.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({
      message: "Login successfull",
      token,
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        isFirstLogin: customer.isFirstLogin,
      },
    });
  } catch (error) {
    console.error(" Login eror:", error);
    res.status(500).json({ error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const customer = await User.findById(req.user.id);

    if (!customer || customer.role !== "Customer") {
      return res.status(404).json({ message: "customer not found" });
    }
    const isMatch = await bcrypt.compare(currentPassword, customer.password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "Current password entered is incorrect" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    customer.password = hashedPassword;
    customer.isFirstLogin = false;

    await customer.save();
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Change password error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { name, email } = req.body;
    const customer = await User.findById(req.user.id);

    if (!customer || customer.role !== "Customer") {
      return res.status(404).json({ message: "customer not found" });
    }

    if (email && email !== customer.email) {
      const emailExist = await User.findOne({ email });
      if (emailExist) {
        return res.status(400).json({ message: "Email already exists" });
      }
      customer.email = email;
    }
    if (name) {
      customer.name = name;
    }
    await customer.save();
    res.json({
      message: "Profile updated successfully",
      customer: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
      },
    });
  } catch (error) {
    console.error(" Updated profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.viewProfile = async (req, res) => {
  try {
    if (req.user.role === "Customer")
      return res.status(403).json({ msg: "Access denied" });
    const customer = await User.findById(req.params.id)
      .select("-password")
      .populate({
        path: "createdBy",
        select: "name email",
      });
    if (!customer) {
      return res.status(404).json({ message: "customer not found" });
    }
    const profileData = {
      ...customer.toObject(),
      profileImageUrl: customer.profileImageUrl || null,
    };
    res.status(200).json({ profileData });
  } catch (error) {
    console.error("Error fetching customer profile:", error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const customer = await Usee.findById(req.user.id);

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

exports.submitFeedback = async (req, res) => {
  try {
    const { staffId, orderId, reservationId, rating, comment, week } =
      req.body;
    // const enrollment = await CustomerOrderReservation.findOne({
    //   customerId: req.user.id,
    //   orderId,
    //   reservationId,
    // });

    // if (!enrollment) {
    //   return res.status(403).json({ message: "Enrollment not found" });
   // }
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
    res
      .status(201)
      .json({ message: "Feedback submitted successfully", feedback });
  } catch (error) {
    console.error("Error submitting feedback:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

exports.viewReservationDetails = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res
        .status(401)
        .json({ msg: "Access denied, authentication required " });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.page) || 10;
    const skip = (page - 1) * limit;

    const query = { customerId: req.user.id, isActive: true };
    const customerOrders = await CustomerOrderReservation.find(query)
      .populate({
        path: "reservationId",
        select: "customerName phoneNumber date",
        match: { status: { $ne: "deleted" } },
      })
      .populate({
        path: "orderId",
        select: "items totalAmount orderType deliveryAddress",
        match: { isActive: true },
      })
      .populate({
        path: "staffId",
        select: "name",
        match: { isActive: true },
      })
      .skip(skip)
      .limit(limit)
      .lean();

    const filteredOrders = customerOrders.filter(
      (order) => order.reservationId && order.orderId && order.staffId
    );

    if (!filteredOrders) {
      return res
        .status(404)
        .json({ success: false, message: "No active reservation enrollment" });
    }
    const totalCount = await CustomerOrderReservation.countDocuments(query);
    res.status(200).json({
      success: true,
      data: filteredOrders,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalItems: totalCount,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("Error fetching reservation details:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.viewMyFeedback = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.page) || 10;
    const skip = (page - 1) * limit;

    const feedbacks = await Feedback.find({
      customerId: req.user.id,
      isActive: true,
    })
      .populate("staffId", "name email inCharge")
      .populate("orderId", "items totalAmount")
      .populate("reservationId", "customerName guests")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Feedback.countDocuments({
      customerId: req.user.id,
      isActive: true,
    });

    res.json({
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
    console.error("View feedback error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};
