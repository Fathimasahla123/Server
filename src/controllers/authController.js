const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();

exports.signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let admin = await User.findOne({ email });
    if (admin) {
      return res.status(404).json({ msg: "Admin already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    admin = new User({
      name,
      email,
      password: hashedPassword,
      role: "Admin",
      createdBy: null,
    });
    await admin.save();
    res.status(201).json({ msg: "Admin created successfully" });
  } catch (error) {
    res.status(500).json({ msg: "Internal Server error", error });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ msg: "User does not exist" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role, email: user.email },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
