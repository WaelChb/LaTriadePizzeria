const express = require("express");
const router = express.Router();
const orderController = require("../controllers/orderController");

router.post("/", orderController.addOrder);

// Route pour récupérer les commandes "en cours"
router.get("/pending", orderController.getPendingOrders);

// Route pour récupérer les commandes "à livrer"
router.get("/livraison", orderController.getLivraisonOrders);

// Route pour mettre à jour le statut d'une commande
router.patch("/:id", orderController.updateOrderStatus);

module.exports = router;
