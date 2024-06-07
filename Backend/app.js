const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const orderRoutes = require("./routes/orders");

const app = express();
const port = 3000;

// Connexion à la base de données MongoDB
mongoose.connect("mongodb://localhost/commande-db", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Middleware
app.use(bodyParser.json());

// Routes
app.use("/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("Bienvenue à l'application de prise de commande");
});

// Démarrage du serveur
app.listen(port, () => {
  console.log(`Serveur démarré sur http://localhost:${port}`);
});
