import db from "../config/db.js"; // Asegúrate de que 'db' sea una instancia conectada de MongoDB

function normalizeName(name) {
    return name
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '_');
}

export const saleController = {
    addSale: async (req, res) => { 
        const { products, status, payment, client, total_price } = req.body;

        // Obtener la fecha actual y ajustar a la zona horaria GMT-6
        const date = new Date();
        const offsetGMT6 = -6 * 60; 
        const localGMT6Date = new Date(date.getTime() + (offsetGMT6 - date.getTimezoneOffset()) * 60000);
        
        const formattedDateGMT6 = localGMT6Date.toISOString().replace('T', ' ').replace(/\..+/, '');

        // Normalizar el nombre del cliente para el ID
        const formattedClient = normalizeName(client);

        // Generar un ID único para la venta
        const saleId = `${formattedClient}_${total_price}_${formattedDateGMT6.replace(/[-: ]/g, '')}`;
      
        const saleData = {
            saleId: saleId,
            products: products,
            date: formattedDateGMT6,
            status: status,
            payment: payment
        };

        try {
            const salesCollection = db.collection("sales"); // Referencia a la colección "sales"
            await salesCollection.insertOne(saleData); // Inserta el documento en MongoDB
      
            return res.status(201).json({ message: 'Venta agregada exitosamente' });
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
    }
};
