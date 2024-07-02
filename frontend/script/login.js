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
      console.log(result.message);
      // Redirigez vers admin.html si l'authentification est réussie
      window.location.href = "http://127.0.0.1:5500/frontend/admin.html";
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  });
