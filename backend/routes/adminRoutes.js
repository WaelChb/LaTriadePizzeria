const express = require("express");
const router = express.Router();
const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const Order = require("../models/order");

// Route pour la connexion admin
router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const admin = await Admin.findOne({ username });
    if (!admin || admin.password !== password) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }
    const token = jwt.sign(
      { username: admin.username, isAdmin: true },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Middleware pour vérifier le JWT
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Token invalide" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Token non fourni" });
  }
};

// Route pour vérifier l'authentification
router.get("/check-auth", authenticateJWT, (req, res) => {
  res.json({ isAdmin: req.user.isAdmin });
});

// Route pour la déconnexion admin
router.post("/logout", (req, res) => {
  res.clearCookie("token"); // Supprime le cookie contenant le token
  res.status(200).json({ message: "Déconnexion réussie" });
});

// Route pour récupérer les commandes "en cours"
router.get("/orders/pending", authenticateJWT, async (req, res) => {
  try {
    const orders = await Order.find({ status: "en cours" });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route pour mettre à jour le statut d'une commande
router.patch("/orders/:id", authenticateJWT, async (req, res) => {
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
