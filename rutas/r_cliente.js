const express = require('express');
const router = express.Router();
const { insertCliente, insertTelefonos, insertDocumentos, insertDirecciones } = require('../bd/tablas/cliente');

// Ruta para registrar cliente
router.post('/', async (req, res) => {
    const { tipo_cliente, nombre, apellido, fecha_nacimiento, sexo, nombre_empresa, telefonos, documentos, direcciones } = req.body;

    try {
        // Llama a la función insertCliente dependiendo del tipo de cliente
        const clienteId = await insertCliente({
            tipo_cliente,
            nombre,
            apellido,
            fecha_nacimiento,
            sexo,
            nombre_empresa
        });

        if (clienteId > 0) {
            console.log(`Cliente registrado con ID: ${clienteId}`);

            if (Array.isArray(telefonos) && telefonos.length > 0) {
                await insertTelefonos(clienteId, telefonos);
            }

            if (Array.isArray(documentos) && documentos.length > 0) {
                await insertDocumentos(clienteId, documentos);
            }

            if (Array.isArray(direcciones) && direcciones.length > 0) {
                await insertDirecciones(clienteId, direcciones);
            }

            return res.status(200).json({ message: 'Cliente registrado correctamente' });
        } else {
            return res.status(401).json({ error: 'No se pudo registrar el cliente' });
        }
    } catch (error) {
        console.error("Error al registrar cliente:", error);
        return res.status(500).json({ error: `Error en el servidor: ${error.message}` });
    }
});

module.exports = router;
