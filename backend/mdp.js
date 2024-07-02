require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/admin");

// Connexion à la base de données MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/LaTriadePizzeria", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connecté à MongoDB"))
  .catch((err) => console.error("Erreur de connexion à MongoDB:", err));

async function createAdmin() {
  const admin = new Admin({
    username: "admin",
    password: "admin", // Note: Hash the password in a real application for security reasons
  });

  try {
    await admin.save();
    console.log("Nouvel utilisateur administrateur créé:", admin);
  } catch (err) {
    console.error(
      "Erreur lors de la création de l'utilisateur administrateur:",
      err
    );
  } finally {
    mongoose.connection.close();
  }
}

createAdmin();
