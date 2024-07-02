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
// Route pour récupérer les commandes "à livrer"
router.get("/livraison", async (req, res) => {
  try {
    const orders = await Order.find({ status: "à livrer" });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour mettre à jour le statut d'une commande
router.patch("/:id", async (req, res) => {
  try {
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
