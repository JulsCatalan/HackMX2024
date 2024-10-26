import express from 'express';
import productController from '../controllers/productController.js';

const router = express.Router();

// Ruta para agregar un producto
router.post('/add-product', productController.addProduct);

// Ruta para obtener un producto por ID (se pasa la categoría y el ID del producto como query params)
router.get('/get-product', productController.getProduct);

// Ruta para obtener todos los productos de una categoría específica
router.get('/get-products/:category', productController.getProductsByCategory);

// Ruta para eliminar un producto
router.delete('/delete-product', productController.deleteProduct);

// Ruta para obtener todos los productos en todas las categorías
router.get('/get-all-product', productController.getAllProducts);

export default router;
