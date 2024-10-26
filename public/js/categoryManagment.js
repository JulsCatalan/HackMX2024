// scripts/categoryManagement.js

// Manejar el formulario de agregar categoría
document.getElementById("addCategoryForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const category = document.getElementById("addCategory").value;

    const response = await fetch("/categories/add-category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category })
    });

    const result = await response.json();
    alert(result.message);
});

// Manejar el formulario de eliminar categoría
document.getElementById("deleteCategoryForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const category = document.getElementById("deleteCategory").value;

    const response = await fetch("/categories/delete-category", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category })
    });

    const result = await response.json();
    alert(result.message);
});

// Manejar el botón para obtener todas las categorías
document.getElementById("getAllCategoriesButton").addEventListener("click", async () => {
    const response = await fetch("/categories/get-all-categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const categories = await response.json();
    const categoriesList = document.getElementById("categoriesList");
    categoriesList.innerHTML = "<h3>Lista de Categorías:</h3>";

    categories.forEach((category) => {
        const categoryItem = document.createElement("p");
        categoryItem.textContent = category;
        categoriesList.appendChild(categoryItem);
    });
});
