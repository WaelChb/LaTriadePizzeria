// Fonction pour récupérer les pizzas depuis l'API
async function fetchPizzas() {
  try {
    const response = await fetch("http://localhost:3000/pizzas");
    const pizzas = await response.json();
    return pizzas;
  } catch (error) {
    console.error("Erreur lors de la récupération des pizzas:", error);
  }
}

// Fonction pour afficher les pizzas dans la liste
async function displayPizzas() {
  const pizzaList = document.getElementById("pizza-list");
  const pizzas = await fetchPizzas();
  pizzaList.innerHTML = ""; // Effacer la liste précédente

  pizzas.forEach((pizza) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<img src="${pizza.imageUrl}" alt="${pizza.name}" style="width: 50px; height: 50px;"> ${pizza.name} - ${pizza.description} - ${pizza.price}€`;
    const addButton = document.createElement("button");
    addButton.textContent = "Ajouter au panier";
    addButton.addEventListener("click", () => addToCart(pizza));
    listItem.appendChild(addButton);
    pizzaList.appendChild(listItem);
  });
}

// Fonction pour ajouter une pizza au panier
async function addToCart(pizza) {
  try {
    const response = await fetch("http://localhost:3000/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pizza }),
    });
    const cart = await response.json();
    displayCart(cart);
  } catch (error) {
    console.error("Erreur lors de l'ajout au panier:", error);
  }
}

// Fonction pour afficher le panier
async function displayCart(cart) {
  if (!cart) {
    const response = await fetch("http://localhost:3000/cart");
    cart = await response.json();
  }

  const cartList = document.getElementById("cart");
  cartList.innerHTML = ""; // Effacer le panier précédent

  let totalPrice = 0;

  cart.forEach((item) => {
    totalPrice += item.price * item.quantity;

    const listItem = document.createElement("li");
    listItem.innerHTML = `${item.name} - ${item.price}€ x <input type="number" value="${item.quantity}" min="1" onchange="updateCartItemQuantity('${item.name}', this.value)">`;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Supprimer";
    removeButton.addEventListener("click", () => removeFromCart(item));
    listItem.appendChild(removeButton);

    cartList.appendChild(listItem);
  });

  document.getElementById("total-price").textContent = totalPrice.toFixed(2);
}

// Fonction pour mettre à jour la quantité d'un article dans le panier
async function updateCartItemQuantity(name, quantity) {
  try {
    const response = await fetch("http://localhost:3000/cart/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pizza: { name }, quantity }),
    });
    const cart = await response.json();
    displayCart(cart);
  } catch (error) {
    console.error("Erreur lors de la mise à jour de la quantité:", error);
  }
}

// Fonction pour supprimer une pizza du panier
async function removeFromCart(pizza) {
  try {
    const response = await fetch("http://localhost:3000/cart/remove", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pizza }),
    });
    const cart = await response.json();
    displayCart(cart);
  } catch (error) {
    console.error("Erreur lors de la suppression du panier:", error);
  }
}

// Appel de la fonction pour afficher les pizzas au chargement de la page
displayPizzas();
displayCart();
