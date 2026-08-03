document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registrationForm");
  const messageBox = document.getElementById("message");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    messageBox.textContent = "";

    const name = document.getElementById("username").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!name || !email || !password) {
      showMessage("Please fill in all fields.", "error");
      return;
    }

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            name: name, 
            email: email, 
            password: password
         }),
      });
      const data = await res.json();

      if (data.success) {
        showMessage(data.message, "success");
        form.reset();
        setTimeout(() => {
          window.location.href = "login.html";
        }, 1200);
      } else {
        showMessage(data.message, "error");
      }
    } catch (err) {
      showMessage("Could not reach the server. Is it running?", "error");
    }
  });

  function showMessage(text, type) {
    messageBox.textContent = text;
    messageBox.style.color = type === "error" ? "#D6304A" : "#1C8A4B";
  }
});
