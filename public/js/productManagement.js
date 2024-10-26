// scripts/productManagement.js

document.getElementById("addProductForm").addEventListener("submit", async (event) => {
    event.preventDefault();

    const category = document.getElementById("addCategory").value;
    const name = document.getElementById("addName").value;
    const price = document.getElementById("addPrice").value;
    const stock = document.getElementById("addStock").value;

    const response = await fetch("/products/add-product", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category, name, price, stock })
    });

    const result = await response.json();
    alert(result.message);
});

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
