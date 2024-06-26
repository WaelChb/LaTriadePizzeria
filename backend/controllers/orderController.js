const Order = require("../models/order");

// Contrôleur pour ajouter une nouvelle commande
exports.addOrder = async (req, res) => {
  try {
    const { pizzas, totalPrice } = req.body;

    // Validation des données
    if (!Array.isArray(pizzas) || pizzas.length === 0 || !totalPrice) {
      return res.status(400).json({ error: "Invalid request body" });
    }

    // Créer une nouvelle commande
    const newOrder = new Order({
      pizzas,
      totalPrice,
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
