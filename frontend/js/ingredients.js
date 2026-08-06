document.addEventListener("DOMContentLoaded", async () => {
  const ingredientTable = document.getElementById("ingredientTable");

  try {
    const res = await fetch("/api/ingredients");
    const ingredients = await res.json();

    ingredientTable.innerHTML = "";

    ingredients.forEach((ingredient) => {
      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${ingredient.ingredient_name}</td>
        <td>${ingredient.default_unit}</td>
        <td>
          <a href="ingredient-form.html?id=${ingredient.ingredient_id}" class="edit-ingredient-btn">
            Edit
          </a>
        </td>
      `;

      ingredientTable.appendChild(row);
    });
  } catch (e) {
    console.log("Error loading ingredients:", e);
  }
});
