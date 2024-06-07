const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema({
  product: String,
  quantity: Number,
  price: Number,
  customerName: String,
  taille: String,
  address: String,
  status: { type: String, default: "En attente" },
});

module.exports = mongoose.model("Order", OrderSchema);
