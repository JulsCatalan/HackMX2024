import express from 'express';
import saleController from '../controllers/salesController.js';

const router = express.Router();

// Ruta para agregar una venta
router.post('/sales/add-sale', saleController.addSale);

// Ruta para obtener todas las ventas
router.get('/get-all-sales', saleController.getAllSales);

// Endpoint para obtener fechas únicas
router.get('/get-available-dates', saleController.getSalesDates);

router.get('/get-sales-products', saleController.getAllSalesWithProducts);

router.get('/addSale', (req, res) => {
    res.sendFile("addSale.html", { root: "public" });
});

router.get('/sales', (req, res) => {
    res.sendFile("sales.html", { root: "public" });
});

export default router;
