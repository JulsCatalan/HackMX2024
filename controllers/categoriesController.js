import db from "../config/db.js";

const categoryController = {
    // Controlador para crear una categoría (colección)
    createCategory: async (req, res) => {

        const { category } = req.body;

        try {
            const result = await database.createCollection(category);
            res.status(201).json({ message: 'Colección creada exitosamente', collectionName: category });
        } catch (error) {
            console.error('Error al crear la colección:', error);
            res.status(500).json({ error: 'Error al crear la colección' });
        }
    },

    // Controlador para eliminar una categoría (colección)
    deleteCategory: async (req, res) => {
        const userId = req.cookies.userId;

        const isAdmin = await validateAdmin(userId);

        if (!isAdmin) {
            return res.status(401).send(error_html);
        }

        const { category } = req.body;

        try {
            const categoryCollection = db.collection(category);
            await categoryCollection.drop();

            res.status(200).json({ message: 'Colección eliminada exitosamente' });
        } catch (error) {
            console.error('Error al eliminar la colección:', error);
            res.status(500).json({ error: 'Error al eliminar la colección' });
        }
    },

    // Controlador para obtener todas las categorías
    getAllCategories: async (req, res) => {
        try {
            if (!db || typeof db.listCollections !== 'function') {
                throw new Error('Base de datos no está correctamente inicializada');
            }

            // Obtener una lista de todas las colecciones en la base de datos
            const collections = await db.listCollections().toArray();

            // Filtrar colecciones que comienzan con una letra mayúscula
            const categoryNames = collections
                .map(collection => collection.name)
                .filter(name => /^[A-Z]/.test(name)); 

            res.status(200).json(categoryNames);
        } catch (error) {
            console.error('Error al obtener las categorías:', error.message);
            res.status(500).json({ error: 'Error al obtener las categorías' });
        }
    }
};

export default categoryController;
