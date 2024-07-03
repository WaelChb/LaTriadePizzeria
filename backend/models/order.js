const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  pizzas: [
    {
      name: { type: String, required: true },
      imageUrl: { type: String, required: true },
      price: { type: Number, required: true },
      size: { type: String, required: true },
      quantity: { type: Number, required: true },
      instructions: { type: String, default: "aucune" },
    },
  ],
  totalPrice: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "en cours" },
});

orderSchema.index({ totalPrice: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
