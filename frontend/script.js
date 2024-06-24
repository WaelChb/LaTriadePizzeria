// Fonction pour récupérer les pizzas depuis l'API
async function fetchPizzas() {
  try {
    const response = await fetch("http://localhost:3000/pizzas"); // Modifier l'URL selon votre configuration
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
function addToCart(pizza) {
  const sizeSelect = document.getElementById(`size-${pizza._id}`);
  const selectedSize = sizeSelect.options[sizeSelect.selectedIndex];
  const size = selectedSize.value;
  const price = parseFloat(selectedSize.getAttribute("data-price"));

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const existingPizza = cart.find(
    (item) => item.name === pizza.name && item.size === size
  );

  if (existingPizza) {
    existingPizza.quantity++;
  } else {
    cart.push({ ...pizza, size, price, quantity: 1, instructions: "" });
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
      <span class="pizza-info">${pizza.name} - ${pizza.size} - ${pizza.price}€ - Quantité: ${pizza.quantity}</span>
      <div class="cart-buttons">
        <input type="number" value="${pizza.quantity}" min="1" class="quantity-input">
        <button class="remove-btn">Supprimer</button>
      </div>
      <div class="instructions">
        <label for="instructions-${pizza.name}-${pizza.size}">Instructions :</label>
        <input type="text" id="instructions-${pizza.name}-${pizza.size}" class="instructions-input" value="${pizza.instructions}">
      </div>
    `;

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

// Fonction pour mettre à jour la quantité d'une pizza dans le panier
function updateQuantity(name, size, quantity) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const pizza = cart.find((item) => item.name === name && item.size === size);
  if (pizza) {
    pizza.quantity = parseInt(quantity);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  displayCart();
}

// Fonction pour mettre à jour les instructions d'une pizza dans le panier
function updateInstructions(name, size, instructions) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const pizza = cart.find((item) => item.name === name && item.size === size);
  if (pizza) {
    pizza.instructions = instructions;
  }

  localStorage.setItem("cart", JSON.stringify(cart));
}

// Fonction pour supprimer une pizza du panier
function removeFromCart(name, size) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart = cart.filter((pizza) => !(pizza.name === name && pizza.size === size));
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

  // Collecter les instructions spéciales pour chaque pizza
  const cartWithInstructions = cart.map((pizza) => ({
    name: pizza.name,
    imageUrl: pizza.imageUrl,
    price: pizza.price,
    size: pizza.size,
    quantity: pizza.quantity,
    instructions: pizza.instructions,
  }));

  try {
    // Envoyer la requête pour créer une session de paiement avec Stripe
    const response = await fetch(
      "http://localhost:3000/create-checkout-session",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cart: cartWithInstructions }),
      }
    );

    const session = await response.json();
    const stripe = Stripe(
      "pk_test_51PQ8QrCTtgA7o8OEzNMBH2feWM6FxgnCYmPVfude8E8eyiGS1EbCLp74iH0ODwUW2AeMhxB4GyyO23RbxQiwpNM300om8sfV99"
    );

    // Attendre la redirection vers la page de paiement
    await stripe.redirectToCheckout({ sessionId: session.id });

    // Une fois le paiement validé et le retour sur la page de succès,
    // envoyer les détails de la commande au backend pour enregistrement
    const orderData = {
      pizzas: cartWithInstructions,
      totalPrice: calculateTotalPrice(cartWithInstructions),
    };
    await postOrder(orderData);
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
    const response = await fetch("http://localhost:3000/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    });

    if (!response.ok) {
      throw new Error(
        "Erreur lors de l'enregistrement de la commande : " +
          response.statusText
      );
    }

    const savedOrder = await response.json();
    console.log("Commande enregistrée :", savedOrder);

    // Vider le panier dans le localStorage après avoir enregistré la commande
    clearLocalStorage();
    displaySummary(orderData.pizzas); // Afficher le récapitulatif sur summary.html ou autre
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
