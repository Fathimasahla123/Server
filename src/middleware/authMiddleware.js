const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel");

module.exports  = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.split(" ")[1];
  if(!token) return res.status(400).json({msg:"Access denied! No token provided"})
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select("password");

    if (!req.user)return res.staus(401).json({msg:"Unauthorized,User not found"}) 
    next();
  } catch (error) {
    console.error("Authorization error",error);
    res.status(500).json({msg:"Invalid or expired token" });
  }
};

exports.adminOnly  = (req,res,next) => {
  
    if (req.user.role !== "admin") {
      return res.status(403).json({ error: "Access denied." });
    }
    next();
  };


