const mongoose = require('mongoose');
const masterSchema = require("./masterModel");

const schemaProduct = mongoose.Schema({
    ...masterSchema.obj,
    name: {type: String, required: true},
    category:{type: String, required: true},
    image: {type: String, required: true},
    price: {type: String, required: true},
    description: {type: String, required: true},
  });
  module.exports = mongoose.model("Product", schemaProduct);
  