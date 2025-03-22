require("dotenv").config();
const User = require('../models/userModel');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Reservation = require('../models/reservationModel');
const Staff = require('../models/staffModel');
const Feedback = require('../models/feedbackModel');
const Order = require("../models/orderModel");
const multer = require("multer");
const path = require("path");
const {cloudinary} = require("../config/cloudinaryConfig")


exports.registerCustomer = async (req, res) => {
  try {
    const { name, email } = req.body;
    if(req.user.role !=="Admin")
        return res.status(403).json({ message: "Access denied"});


    let existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(404).json({ msg: "User already exists" });
    }
    const defaultPassword = "customer"
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

   const  customer = User.create({ name, email, password: hashedPassword, role: "Customer",createdBy: req.user._id, isFirstLogin: true });
    await admin.save();
    res.status(201).json({ msg: "Customer registered successfully",
        customer: {
            id: (await customer)._id,
            name: (await customer).name,
            email: (await customer).email,
            defaultPassword
        }
     });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ msg: "Internal Server error", error });
  }
};

exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;
    const customer = await User.findOne({ email, role:"Customer" });
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
        res.status(200).json({ message:"Login successfull", token,
            customer: {
                id: customer._id, name: customer.name, email: customer.email,
                isFirstLogin: customer.isFirstLogin
            }
         });
  } catch (err) {
    console.error(" Login eror:", error);
    res.status(500).json({ error: err.message });
  }
};