import db from "../config/db.js"; // Asegúrate de que 'db' sea una instancia conectada de MongoDB
import { v4 as uuidv4 } from 'uuid';

function normalizeName(name) {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');
}

const saleController = {
    addSale: async (req, res) => { 
        const { products, status, payment, total_price } = req.body;

        console.log(req.body);

        // Obtener la fecha actual y ajustar a la zona horaria GMT-6
        const date = new Date();
        const offsetGMT6 = -6 * 60; 
        const localGMT6Date = new Date(date.getTime() + (offsetGMT6 - date.getTimezoneOffset()) * 60000);
        
        const formattedDateGMT6 = localGMT6Date.toISOString().replace('T', ' ').replace(/\..+/, '');

        // Generar un ID único para la venta usando el total de la venta, la fecha y un UUID
        const saleId = `sale_${total_price}_${formattedDateGMT6.replace(/[-: ]/g, '')}_${uuidv4()}`;
      
        const saleData = {
            saleId: saleId,
            products: products,
            total_bill : total_price,
            date: formattedDateGMT6,
            status: status,
            payment: payment
        };

        try {
            const salesCollection = db.collection("sales"); // Referencia a la colección "sales"
            await salesCollection.insertOne(saleData); // Inserta el documento en MongoDB
      
            return res.status(201).json({ message: 'Venta agregada exitosamente', saleId: saleId });
        } catch (error) {
            console.error("Error al agregar venta:", error);
            return res.status(500).json({ message: 'Error al agregar venta' });
        }
    },

    getAllSales: async (req, res) => {
        try {
            const salesCollection = db.collection("sales"); // Referencia a la colección "sales"
            const salesList = await salesCollection.find({}).toArray(); // Obtiene todos los documentos en un array
      
            return res.status(200).json(salesList); // Devuelve la lista de ventas en formato JSON
        } catch (error) {
            console.error("Error al obtener ventas:", error);
            return res.status(500).json({ message: 'Error al obtener ventas' });
        }
    },

    getSalesDates: async (req, res) => {
        try {
            const salesCollection = db.collection("sales");
            const sales = await salesCollection.find({}, { projection: { date: 1 } }).toArray();
            
            // Extraer y devolver solo fechas únicas
            const uniqueDates = [...new Set(sales.map(sale => sale.date.split(' ')[0]))]; // Mantiene solo la fecha (sin hora)
            res.json(uniqueDates);
        } catch (error) {
            console.error("Error al obtener fechas únicas:", error);
            res.status(500).json({ message: "Error al obtener fechas" });
        }
    }
};


export default saleController;