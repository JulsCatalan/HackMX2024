import db from "../config/db.js";
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
            total_bill: total_price,
            date: formattedDateGMT6,
            status: status,
            payment: payment
        };

        try {
            // Insertar la venta en la colección "sales"
            const salesCollection = db.collection("sales");
            await salesCollection.insertOne(saleData);

            // Actualizar el stock de cada producto en la venta según su categoría
            for (const product of products) {
                const { productId, category, quantity } = product;

                // Obtener la colección de la categoría específica
                const categoryCollection = db.collection(category);

                // Reducir el stock en la cantidad vendida
                const result = await categoryCollection.updateOne(
                    { _id: productId },
                    { $inc: { stock: -quantity } }
                );

                if (result.modifiedCount === 0) {
                    console.warn(`El producto con ID ${productId} en la categoría ${category} no se encontró o no se actualizó el stock.`);
                }
            }

            return res.status(201).json({ message: 'Venta agregada exitosamente y stock actualizado', saleId: saleId });
        } catch (error) {
            console.error("Error al agregar venta o actualizar el stock:", error);
            return res.status(500).json({ message: 'Error al agregar venta o actualizar el stock' });
        }
    },

    getAllSales: async (req, res) => {
        const { date } = req.query;
        try {
            const salesCollection = db.collection("sales");
            
            // Si `date` está presente, aplica el filtro
            const filter = date ? { date: { $regex: `^${date}` } } : {};
            
            const sales = await salesCollection.find(filter).toArray();
            res.json(sales);
        } catch (error) {
            console.error("Error al obtener las ventas:", error);
            res.status(500).json({ message: "Error al obtener las ventas" });
        }
    },

    getSalesDates: async (req, res) => {
        try {
            const salesCollection = db.collection("sales");
            const sales = await salesCollection.find({}, { projection: { date: 1 } }).toArray();
            
            // Extraer y devolver solo fechas únicas
            const uniqueDates = [...new Set(sales.map(sale => sale.date.split(' ')[0]))];
            res.json(uniqueDates);
        } catch (error) {
            console.error("Error al obtener fechas únicas:", error);
            res.status(500).json({ message: "Error al obtener fechas" });
        }
    },

    getAllSalesWithProducts: async (req, res) => {
        try {
            // Obtener todas las ventas
            const salesCollection = db.collection("sales");
            const sales = await salesCollection.find().toArray();

            // Obtener detalles de cada producto en cada venta
            const salesWithProductDetails = await Promise.all(sales.map(async (sale) => {
                const productsWithDetails = await Promise.all(sale.products.map(async (product) => {
                    const categoryCollection = db.collection(product.category); // Colección de categoría específica
                    const productDetails = await categoryCollection.findOne({ _id: product.productId });
                    return {
                        ...product,
                        details: productDetails
                    };
                }));

                return {
                    ...sale,
                    products: productsWithDetails
                };
            }));

            // Obtener todos los productos en todas las categorías
            const collections = await db.listCollections().toArray();
            const allProducts = [];

            for (const collection of collections) {
                const collectionName = collection.name;

                if (/^[A-Z]/.test(collectionName) && collectionName !== 'system.indexes') {
                    const categoryCollection = db.collection(collectionName);
                    const categoryProducts = await categoryCollection.find({}).toArray();
                    allProducts.push({
                        category: collectionName,
                        products: categoryProducts
                    });
                }
            }

            // Responder con ventas (incluyendo detalles de productos) y todos los productos por categoría
            res.status(200).json({
                sales: salesWithProductDetails,
                allProducts: allProducts
            });
        } catch (error) {
            console.error("Error al obtener ventas y detalles de productos:", error);
            res.status(500).json({ message: "Error al obtener ventas y detalles de productos" });
        }
    }
};

export default saleController;
