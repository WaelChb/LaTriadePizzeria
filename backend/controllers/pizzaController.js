const Pizza = require("../models/pizza");

// Contrôleur pour récupérer toutes les pizzas
exports.getAllPizzas = async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Contrôleur pour ajouter une nouvelle pizza
exports.addPizza = async (req, res) => {
  try {
    const pizza = new Pizza(req.body);
    await pizza.save();
    res.status(201).json(pizza);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Contrôleur pour mettre à jour une pizza existante
exports.updatePizza = async (req, res) => {
  try {
    const pizza = await Pizza.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!pizza) {
      return res.status(404).json({ error: "Pizza non trouvée" });
    }
    res.json(pizza);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer une route
exports.deletePizza = async (req, res) => {
  const { id } = req.params;
  try {
    const pizza = await Pizza.findByIdAndDelete(id);
    if (!pizza) {
      return res.status(404).json({ error: "Pizza non trouvée" });
    }
    res.json(pizza);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la mise à jour de la pizza" });
  }
};
