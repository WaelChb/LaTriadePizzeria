let cart = []; // Déclarer et initialiser cart comme un tableau vide

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

    const pizzaImage = document.createElement("img");
    pizzaImage.src = pizza.imageUrl;
    pizzaImage.alt = pizza.name;
    pizzaImage.width = 100; // Définir la largeur de l'image

    const pizzaText = document.createElement("span");
    pizzaText.textContent = `${pizza.name} - ${pizza.description} - ${pizza.price}€`;

    const addButton = document.createElement("button");
    addButton.textContent = "Ajouter au panier";
    addButton.addEventListener("click", () => addToCart(pizza));

    listItem.appendChild(pizzaImage);
    listItem.appendChild(pizzaText);
    listItem.appendChild(addButton);
    pizzaList.appendChild(listItem);
  });
}

function addToCart(pizza) {
  // Vérifie si la pizza est déjà dans le panier
  const existingPizza = cart.find((item) => item.name === pizza.name);
  if (existingPizza) {
    // Si la pizza est déjà dans le panier, incrémente simplement la quantité
    existingPizza.quantity++;
  } else {
    // Sinon, ajoute la pizza au panier avec une quantité de 1
    cart.push({ ...pizza, quantity: 1 });
  }
  // Mise à jour de l'affichage du panier
  displayCart();
}

function removeFromCart(pizzaName) {
  cart = cart.filter((item) => item.name !== pizzaName);
  displayCart();
}

function updateQuantity(pizzaName, quantity) {
  const pizza = cart.find((item) => item.name === pizzaName);
  if (pizza) {
    pizza.quantity = quantity;
  }
  displayCart();
}

// Fonction pour afficher le contenu du panier
function displayCart() {
  const cartList = document.getElementById("cart");
  const totalPriceElement = document.getElementById("total-price");
  cartList.innerHTML = ""; // Effacer le contenu précédent du panier
  let totalPrice = 0; // Initialiser le prix total à 0

  cart.forEach((item) => {
    const cartItem = document.createElement("li");

    const itemText = document.createElement("span");
    itemText.textContent = `${item.name} - `;

    const quantityInput = document.createElement("input");
    quantityInput.type = "number";
    quantityInput.value = item.quantity;
    quantityInput.min = 1;
    quantityInput.addEventListener("change", (e) => {
      updateQuantity(item.name, parseInt(e.target.value, 10));
    });

    const removeButton = document.createElement("button");
    removeButton.textContent = "Supprimer";
    removeButton.addEventListener("click", () => removeFromCart(item.name));

    cartItem.appendChild(itemText);
    cartItem.appendChild(quantityInput);
    cartItem.appendChild(removeButton);

    cartList.appendChild(cartItem);
    totalPrice += item.price * item.quantity; // Mettre à jour le prix total
  });

  // Mettre à jour le prix total affiché
  totalPriceElement.textContent = totalPrice.toFixed(2); // Afficher le prix avec deux décimales
}

// Appel de la fonction pour afficher les pizzas au chargement de la page
displayPizzas();
