const mongoose = require("mongoose");
const masterSchema = require("./masterModel");

const userSchema = new mongoose.Schema({
  ...masterSchema.obj,
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {type: String, enum: ["Customer", "Staff", "Admin"],default: "Customer" , required: true},
  profileImage: String,
  profileImageUrl: String,
  createdAt: { type: Date, default: Date.now },
});

userSchema.pre("save",function (next){
  if(this.role ==="Admin"){
    this.createdBy = undefined
  }
  next();
})

module.exports = mongoose.model("User", userSchema);
