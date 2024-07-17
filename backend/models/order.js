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
  customer: {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    additionalInfo: { type: String, default: "" },
  },
  createdAt: { type: Date, default: Date.now },
  status: { type: String, default: "en cours" },
});

orderSchema.index({ totalPrice: 1, createdAt: -1 });

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
