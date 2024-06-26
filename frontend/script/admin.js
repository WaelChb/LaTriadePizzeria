async function fetchPendingOrders() {
  try {
    const response = await fetch("http://localhost:3000/orders/pending");
    const orders = await response.json();
    return orders;
  } catch (error) {
    console.error("Erreur lors de la récupération des commandes :", error);
  }
}

function displayOrders(orders) {
  const orderList = document.getElementById("order-list");
  orderList.innerHTML = ""; // Effacer les commandes précédentes

  orders.forEach((order) => {
    const listItem = document.createElement("li");
    listItem.className = "order-item";

    const orderDetails = order.pizzas
      .map(
        (pizza) => `
      <div class="pizza-item">
        <img src="${pizza.imageUrl}" alt="${pizza.name}" class="pizza-image">
        <span>${pizza.name} - ${pizza.size} - ${pizza.price}€ - Quantité: ${pizza.quantity}</span>
        <p>Instructions: ${pizza.instructions}</p>
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
      </div>
    `;

    orderList.appendChild(listItem);
  });
}

async function updateOrders() {
  const orders = await fetchPendingOrders();
  displayOrders(orders);
}

// Mettre à jour les commandes toutes les 15 secondes
setInterval(updateOrders, 15000);

// Charger les commandes initiales
updateOrders();
