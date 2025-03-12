// controllers/authController.js
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
//const bcrypt = require("bcryptjs");

// Signup
const signup = async (req, res) => {
  const { name, email, password, role } = req.body;
  //const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = new User({ name, email, password, role });
    await user.save();

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
 // const hashedPassword = await bcrypt.hash(password, 10);
  try {
    const user = await User.findOne({ email, password});
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = { signup, login };