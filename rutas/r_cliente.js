const express = require('express');
const router = express.Router();
const { insertCliente } = require('../bd/tablas/cliente');

// Ruta para registrar cliente
router.post('/', async (req, res) => {
    // Agrega encabezados CORS a la respuesta
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');

    // Extrae los datos del cuerpo de la solicitud
    const { nombre, apellido, fecha_nacimiento, sexo } = req.body; 
    console.log('Variables recibidas:', nombre, apellido, fecha_nacimiento, sexo);

    try {
        // Llama a la función insertCliente con los datos recibidos
        const resultado = await insertCliente(nombre, apellido, fecha_nacimiento, sexo, 1);
        
        if (resultado > 0) {
            return res.status(200).json({ message: 'Cliente registrado correctamente' });
        } else {
            return res.status(401).json({ error: 'No se pudo registrar el cliente' });
        }
    } catch (error) {
        console.error("Error al registrar cliente:", error);
        // Corrige el manejo de errores aquí
        return res.status(500).json({ error: `Error en el servidor: ${error.message}` });
    }
});

module.exports = router;
