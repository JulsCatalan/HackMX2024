import express from 'express';
import categoryController from '../controllers/categoriesController.js';

const router = express.Router();

// Ruta para crear una nueva categoría (colección)
router.post('/add-category', categoryController.createCategory);

// Ruta para eliminar una categoría (colección)
router.delete('/delete-category', categoryController.deleteCategory);

// Ruta para obtener todas las categorías
router.get('/get-all-categories', categoryController.getAllCategories);

export default router;
