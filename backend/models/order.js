const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  customerName: {
    type: String,
    required: true,
  },
  pizzaType: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  taille: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "en attente",
  },
});

const Order = mongoose.model("Orders", orderSchema);

module.exports = Order;
