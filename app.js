import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productsRoutes.js';
import saleRoutes from './routes/salesRoutes.js';
import categoriesRoutes from './routes/categoriesRoutes.js';
import { initializeDBConnection } from './config/db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.static("public"));
app.use(cors());
app.use(cookieParser());

initializeDBConnection();

// Middleware de autenticación
app.use((req, res, next) => {
    if (req.cookies.isAuthenticated || req.path === '/login' || req.path === '/verify-password') {
        next();
    } else {
        res.redirect('/login');
    }
});

// Ruta para mostrar el formulario de contraseña
app.get('/login', (req, res) => {
    res.sendFile("login.html", { root: "public" });
});

// Ruta para verificar la contraseña
app.post('/verify-password', (req, res) => {
    const { password } = req.body;
    if (password === process.env.PAGE_PASSWORD) {
        // Establece la cookie de autenticación con una duración de 1 hora
        res.cookie('isAuthenticated', true, { maxAge: 10 * 60 * 1000, httpOnly: true });
        res.json({ success: true });
    } else {
        res.json({ success: false, message: "Contraseña incorrecta" });
    }
});

// Rutas principales
app.get('/', (req, res) => {
    res.sendFile("index.html", { root: "public" });
});

// Rutas de recursos
app.use('/', authRoutes);
app.use('/', productRoutes);
app.use('/', saleRoutes);
app.use('/', categoriesRoutes);

// Ruta de error 404
app.get('/404', (req, res) => {
    res.sendFile("404.html", { root: "public" });
});

app.use((req, res) => {
    res.redirect('/404');
});

app.listen(3000, () => {
  console.log(`Running on port 3000`);
});
