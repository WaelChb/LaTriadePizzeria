const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Pizza = require("./models/pizza");
const Order = require("./models/order");
const app = express();
const port = 3000;

// Middleware pour activer CORS
app.use(cors());
// Middleware pour parser le JSON
app.use(express.json());

// Connexion à la base de données MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/LaTriadePizzeria")
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion à MongoDB", err));

// Routes de l'API

// Créer une nouvelle pizza
app.post("/pizzas", async (req, res) => {
  try {
    const newPizza = new Pizza(req.body);
    const savedPizza = await newPizza.save();
    res.status(201).send(savedPizza);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Créer une nouvelle commande
app.post("/orders", async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    const savedOrder = await newOrder.save();
    res.status(201).send(savedOrder);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Récupérer toutes les pizzas
app.get("/pizzas", async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.status(200).send(pizzas);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Récupérer toutes les commandes
app.get("/orders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Récupérer une commande par ID
app.get("/orders/:id", async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).send("Commande non trouvée");
    }
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Mettre à jour une commande
app.put("/orders/:id", async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );
    if (!updatedOrder) {
      return res.status(404).send("Commande non trouvée");
    }
    res.status(200).send(updatedOrder);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Supprimer une commande
app.delete("/orders/:id", async (req, res) => {
  try {
    const deletedOrder = await Order.findByIdAndDelete(req.params.id);
    if (!deletedOrder) {
      return res.status(404).send("Commande non trouvée");
    }
    res.status(200).send("Commande supprimée");
  } catch (error) {
    res.status(500).send(error);
  }
});

// Démarrer le serveur
app.listen(port, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
