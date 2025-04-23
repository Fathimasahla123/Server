const User = require("../models/userModel");
const Staff = require("../models/staffModel");
const Order = require("../models/orderModel");
const Feedback = require("../models/feedbackModel");
const Reservation = require("../models/reservationModel");
const Product = require("../models/productModel");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");


exports.addUser = async (req, res) => {
  try {
    console.log("Request Body:", req.body);
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const { name, email, password, role } = req.body;
    // console.log("Extracted role:", role);
    if (!["Customer", "Staff"].includes(role))
      return res.status(400).json({ message: "Invalid role" });

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
    res.json({ success:true,  message: " User deleted successfully" });
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
    if (req.user.role !== "Admin") {
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

exports.updateStaff = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    const updates = req.body;
    const staffId = req.params.id;

    // Try to update in both collections
    const [updatedUser, updatedStaff] = await Promise.all([
      User.findOneAndUpdate(
        { _id: staffId, role: "Staff" },
        updates,
        { new: true }
      ),
      Staff.findOneAndUpdate(
        { _id: staffId, role: "Staff" },
        updates,
        { new: true }
      )
    ]);

    // Determine which update was successful
    let updatedRecord = null;
    let staffType = null;

    if (updatedUser) {
      updatedRecord = updatedUser;
      staffType = "User";
    } else if (updatedStaff) {
      updatedRecord = updatedStaff;
      staffType = "Admin";
    }

    if (!updatedRecord) {
      return res.status(404).json({ 
        success: false,
        message: "Staff not found" 
      });
    }

    // Prepare the response data
    const responseData = {
      ...updatedRecord.toObject(),
      staffType
    };

    res.status(200).json({
      success: true,
      message: "Staff updated successfully",
      data: responseData
    });

  } catch (error) {
    console.error("Error updating staff:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message.includes("Cast to ObjectId failed") 
        ? "Invalid staff ID format"
        : error.message
    });
  }
};

exports.deleteStaff = async (req, res) => {
  try {
    if (req.user.role !== "Admin") {
      return res.status(403).json({ 
        success: false,
        message: "Access denied" 
      });
    }

    const staffId = req.params.id;

    // Try to delete from both collections
    const [deletedUser, deletedStaff] = await Promise.all([
      User.findOneAndDelete({ _id: staffId, role: "Staff" }),
      Staff.findOneAndDelete({ _id: staffId, role: "Staff" })
    ]);

    // Determine which deletion was successful
    let deletedRecord = null;
    let staffType = null;

    if (deletedUser) {
      deletedRecord = deletedUser;
      staffType = "User";
    } else if (deletedStaff) {
      deletedRecord = deletedStaff;
      staffType = "Admin";
    }

    if (!deletedRecord) {
      return res.status(404).json({ 
        success: false,
        message: "Staff not found" 
      });
    }

    // Prepare the response data
    const responseData = {
      ...deletedRecord.toObject(),
      staffType
    };

    res.status(200).json({
      success: true,
      message: "Staff deleted successfully",
      data: responseData
    });

  } catch (error) {
    console.error("Error deleting staff:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message.includes("Cast to ObjectId failed") 
        ? "Invalid staff ID format"
        : error.message
    });
  }
};


exports.listOrders = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    //const order = await Order.find();
    const order = await Order.find()
  .populate('customerName', 'name ') // Only include name and email
  .populate('staffId', 'name ')    // Only include name and email
  .sort({ createdAt: -1 });
    res.json({ order });
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

        const { name, category, price, description, images } = req.body;
        
        if (!name || !category || !price || !images || images.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Name, category, price and at least one image are required",
            });
        }

        const newProduct = new Product({
            name,
            category,
            images, // Now accepts array of image URLs
            price: Number(price),
            description,
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
                images: newProduct.images
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
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } },
            ];
        }

        const products = await Product.find(filter)
            .select("-__v")
            .sort({ createdAt: -1 })
            .lean();

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

exports.updateProduct = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "product not found" });
    res.json({ message: " product updated successfully", product });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
    try {
        if (req.user.role !== "Admin") {
            return res.status(403).json({
                success: false,
                message: "Access denied.",
            });
        }

        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }

        // Optional: Delete images from storage
        // You would need to implement this based on your storage solution

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });
    } catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: error.message,
        });
    }
};

exports.listFeedbacks = async (req, res) => {
  try {
    if (req.user.role !== "Admin")
      return res.status(403).json({ msg: "Access denied" });
    const feedback = await Feedback.find();
    res.status(200).json({ success: true, feedback });
  } catch (error) {
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};