require("dotenv").config(); // Charger les variables d'environnement

const express = require("express");
const mongoose = require("mongoose");
const session = require("express-session");
const cors = require("cors");
const Pizza = require("./models/pizza");

const app = express();

// Middleware pour parser le JSON
app.use(express.json());
app.use(cors());

// Configuration de mongoose pour se connecter à la base de données MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/LaTriadePizzeria")
  .then(() => {
    console.log("Connexion à MongoDB réussie");
  })
  .catch((error) => {
    console.error("Erreur de connexion à MongoDB:", error);
  });

// Configuration du middleware express-session
app.use(
  session({
    secret: process.env.SESSION_SECRET || "defaultsecret", // Utilisation de la clé secrète depuis les variables d'environnement ou une valeur par défaut
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Mettre true en production avec HTTPS
  })
);

// Routes pour la gestion des pizzas
app.get("/pizzas", async (req, res) => {
  try {
    const pizzas = await Pizza.find();
    res.json(pizzas);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.post("/pizzas", async (req, res) => {
  try {
    const newPizza = new Pizza(req.body);
    await newPizza.save();
    res.status(201).send(newPizza);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.put("/pizzas/:id", async (req, res) => {
  try {
    const updatedPizza = await Pizza.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedPizza) {
      return res.status(404).send();
    }
    res.send(updatedPizza);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Route pour gérer le panier de l'utilisateur
app.get("/cart", (req, res) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  res.json(req.session.cart);
});

app.post("/cart", (req, res) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  const { pizza } = req.body;
  const existingPizza = req.session.cart.find((item) => item._id === pizza._id);
  if (existingPizza) {
    existingPizza.quantity++;
  } else {
    req.session.cart.push({ ...pizza, quantity: 1 });
  }
  res.json(req.session.cart);
});

app.delete("/cart/:id", (req, res) => {
  if (!req.session.cart) {
    req.session.cart = [];
  }
  req.session.cart = req.session.cart.filter(
    (item) => item._id !== req.params.id
  );
  res.json(req.session.cart);
});

// Démarrage du serveur
app.listen(3000, () => {
  console.log("Serveur en cours d'exécution sur http://localhost:3000");
});
