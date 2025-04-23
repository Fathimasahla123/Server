const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");
const Staff = require("../models/staffModel");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
    if (!token) {
      return res
        .status(401)
        .json({ success: false, message: "Access denied! No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded?.id) {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }

    let user = await User.findById(decoded.id).select("-password");
    if (!user) {
      user = await Staff.findById(decoded.id).select("-password");
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "User not found" });
      }
    }

    req.user = user;
    next();
  } catch (error) {
    console.error("Authentication error:", error);

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ success: false, message: "Invalid token" });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ success: false, message: "Token expired" });
    }

    res.status(500).json({ success: false, message: "Authentication failed" });
  }
};

exports.adminOnly = (req, res, next) => {
  if (!req.user) {
    return res
      .status(401)
      .json({ success: false, message: "Not authenticated" });
  }

  if (req.user.role !== "Admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin privileges required.",
    });
  }

  next();
};



exports.authenticateStaff = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    // First try to authenticate as User
    const user = await User.findOne({ token });
    if (user?.role === "Staff") {
      req.user = user;
      return next();
    }
    
    // Then try to authenticate as Admin-created Staff
    const staff = await Staff.findOne({ token });
    if (staff) {
      req.staff = staff;
      return next();
    }
    
    throw new Error("Authentication failed");
  } catch (error) {
    res.status(401).send({ error: "Please authenticate" });
  }
};

exports.auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    let user;
    if (decoded.isStaff) {
      user = await Staff.findOne({ _id: decoded.id, "tokens.token": token });
    } else {
      user = await User.findOne({ _id: decoded.id, "tokens.token": token });
    }

    if (!user) {
      throw new Error();
    }

    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "Please authenticate" });
  }
};