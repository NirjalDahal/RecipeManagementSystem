document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementsByClassName("recipeForm")[0];

  const ingredientsSection = document.getElementsByClassName(
    "ingredients-section",
  )[0];
  const addButton = document.getElementById("add-btn");

  addButton.addEventListener("click", () => {
    const ingredientRow = document.createElement("div");
    ingredientRow.className = "ingredient-row";

    ingredientRow.innerHTML = `
    <select>
      <option value="">Select Ingredient</option>
      <option value="Chicken">Chicken</option>
      <option value="Rice">Rice</option>
      <option value="Salt">Salt</option>
      <option value="Milk">Milk</option>
    </select>

    <input type="number" placeholder="Quantity" min="0">

    <span class="unit">Grams</span>

    <button type="button" class="remove-btn">Remove</button>
    `;

    ingredientsSection.insertBefore(ingredientRow, addButton);
  });

  ingredientsSection.addEventListener("click", (e) => {
    if (e.target.classList.contains("remove-btn")) {
      const rows = document.querySelectorAll(".ingredient-row");

      if (rows.length > 1) {
        e.target.parentElement.remove();
      } else {
        alert("At least one ingredient is needed");
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
    const difficulty = document.getElementById("difficulty").value();
    const prep_time = document.getElementById("prep-time").value.trim();
    const instruction = document.getElementById("instruction").value.trim();

    if (!recipeName) {
      const recipeNameError = document.getElementById("recipeNameError");
      recipeNameError.textContent = "";
      recipeNameError.textContent = "Please fill this field";
    }

    if (!recipeDescription) {
      const recipeDescriptionError = document.getElementById(
        "recipeDescriptionError",
      );
      recipeDescriptionError.textContent = "";
      recipeDescriptionError.textContent = "Please fill this field";
    }

    if (!category) {
      const categoryError = document.getElementById("categoryError");
      categoryError.textContent = "";
      categoryError.textContent = "Please fill this field";
    }

    if (!cuisine) {
      const cuisineError = document.getElementById("cuisineError");
      cuisineError.textContent = "";
      cuisineError.textContent = "Please fill this field";
    }

    if (!prep_time) {
      const prep_timeError = document.getElementById("prep-timeError");
      prep_timeError.textContent = "";
      prep_timeError.textContent = "Please fill this field";
    }

    if (!instruction) {
      const instructionError = document.getElementById("instructionError");
      instructionError.textContent = "";
      instructionError.textContent = "Please fill this field";
    }

    try {
      const res = await fetch("api/recipes", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          recipeName: recipeName,
          recipeDescription: recipeDescription,
          difficulty: difficulty,
          category: category,
          cuisine: cuisine,
          prep_time: prep_time,
          instruction: instruction,
        }),
      });
    } catch (e) {}
  });
});
