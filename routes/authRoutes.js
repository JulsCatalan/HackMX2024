import express from 'express';
import authController from '../controllers/authController.js';

const router = express.Router();

// Ruta para registro de usuarios
router.post('/signup', authController.signUp);

// Ruta para inicio de sesión
router.post('/login', authController.login);

export default router;
