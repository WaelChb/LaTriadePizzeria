const express = require("express");
const router = express.Router();
const pizzaController = require("../controllers/pizzaController");

// Route pour récupérer toutes les pizzas
router.get("/", pizzaController.getAllPizzas);

// Route pour ajouter une nouvelle pizza
router.post("/", pizzaController.addPizza);

// Route pour mettre à jour une pizza existante
router.put("/:id", pizzaController.updatePizza);

// Route pour supprimer une pizza existante
router.delete("/:id", pizzaController.deletePizza);

module.exports = router;
