require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const orderRoutes = require("./routes/orderRoutes");
const pizzaRoutes = require("./routes/pizzas");
const adminRoutes = require("./routes/adminRoutes");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const app = express();
const PORT = 3000;

// Middleware CORS pour autoriser les requêtes cross-origin
app.use(
  cors({
    origin: "http://127.0.0.1:5500", // Remplacez par l'origine de votre frontend
    credentials: true, // Permettre l'envoi des cookies
  })
);

// Middleware pour parser les corps de requêtes en JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/pizzas", pizzaRoutes);
app.use("/orders", orderRoutes);
app.use("/admin", adminRoutes);

// Connexion à la base de données MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/LaTriadePizzeria")
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err));

// Route pour créer une session de paiement
app.post("/create-checkout-session", async (req, res) => {
  const { cart } = req.body;

  const lineItems = cart.map((item) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.name,
        images: [item.imageUrl],
      },
      unit_amount: item.price * 100,
    },
    quantity: item.quantity,
  }));

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: "http://127.0.0.1:5500/frontend/summary.html",
    cancel_url: "http://127.0.0.1:5500/frontend/index.html",
  });

  res.json({ id: session.id });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
