const express = require("express");
const router = express.Router();
const {
  login,
  checkAuth,
  logout,
  getPendingOrders,
  updateOrderStatus,
} = require("../controllers/adminController");
const jwt = require("jsonwebtoken");

// Route pour la connexion admin
router.post("/login", login);

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
router.get("/check-auth", authenticateJWT, checkAuth);

// Route pour la déconnexion admin
router.post("/logout", logout);

// Route pour récupérer les commandes "en cours"
router.get("/orders/pending", authenticateJWT, getPendingOrders);

// Route pour mettre à jour le statut d'une commande
router.patch("/orders/:id", authenticateJWT, updateOrderStatus);

module.exports = router;
