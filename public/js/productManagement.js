// scripts/productManagement.js

// Función para cargar las categorías en el select
async function loadCategories() {
    try {
        const response = await fetch("/get-all-categories");
        const categories = await response.json();
        
        const addCategorySelect = document.getElementById("addCategory");
        const editCategorySelect = document.getElementById("editCategory");

        addCategorySelect.innerHTML = ""; // Limpiar opciones previas en ambos selects
        editCategorySelect.innerHTML = "";

        if (categories.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay categorías disponibles";
            option.disabled = true;
            addCategorySelect.appendChild(option);
            editCategorySelect.appendChild(option);
        } else {
            categories.forEach((category) => {
                const option = document.createElement("option");
                option.value = category;
                option.textContent = category;
                addCategorySelect.appendChild(option);

                // Clonar y agregar opción a editCategorySelect
                editCategorySelect.appendChild(option.cloneNode(true));
            });
        }
    } catch (error) {
        console.error("Error al cargar categorías:", error);
    }
}

// Cargar los productos según la categoría seleccionada en el formulario de edición
async function loadProductsByCategory(category) {
    try {
        const response = await fetch(`/products/get-products/${category}`);
        const products = await response.json();

        const productSelect = document.getElementById("editProductId");
        productSelect.innerHTML = ""; // Limpiar opciones previas

        if (products.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay productos disponibles";
            option.disabled = true;
            productSelect.appendChild(option);
        } else {
            products.forEach((product) => {
                const option = document.createElement("option");
                option.value = product._id;
                option.textContent = product.name;
                productSelect.appendChild(option);
            });
        }
    } catch (error) {
        console.error("Error al cargar productos:", error);
    }
}

// Cargar las categorías al cargar la página
window.addEventListener("load", loadCategories);

// Actualizar productos en el select al cambiar la categoría en el formulario de edición
document.getElementById("editCategory").addEventListener("change", (event) => {
    const selectedCategory = event.target.value;
    loadProductsByCategory(selectedCategory);
});

// Manejar el formulario de agregar producto
document.getElementById("addProductForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const category = document.getElementById("addCategory").value;
    const description = document.getElementById("addDescription").value;
    const name = document.getElementById("addName").value;
    const price = document.getElementById("addPrice").value;
    const stock = document.getElementById("addStock").value;

    const response = await fetch("/products/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, description, name, price, stock })
    });

    const result = await response.json();
    alert(result.message);
});

// Manejar el formulario de editar producto
document.getElementById("editProductForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const category = document.getElementById("editCategory").value;
    const productId = document.getElementById("editProductId").value;
    const name = document.getElementById("editName").value;
    const price = document.getElementById("editPrice").value;
    const stock = document.getElementById("editStock").value;

    const response = await fetch(`/products/edit-product/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, name, price, stock })
    });

    const result = await response.json();
    alert(result.message);
});

// Manejar el formulario de eliminar producto
document.getElementById("deleteProductForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const category = document.getElementById("deleteCategory").value;
    const productId = document.getElementById("deleteProductId").value;

    const response = await fetch("/products/delete-product", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, productId })
    });

    const result = await response.json();
    alert(result.message);
});
