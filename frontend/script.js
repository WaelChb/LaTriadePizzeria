// Fonction pour récupérer les pizzas depuis l'API
async function fetchPizzas() {
  try {
    const response = await fetch("http://localhost:3000/pizzas"); // Modifier l'URL selon votre configuration
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
    listItem.innerHTML = `
      <img src="${pizza.imageUrl}" alt="${pizza.name}" class="pizza-image">
      <span>${pizza.name} - ${pizza.price}€</span>
      <button class="add-to-cart-btn">Ajouter au panier</button>
    `;

    const addButton = listItem.querySelector(".add-to-cart-btn");
    addButton.addEventListener("click", () => addToCart(pizza));

    pizzaList.appendChild(listItem);
  });
}

// Fonction pour ajouter une pizza au panier
function addToCart(pizza) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingPizza = cart.find((item) => item.name === pizza.name);

  if (existingPizza) {
    existingPizza.quantity++;
  } else {
    cart.push({ ...pizza, quantity: 1 });
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Fonction pour afficher le panier
function displayCart() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  const cartList = document.getElementById("cart");
  const totalPriceElement = document.getElementById("total-price");
  let totalPrice = 0;

  cartList.innerHTML = "";
  cart.forEach((pizza) => {
    const listItem = document.createElement("li");
    listItem.setAttribute("data-name", pizza.name);
    listItem.innerHTML = `
      <img src="${pizza.imageUrl}" alt="${pizza.name}" class="pizza-image">
      <span class="pizza-info">${pizza.name} - ${pizza.price}€ - Quantité: ${pizza.quantity}</span>
      <div class="cart-buttons">
        <input type="number" value="${pizza.quantity}" min="1" class="quantity-input">
        <button class="remove-btn">Supprimer</button>
      </div>
    `;

    const quantityInput = listItem.querySelector(".quantity-input");
    const removeButton = listItem.querySelector(".remove-btn");

    quantityInput.addEventListener("change", (e) => {
      updateQuantity(pizza.name, e.target.value);
    });

    removeButton.addEventListener("click", () => {
      removeFromCart(pizza.name);
    });

    cartList.appendChild(listItem);
    totalPrice += pizza.price * pizza.quantity;
  });

  totalPriceElement.textContent = totalPrice.toFixed(2) + "€";
}

// Fonction pour mettre à jour la quantité d'une pizza dans le panier
function updateQuantity(name, quantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const pizza = cart.find((item) => item.name === name);
  if (pizza) {
    pizza.quantity = parseInt(quantity);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Fonction pour supprimer une pizza du panier
function removeFromCart(name) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((pizza) => pizza.name !== name);
  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Fonction pour créer une session de paiement
async function createCheckoutSession() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  try {
    const response = await fetch(
      "http://localhost:3000/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart }),
      }
    );

    const session = await response.json();
    const stripe = Stripe(
      "pk_test_51PQ8QrCTtgA7o8OEzNMBH2feWM6FxgnCYmPVfude8E8eyiGS1EbCLp74iH0ODwUW2AeMhxB4GyyO23RbxQiwpNM300om8sfV99"
    );
    await stripe.redirectToCheckout({ sessionId: session.id });
  } catch (error) {
    console.error(
      "Erreur lors de la création de la session de paiement:",
      error
    );
  }
}

// Ajouter un écouteur d'événements au bouton de passage à la caisse
document
  .getElementById("checkout-btn")
  .addEventListener("click", createCheckoutSession);

// Appel de la fonction pour afficher les pizzas au chargement de la page
displayPizzas();
// Appel de la fonction pour afficher le panier au chargement de la page
displayCart();
