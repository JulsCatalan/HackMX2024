import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcrypt';
import database from '../config/db.js';

function normalizeName(name) {
    return name
        .trim() // Elimina espacios al principio y al final
        .toLowerCase() // Convierte todo el nombre a minúsculas
        .replace(/\s+/g, '_'); // Reemplaza todos los espacios por guiones bajos
  }

const authController = {

signUp : async (req, res) => {
    const { name, phone, password, password_conf } = req.body;

    // Verifica que las contraseñas coincidan
    if (password !== password_conf) {
        return res.status(401).json({ message: 'Las contraseñas no coinciden' });
    }

    // Normalizar el nombre del usuario
    const normalizedUserName = normalizeName(name); // Implementa esta función según sea necesario
    const userId = `${normalizedUserName}_${uuidv4()}`; // Generar el ID único

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    const userData = {
        userId: userId,
        name : name,
        phone: phone,
        password: hashedPassword,
    };

    try {
        const userCollection = database.collection("users");
        const existingUser = await userCollection.findOne({ phone }); 

        if (existingUser) {
            return res.status(409).json({ message: 'El numero de telefono ya está en uso' });
        }

        await userCollection.insertOne(userData);
        return res.status(201).json({ message: 'Usuario registrado exitosamente', success: true });
    } catch (error) {
        console.error("Error al registrar usuario:", error);
        return res.status(500).json({ message: 'Error al registrar usuario', success: false });
    }
},

login : async (req, res) => {
    const { phone, password } = req.body;

    try {
        const userCollection = database.collection("users"); 
        const userData = await userCollection.findOne({ phone }); 

        if (!userData) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        // Validar la contraseña
        const isPasswordValid = await bcrypt.compare(password, userData.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        res.cookie('userId', userData.userId, {
            httpOnly: true,
            secure: false, // Cambia a true si usas HTTPS
            maxAge: 60 * 60 * 1000 
        });
        
        return res.status(200).json({ message: 'Inicio de sesión exitoso' });
    } catch (error) {
        console.error("Error en el inicio de sesión:", error);
        return res.status(500).json({ message: 'Error en el servidor' });
    }
}
}
