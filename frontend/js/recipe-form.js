document.addEventListener("DOMContentLoaded", () => {
  let ingredients = [];

  async function loadIngredients() {
    const res = await fetch("/api/ingredients");
    ingredients = await res.json();
  }

  loadIngredients();
  const form = document.getElementsByClassName("recipeForm")[0];

  const ingredientsSection = document.getElementsByClassName(
    "ingredients-section",
  )[0];

  const addButton = document.getElementById("add-btn");

  addButton.addEventListener("click", () => {
    const ingredientRow = document.createElement("div");
    ingredientRow.className = "ingredient-row";

    let options = `<option value="">Select Ingredient</option>`;

    ingredients.forEach((ingredient) => {
      options += `
      <option
        value="${ingredient.ingredient_id}"
        data-unit="${ingredient.default_unit}">
        ${ingredient.ingredient_name}
      </option>`;
    });

    ingredientRow.innerHTML = `
    <select class="ingredient-select">
      ${options}
    </select>

    <input type="number" placeholder="Quantity" min="0">

    <span class="unit"></span>

    <button type="button" class="remove-btn">Remove</button>
  `;

    ingredientsSection.insertBefore(ingredientRow, addButton);
  });

  ingredientsSection.addEventListener("change", (e) => {
    if (e.target.classList.contains("ingredient-select")) {
      const selected = e.target.options[e.target.selectedIndex];

      const unit = selected.getAttribute("data-unit");

      e.target.parentElement.querySelector(".unit").textContent = unit || "";
    }
  });

  ingredientsSection.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const rows = document.querySelectorAll(".ingredient-row");

      if (rows.length > 1) {
        e.target.parentElement.remove();
      } else {
        alert("At least one ingredient is required.");
      }
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const recipeName = document.getElementById("recipeName").value.trim();
    const recipeDescription = document
      .getElementById("recipeDescription")
      .value.trim();
    const category = document.getElementById("category").value.trim();
    const cuisine = document.getElementById("cuisine").value.trim();
    const difficulty = document.getElementById("difficulty").value;
    const prep_time = document.getElementById("prep-time").value.trim();
    const instruction = document.getElementById("instruction").value.trim();

    // Clear previous errors
    document.getElementById("recipeNameError").textContent = "";
    document.getElementById("recipeDescriptionError").textContent = "";
    document.getElementById("categoryError").textContent = "";
    document.getElementById("cuisineError").textContent = "";
    document.getElementById("prep-timeError").textContent = "";
    document.getElementById("instructionError").textContent = "";

    let valid = true;

    if (!recipeName) {
      document.getElementById("recipeNameError").textContent =
        "Please fill this field";
      valid = false;
    }

    if (!recipeDescription) {
      document.getElementById("recipeDescriptionError").textContent =
        "Please fill this field";
      valid = false;
    }

    if (!category) {
      document.getElementById("categoryError").textContent =
        "Please fill this field";
      valid = false;
    }

    if (!cuisine) {
      document.getElementById("cuisineError").textContent =
        "Please fill this field";
      valid = false;
    }

    if (!difficulty) {
      document.getElementById("difficultyError").textContent =
        "Please fill this field";
      valid = false;
    }

    if (!prep_time) {
      document.getElementById("prep-timeError").textContent =
        "Please fill this field";
      valid = false;
    }

    if (!instruction) {
      document.getElementById("instructionError").textContent =
        "Please fill this field";
      valid = false;
    }

    if (!valid) return;

    try {
      const res = await fetch("/api/recipes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          recipeName,
          recipeDescription,
          category,
          cuisine,
          difficulty,
          prep_time,
          instruction,
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
      console.error("Error:", e);
      alert("Unable to save recipe.");
    }
  });
});
