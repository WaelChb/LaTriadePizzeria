const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Pizza = require("./models/pizza");

const app = express();

// Middleware pour analyser le JSON dans les requêtes
app.use(express.json());
app.use(cors());

// Connexion à MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/LaTriadePizzeria")
  .then(() => {
    console.log("Connexion à MongoDB réussie");
  })
  .catch((error) => {
    console.error("Erreur de connexion à MongoDB:", error);
  });

// Route pour récupérer toutes les pizzas
app.get("/pizzas", async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erreur lors de la récupération des pizzas" });
  }
});

// Route pour ajouter une nouvelle pizza
app.post("/pizzas", async (req, res) => {
  const { name, description, price, imageUrl } = req.body;
  const newPizza = new Pizza({ name, description, price, imageUrl });

  try {
    const savedPizza = await newPizza.save();
    res.status(201).json(savedPizza);
  } catch (error) {
    res.status(400).json({ error: "Erreur lors de l'ajout de la pizza" });
  }
});

// Route pour mettre à jour une pizza
app.put("/pizzas/:id", async (req, res) => {
  const { id } = req.params;
  const { name, description, price, imageUrl } = req.body;

  try {
    const updatedPizza = await Pizza.findByIdAndUpdate(
      id,
      { name, description, price, imageUrl },
      { new: true, runValidators: true }
    );
    if (!updatedPizza) {
      return res.status(404).json({ error: "Pizza non trouvée" });
    }
    res.json(updatedPizza);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erreur lors de la mise à jour de la pizza" });
  }
});

// Démarrage du serveur
app.listen(3000, () => {
  console.log("Serveur en cours d'exécution sur http://localhost:3000");
});
