const Admin = require("../models/admin");
const jwt = require("jsonwebtoken");
const Order = require("../models/order");

const login = async (req, res) => {
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
};

const checkAuth = (req, res) => {
  res.json({ isAdmin: req.user.isAdmin });
};

const logout = (req, res) => {
  res.clearCookie("token"); // Supprime le cookie contenant le token
  res.status(200).json({ message: "Déconnexion réussie" });
};

const getPendingOrders = async (req, res) => {
  try {
    const orders = await Order.find({ status: "en cours" });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
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
};

module.exports = {
  login,
  checkAuth,
  logout,
  getPendingOrders,
  updateOrderStatus,
};
