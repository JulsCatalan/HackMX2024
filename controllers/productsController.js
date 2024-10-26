import db from "../config/db.js";

const productController = {
    // Controlador para agregar un producto
    addProduct: async (req, res) => {
      
        const { category, description, name, price, stock } = req.body;

        try {
            const categoryCollection = db.collection(category);

            const formattedName = name.replace(/\s+/g, '-').toLowerCase();
            const randomNumber = Math.floor(Math.random() * 10000);
            const productId = `${formattedName}-${randomNumber}`;

            const newProduct = {
                _id: productId,
                category,
                name,
                description,
                price,
                stock,
                createdAt: new Date()
            };

            await categoryCollection.insertOne(newProduct);

            res.status(201).json({ message: 'Producto agregado exitosamente' });
        } catch (error) {
            console.error('Error al agregar producto:', error);
            res.status(500).json({ error: 'Error al agregar producto' });
        }
    },

    // Controlador para obtener un producto por ID usando GET
    getProduct: async (req, res) => {
        const { category, productId } = req.query;  

        try {
            const categoryCollection = db.collection(category);
            const product = await categoryCollection.findOne({ _id: productId });

            if (!product) {
                return res.status(404).json({ message: 'Producto no encontrado.' });
            }

            res.status(200).json(product);
        } catch (error) {
            console.error('Error al obtener producto:', error);
            res.status(500).json({ error: 'Error al obtener producto' });
        }
    },

    // Controlador para obtener todos los productos de una categoría
    getProductsByCategory: async (req, res) => {
        const { category } = req.params;

        try {
            const categoryCollection = db.collection(category);
            const products = await categoryCollection.find().toArray();

            res.status(200).json(products);
        } catch (error) {
            console.error('Error al obtener productos:', error);
            res.status(500).json({ error: 'Error al obtener productos' });
        }
    },

    // Controlador para eliminar un producto
    deleteProduct: async (req, res) => {
        
        const { category, productId } = req.body;

        try {
            const categoryCollection = db.collection(category);
            const result = await categoryCollection.deleteOne({ _id: productId });

            if (result.deletedCount === 0) {
                return res.status(404).json({ message: 'Producto no encontrado.' });
            }

            res.status(200).json({ message: 'Producto eliminado exitosamente' });
        } catch (error) {
            console.error('Error al eliminar producto:', error);
            res.status(500).json({ error: 'Error al eliminar producto' });
        }
    },

    // Controlador para obtener todos los productos
    getAllProducts: async (req, res) => {
        try {
            const collections = await db.listCollections().toArray();
            const products = [];

            for (const collection of collections) {
                const collectionName = collection.name;

                if (/^[A-Z]/.test(collectionName) && collectionName !== 'system.indexes') {
                    const collectionData = db.collection(collectionName);
                    const categoryProducts = await collectionData.find({}).toArray();
                    products.push({
                        category: collectionName,
                        products: categoryProducts
                    });
                }
            }

            res.status(200).json(products);
        } catch (error) {
            console.error('Error al obtener los productos:', error.message);
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    }
};

export default productController;
