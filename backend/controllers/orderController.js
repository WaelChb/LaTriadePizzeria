const Order = require("../models/order");

// Contrôleur pour ajouter une nouvelle commande
const addOrder = async (req, res) => {
  try {
    const { pizzas, totalPrice, customer } = req.body;

    // Validation des données
    if (
      !Array.isArray(pizzas) ||
      pizzas.length === 0 ||
      !totalPrice ||
      !customer
    ) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Créer une nouvelle commande
    const newOrder = new Order({
      pizzas,
      totalPrice,
      customer,
    });

    // Sauvegarder la commande dans la base de données
    const savedOrder = await newOrder.save();

    // Répondre avec la commande enregistrée
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({ error: "Failed to add order" });
  }
};

const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "en cours" });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getLivraisonOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "à livrer" });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
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
};

module.exports = {
  addOrder,
  getPendingOrders,
  getLivraisonOrders,
  updateOrderStatus,
};
