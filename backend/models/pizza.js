const mongoose = require("mongoose");

const pizzaSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    small: { type: Number, required: true },
    medium: { type: Number, required: true },
    large: { type: Number, required: true },
  },
  imageUrl: { type: String, required: true },
});

const Pizza = mongoose.model("pizza", pizzaSchema);

module.exports = Pizza;
