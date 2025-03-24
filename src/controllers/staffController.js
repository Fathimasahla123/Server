const Order = require("../models/orderModel");
const Staff = require("../models/staffModel");
const Feedback = require("../models/feedbackModel");
const User = require("../models/userModel");
const Reservation = require("../models/reservationModel");
const CustomerOrderReservation = require("../models/customerOrderModel");
const mongoose = require("mongoose");

exports.viewStaffCustomer = async (req, res) => {
  try {
    if (req.user.role === "Staff") {
      return res.status(403).json({ success: false, message: "Access denied" });
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const reservation = await Reservation.find({
      staffId: req.user.id,
      isActive: true,
    });
    const reservationIds = reservation.map((reservatin) => reservation._id);

    const customers = await CustomerOrderReservation.find({
      reservationId: { $in: reservationIds },
      isActive: true,
    })
      .populate("customerId", "name email")
      .populate("orderId", "items totalAmount")
      .populate("reservationId", "customerName phoneNumber")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await CustomerOrderReservation.countDocuments({
      reservationId: { $in: reservationIds },
      isActive: true,
    });

    res.json({
      success: true,
      data: customers,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalItems: total,
        itemsPerPage: limit,
      },
    });
  } catch (error) {
    console.error("View staff customers error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
};

exports.viewStaffFeddbacks = async (req,res) =>{
try {
  if (req.user.role == "Staff") {
    return res.status(403).json({ success: false, message: "Access denied" });
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = {
    staffId: new mongoose.Types.ObjectId(req.user.id),
    isActive: true
  };
  if (req.query.orderId) filter.orderId = new mongoose.Types.ObjectId(req.user.orderid);
  if (req.query.reservationId) filter.reservationId = new mongoose.Types.ObjectId(req.user.reservationid);
  if (req.query.week) filter.week = parseInt(req.user.week);


  const feedbacks = await Feedback.find(filter)
  .populate("customerId", "name email")
  .populate("orderId", "items totalAmount")
  .populate("reservationId", "customerName phoneNumber")
  .sort({ createdAt: -1 })
  .skip(skip)
  .limit(limit);

  const total = await Feedback.countDocuments(filter);

  console.log("Feedback Data Before Aggregation:", feedbacks);

  const aggregatedRatings = await Feedback.aggregate([
    {
      $match: {
        staffId: new mongoose.Types.ObjectId(req.user.id),
        isActive: true,
        "ratings.customerService": {$exists: true},
        "ratings.punctuality": {$exists: true}
      }
    },
    {
      $group: {
        _id: null, 
       avgcustomerService: {$avg: "$ratings.customerService"},
       avgpunctuality: {$avg: "$ratings.punctuality"},
       totalFeedbacks: {$sum: 1}
      }
    }
  ]);

  console.log("Aggregated Ratings:", aggregatedRatings);

  res.json({
    succecc: true,
    date: feedbacks,
    statictics: aggregatedRatings[0] || {
      avgcustomerService: 0,
      avgpunctuality: 0,
      totalFeedbacks: 0
    },
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
    },
  });
} catch (error) {
  console.error("View staff feedback error:", error);
  res.staus(500).json({
    success: false,
    message: "Server error",
    error: error.message
  });
}
};