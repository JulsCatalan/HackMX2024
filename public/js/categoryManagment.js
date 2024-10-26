// scripts/categoryManagement.js

// Manejar el formulario de agregar categoría
document.getElementById("addCategoryForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const category = document.getElementById("addCategory").value;

    const response = await fetch("/add-category", {
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

    const response = await fetch("/delete-category", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category })
    });

    const result = await response.json();
    alert(result.message);
});

// Manejar el botón para obtener todas las categorías al cargar la página
window.onload = async () => {
    const response = await fetch("/get-all-categories", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
    });

    const categories = await response.json();
    const categoriesList = document.getElementById("categoriesList");
    categoriesList.innerHTML = "<h3>Lista de Categorías:</h3>";

    if (categories.length === 0) {
        const noCategoriesMessage = document.createElement("p");
        noCategoriesMessage.textContent = "No hay categorías para mostrar";
        categoriesList.appendChild(noCategoriesMessage);
    } else {
        categories.forEach((category) => {
            const categoryItem = document.createElement("p");
            categoryItem.textContent = category;
            categoriesList.appendChild(categoryItem);
        });
    }
};
