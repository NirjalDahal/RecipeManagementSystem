document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("ingredientForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    document.getElementById("ingredientNameError").textContent = "";
    document.getElementById("unitError").textContent = "";

    const ingredient_name = document
      .getElementById("ingredientName")
      .value.trim();
    const default_unit = document.getElementById("unit").value;

    let hasError = false;

    if (!ingredient_name) {
      document.getElementById("ingredientNameError").textContent =
        "Please enter ingredient name";
      hasError = true;
    }

    if (!default_unit) {
      document.getElementById("unitError").textContent = "Please select a unit";
      hasError = true;
    }

    if (hasError) {
      return;
    }

    try {
      const res = await fetch("/api/ingredients", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredient_name,
          default_unit,
        }),
      });

      const data = await res.json();

      if (data.success) {
        alert(data.message);
        form.reset();
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.log("Error:", e);
      alert("Could not connect to the server.");
    }
  });
});
