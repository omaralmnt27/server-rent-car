const express = require('express');
const router = express.Router();
const { getUsuarios, insertUsuario, ValidarUsuario } = require('../bd/tablas/usuario');

router.get('/', async (req, res) => {
  try {
    const users = await getUsuarios();
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

router.post('/', async (req, res) => {
  const { usuario, clave } = req.body;
  try {
    const result = await insertUsuario(usuario, clave);
    res.status(201).send(`Usuario añadido con éxito. Filas afectadas: ${result}`);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Error en el servidor");
  }
});

router.post('/login', async (req, res) => {
  const { usuario, clave } = req.body; // Extrae el usuario y la clave del cuerpo de la solicitud
  console.log('Credenciales recibidas:', usuario, clave); // Muestra las credenciales recibidas

  try {
    // Llama a la función de validación
    const validUserCount = await ValidarUsuario(usuario, clave); 
    console.log('Cantidad de usuarios válidos encontrados:', validUserCount); // Registra el conteo de usuarios válidos

    if (validUserCount > 0) {
      // Si se encuentra al menos un usuario, el inicio de sesión es exitoso
      res.status(200).send('Inicio de sesión exitoso');
    } else {
      // Si no se encuentra el usuario o la contraseña no coincide
      res.status(401).send(`Credenciales inválidas. Usuario: ${usuario}`); // Incluye el usuario en el mensaje para más contexto
    }
  } catch (err) {
    console.error('Error al validar usuario:', err.message); // Registra el error específico
    res.status(500).send("Error en el servidor"); // Manejo de errores
  }
});


module.exports = router;
