const User = require("../models/userModel");
const Staff = require("../models/staffModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    let user = await User.findOne({ email });
    if (user) {
      return res.status(404).json({ msg: "user already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    user= new User({
      name,
      email,
      password: hashedPassword,
      role ,
      createdBy: null,
    });
    await user.save();
    res.status(201).json({ success: true,  msg: "signup successfull", user});
  } catch (error) {
    res.status(500).json({ msg: "Internal Server error", error: error.message});
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // First try to find in User collection
    let user = await User.findOne({ email });
    let isStaff = false;

    // If not found in User collection, check Staff collection
    if (!user) {
      user = await Staff.findOne({ email });
      isStaff = true;
    }

    if (!user) {
      return res.status(404).json({ success: false, message: "User does not exist" });
    }

    // const isMatch = await bcrypt.compare(password, user.password);
    // if (!isMatch) {
    //   return res.status(400).json({ success: false, message: "Invalid credentials" });
    // }

    // Determine the role - prioritize the role field, fallback to isStaff
    const role = user.role || (isStaff ? "Staff" : null);
    if (!role) {
      return res.status(403).json({ success: false, message: "User role not defined" });
    }

    const token = jwt.sign(
      { 
        id: user._id, 
        role: role,
        email: user.email,
        isStaff: isStaff // Add this flag to distinguish staff types
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: role,
        isStaff: isStaff
      },
      token
    });

  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ 
      success: false,
      message: "Server error",
      error: err.message 
    });
  }
};

