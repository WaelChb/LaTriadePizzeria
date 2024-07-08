document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    try {
      const response = await fetch("http://localhost:3000/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
        credentials: "include", // Inclure les cookies
      });

      if (!response.ok) {
        throw new Error("Erreur de connexion: " + response.statusText);
      }

      const result = await response.json();
      localStorage.setItem("token", result.token); // Stockez le token JWT dans le localStorage
      console.log(result.message);

      // Afficher la pop-up pour choisir la redirection
      showRedirectionPopup();
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  });

function showRedirectionPopup() {
  // Créer la pop-up et les boutons
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "50%";
  popup.style.transform = "translate(-50%, -50%)";
  popup.style.backgroundColor = "white";
  popup.style.padding = "20px";
  popup.style.boxShadow = "0 0 10px rgba(0, 0, 0, 0.5)";
  popup.style.zIndex = "1000";

  const message = document.createElement("p");
  message.innerText = "Choisissez la page où vous souhaitez aller :";
  popup.appendChild(message);

  const adminButton = document.createElement("button");
  adminButton.innerText = "Admin";
  adminButton.style.margin = "10px";
  adminButton.addEventListener("click", () => {
    window.location.href = "http://127.0.0.1:5500/frontend/admin.html";
  });
  popup.appendChild(adminButton);

  const deliveryButton = document.createElement("button");
  deliveryButton.innerText = "Livraison";
  deliveryButton.style.margin = "10px";
  deliveryButton.addEventListener("click", () => {
    window.location.href = "http://127.0.0.1:5500/frontend/livraison.html";
  });
  popup.appendChild(deliveryButton);

  // Ajouter la pop-up au document
  document.body.appendChild(popup);
}
