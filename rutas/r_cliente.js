const express = require('express');
const router = express.Router();
const { insertCliente } = require('../bd/tablas/cliente');
const { post, get, put } = require('./r_usuario');


router.post('/', async (req, res) => {
    const { nombre, apellido, fecha_nacimiento, sexo } = req.body; 
    console.log('variables recibidas:', nombre, apellido, fecha_nacimiento, sexo);

    try {
        const resultado = await insertCliente(nombre,apellido,fecha_nacimiento,sexo,1)
        if (resultado > 0) {
            res.status(200).send('cliente registrado correctamente');
          } else {
            res.status(401).send('No se pudo registrar el cliente'); 
          } 
    } catch (error) {
        res.status(500).send("Error en el servidor",error.message); // Manejo de errores

    }
    
});
  