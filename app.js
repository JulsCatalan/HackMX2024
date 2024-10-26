import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import saleRoutes from './routes/saleRoutes.js';
import {initializeDBConnection} from './config/db.js'

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cors());

initializeDBConnection();

app.get('/', (req, res) => {
    res.sendFile("index.html", { root : "public" });
});

// Rutas de autenticación
app.use('/auth', authRoutes);

// Rutas de productos
app.use('/products', productRoutes);

// Rutas de ventas
app.use('/sales', saleRoutes);

app.get('/404', (req, res) => {
    res.sendFile("404.html", { root : "public" });
});

app.use((req, res) => {
    res.redirect('/404');
});

app.listen(3000, () => {
  console.log(`Running on port 3000`);
});
