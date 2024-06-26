const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");
const Order = require("../models/order");

router.post("/", orderController.addOrder);

// Route pour récupérer les commandes "en cours"
router.get("/pending", async (req, res) => {
  try {
    const orders = await Order.find({ status: "en cours" });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
