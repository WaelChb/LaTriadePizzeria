// Fonction pour récupérer les pizzas depuis l'API
async function fetchPizzas() {
  try {
    const response = await fetch("http://localhost:3000/pizzas");
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const pizzas = await response.json();
    return pizzas;
  } catch (error) {
    console.error("Erreur lors de la récupération des pizzas :", error);
  }
}

// Fonction pour afficher les pizzas dans la liste
async function displayPizzas() {
  const pizzaList = document.getElementById("pizza-list");
  const pizzas = await fetchPizzas();
  pizzaList.innerHTML = ""; // Effacer la liste précédente

  pizzas.forEach((pizza) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <img src="${pizza.imageUrl}" alt="${pizza.name}" class="pizza-image">
      <span>${pizza.name}</span>
      <label for="size-${pizza._id}">Taille :</label>
      <select id="size-${pizza._id}" class="size-select">
        <option value="small" data-price="${pizza.price.small}">Petite - ${pizza.price.small}€</option>
        <option value="medium" data-price="${pizza.price.medium}">Moyenne - ${pizza.price.medium}€</option>
        <option value="large" data-price="${pizza.price.large}">Grande - ${pizza.price.large}€</option>
      </select>
      <button class="add-to-cart-btn">Ajouter au panier</button>
    `;

    const addButton = listItem.querySelector(".add-to-cart-btn");
    addButton.addEventListener("click", () => addToCart(pizza));

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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
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
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    cart = await response.json();
  }

  const cartList = document.getElementById("cart");
  const totalPriceElement = document.getElementById("total-price");
  let totalPrice = 0;

  cartList.innerHTML = "";
  cart.forEach((pizza) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `${item.name} - ${item.price}€ x <input type="number" value="${item.quantity}" min="1" onchange="updateCartItemQuantity('${item._id}', this.value)">`;

    const quantityInput = listItem.querySelector(".quantity-input");
    const removeButton = listItem.querySelector(".remove-btn");
    const instructionsInput = listItem.querySelector(".instructions-input");

    quantityInput.addEventListener("change", (e) => {
      updateQuantity(pizza.name, pizza.size, e.target.value);
    });

    removeButton.addEventListener("click", () => {
      removeFromCart(pizza.name, pizza.size);
    });

    instructionsInput.addEventListener("input", (e) => {
      updateInstructions(pizza.name, pizza.size, e.target.value);
    });

    cartList.appendChild(listItem);
    totalPrice += pizza.price * pizza.quantity;
  });

  totalPriceElement.textContent = totalPrice.toFixed(2) + "€";
}

// Fonction pour mettre à jour la quantité d'un article dans le panier
async function updateCartItemQuantity(id, quantity) {
  try {
    const response = await fetch(`http://localhost:3000/cart/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ pizza: { _id: id }, quantity }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cart = await response.json();
    displayCart(cart);
  } catch (error) {
    console.error(
      "Erreur lors de la création de la session de paiement :",
      error
    );
  }
}

// Fonction pour envoyer la commande après le paiement
async function postOrder(orderData) {
  try {
    const response = await fetch("http://localhost:3000/cart/remove", {
      method: "DELETE", // Change POST to DELETE
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const cart = await response.json();
    displayCart(cart);
  } catch (error) {
    console.error("Erreur lors de l'enregistrement de la commande :", error);
  }
}

// Fonction pour vider le localStorage (nettoyer le panier)
function clearLocalStorage() {
  localStorage.removeItem("cart");
}

// Fonction pour afficher le récapitulatif après paiement
function displaySummary(cart) {
  const summaryContainer = document.getElementById("summary-container");
  summaryContainer.innerHTML = ""; // Effacer le contenu précédent

  const summaryTitle = document.createElement("h2");
  summaryTitle.textContent = "Récapitulatif de commande";

  const summaryList = document.createElement("ul");

  cart.forEach((pizza) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `
      <img src="${pizza.imageUrl}" alt="${pizza.name}" class="pizza-image">
      <span>${pizza.name} - ${pizza.size} - ${pizza.price}€ - Quantité: ${pizza.quantity}</span>
      <p>Instructions spéciales : ${pizza.instructions}</p>
    `;
    summaryList.appendChild(listItem);
  });

  summaryContainer.appendChild(summaryTitle);
  summaryContainer.appendChild(summaryList);
}

// Ajouter un écouteur d'événements au bouton de passage à la caisse
document
  .getElementById("checkout-btn")
  .addEventListener("click", createCheckoutSession);

// Appel de la fonction pour afficher les pizzas au chargement de la page
displayPizzas();
// Appel de la fonction pour afficher le panier au chargement de la page
displayCart();
