import express from 'express';
import saleController from '../controllers/saleController.js';

const router = express.Router();

// Ruta para agregar una venta
router.post('/add-sale', saleController.addSale);

// Ruta para obtener todas las ventas
router.get('/get-all-sales', saleController.getAllSales);

export default router;
