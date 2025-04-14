const mongoose = require('mongoose');
const masterSchema = require("./masterModel");

const schemaProduct = mongoose.Schema({
    ...masterSchema.obj,
    name: {type: String, required: true},
    category:{type: String, required: true},
    images: [{ type: String, required: true }], 
    price: { type: Number, required: true },
    description: {type: String, required: true},
  });
  module.exports = mongoose.model("Product", schemaProduct);
  