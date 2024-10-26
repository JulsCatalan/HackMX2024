import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productsRoutes.js';
import saleRoutes from './routes/salesRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import {initializeDBConnection} from './config/db.js';

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
app.use('/', authRoutes);

// Rutas de productos
app.use('/', productRoutes);

// Rutas de ventas
app.use('/', saleRoutes);

// Rutas de ventas
app.use('/', categoriesRoutes);

app.get('/404', (req, res) => {
    res.sendFile("404.html", { root : "public" });
});

app.use((req, res) => {
    res.redirect('/404');
});

app.listen(3000, () => {
  console.log(`Running on port 3000`);
});
