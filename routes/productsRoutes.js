import express from 'express';
import productController from '../controllers/productsController.js'

const router = express.Router();

// Ruta para agregar un producto
router.post('/products/add-product', productController.addProduct);

// Ruta para obtener un producto por ID (se pasa la categoría y el ID del producto como query params)
router.get('/products/get-product', productController.getProduct);

// Ruta para obtener todos los productos de una categoría específica
router.get('/products/get-products/:category', productController.getProductsByCategory);

// Ruta para eliminar un producto
router.delete('/products/delete-product', productController.deleteProduct);

// Ruta para obtener todos los productos en todas las categorías
router.get('/products/get-all-products', productController.getAllProducts);

// Ruta de error 404 para productos (debe ir al final)
router.use('/products', (req, res) => {
    res.sendFile("products.html", { root: "public" });
});

export default router;
