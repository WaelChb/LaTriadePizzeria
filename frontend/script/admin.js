async function fetchPendingOrders() {
  try {
    const token = localStorage.getItem("token"); // Récupérez le token JWT depuis le localStorage
    const response = await fetch("http://localhost:3000/admin/orders/pending", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error(
        "Erreur lors de la récupération des commandes : " + response.statusText
      );
    }
    const orders = await response.json();
    return orders;
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
  }
}

function displayOrders(orders) {
  const orderList = document.getElementById("order-list");
  orderList.innerHTML = ""; // Effacer les commandes précédentes

  if (orders && orders.length > 0) {
    orders.forEach((order) => {
      const listItem = document.createElement("li");
      listItem.className = "order-item";

      const orderDetails = order.pizzas
        .map(
          (pizza) => `
        <div class="pizza-item">
          <img src="${pizza.imageUrl}" alt="${pizza.name}" class="pizza-image">
          <span>${pizza.name} - ${pizza.size} - ${pizza.price}€ - Quantité: ${pizza.quantity}</span>
          <p>- Instructions: ${pizza.instructions}</p>
        </div>
      `
        )
        .join("");

      listItem.innerHTML = `
        <div>
          <h3>Commande ID: ${order._id}</h3>
          ${orderDetails}
          <p>Total: ${order.totalPrice}€</p>
          <p>Status: ${order.status}</p>
          <button class="deliver-btn" data-id="${order._id}">Marquer comme à livrer</button>
        </div>
      `;

      orderList.appendChild(listItem);
    });

    // Ajouter un écouteur d'événements pour chaque bouton "Marquer comme à livrer"
    document.querySelectorAll(".deliver-btn").forEach((button) => {
      button.addEventListener("click", async (event) => {
        const orderId = event.target.getAttribute("data-id");
        await markAsDeliver(orderId);
        updateOrders(); // Mettre à jour la liste des commandes après modification
      });
    });
  } else {
    orderList.innerHTML = "<li>Aucune commande en cours</li>";
  }
}

async function markAsDeliver(orderId) {
  try {
    const token = localStorage.getItem("token"); // Récupérez le token JWT depuis le localStorage
    const response = await fetch(
      `http://localhost:3000/admin/orders/${orderId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: "à livrer" }),
      }
    );

    if (!response.ok) {
      throw new Error(
        "Erreur lors de la mise à jour de la commande: " + response.statusText
      );
    }

    const updatedOrder = await response.json();
    console.log("Commande mise à jour:", updatedOrder);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la commande:", error);
  }
}

async function updateOrders() {
  const orders = await fetchPendingOrders();
  if (orders) {
    displayOrders(orders);
  }
}

async function checkAuth() {
  try {
    const token = localStorage.getItem("token"); // Récupérez le token JWT depuis le localStorage
    const response = await fetch("http://localhost:3000/admin/check-auth", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      credentials: "include", // Inclure les cookies
    });
    const result = await response.json();
    if (!result.isAdmin) {
      window.location.href = "http://127.0.0.1:5500/frontend/login.html";
    }
  } catch (error) {
    console.error(
      "Erreur lors de la vérification de l'authentification:",
      error
    );
    window.location.href = "http://127.0.0.1:5500/frontend/login.html";
  }
}

async function logout() {
  try {
    const response = await fetch("http://localhost:3000/admin/logout", {
      method: "POST",
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Erreur lors de la déconnexion: " + response.statusText);
    }
    localStorage.removeItem("token"); // Supprimer le token du stockage local
    window.location.href = "http://127.0.0.1:5500/frontend/login.html";
  } catch (error) {
    console.error("Erreur lors de la déconnexion:", error);
  }
}

document.getElementById("logout-btn").addEventListener("click", logout);

checkAuth();

// Mettre à jour les commandes toutes les 15 secondes
setInterval(updateOrders, 15000);

// Charger les commandes initiales
updateOrders();
