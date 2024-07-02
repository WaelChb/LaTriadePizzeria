const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const Order = require("../models/order");

// Route pour gérer la connexion admin
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log("Tentative de connexion avec les identifiants:", {
      username,
      password,
    });
    const admin = await Admin.findOne({ username });

    if (!admin) {
      console.log("Admin non trouvé");
      return res
        .status(401)
        .json({ message: "Identifiant ou mot de passe incorrect" });
    }

    console.log("Mot de passe en base de données :", admin.password);

    const isMatch = password === admin.password;
    console.log("Mot de passe correspondant :", isMatch);

    if (isMatch) {
      req.session.isAdmin = true;
      req.session.save((err) => {
        if (err) {
          console.error("Erreur lors de la sauvegarde de la session:", err);
          return res.status(500).json({ message: "Erreur interne du serveur" });
        }
        console.log("Session après connexion:", req.session);
        res.status(200).json({ message: "Authentification réussie" });
      });
    } else {
      res
        .status(401)
        .json({ message: "Identifiant ou mot de passe incorrect" });
    }
  } catch (error) {
    console.error("Erreur lors de la tentative de connexion:", error);
    res.status(500).json({ message: error.message });
  }
});

// Route pour vérifier l'authentification
router.get("/check-auth", (req, res) => {
  console.log(req.session.isAdmin, "la binks");
  console.log("Vérification de l'authentification, session:", req.session);
  if (req.session.isAdmin) {
    res.status(200).json({ isAdmin: true });
  } else {
    res.status(401).json({ isAdmin: false });
  }
});

// Route pour récupérer les commandes "en cours"
router.get("/orders/pending", async (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  try {
    const orders = await Order.find({ status: "en cours" });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour mettre à jour le statut d'une commande
router.patch("/orders/:id", async (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
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

// Route pour récupérer les commandes "en cours"
router.get("/orders/pending", async (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  try {
    const orders = await Order.find({ status: "en cours" });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour mettre à jour le statut d'une commande
router.patch("/orders/:id", async (req, res) => {
  if (!req.session.isAdmin) {
    return res.status(401).json({ message: "Non autorisé" });
  }

  try {
    const orderId = req.params.id;
    const { status } = req.body;

    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
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
