const express = require('express');
const router = express.Router();
const { insertCliente, insertTelefonos, insertDocumentos, insertDirecciones } = require('../bd/tablas/cliente');

// Ruta para registrar cliente
router.post('/', async (req, res) => {
    // Extraer los datos del cuerpo de la solicitud
    const { tipo_cliente, nombre, apellido, fecha_nacimiento, sexo, nombre_empresa, telefonos, documentos, direcciones } = req.body;

    try {
        // Validar los datos antes de realizar inserciones
        if (!tipo_cliente) {
            return res.status(400).json({ error: 'El tipo de cliente es requerido' });
        }
        if (tipo_cliente === 'persona' && (!nombre || !apellido || !fecha_nacimiento || !sexo)) {
            return res.status(400).json({ error: 'Faltan datos requeridos para el cliente de tipo persona' });
        }
        if (tipo_cliente === 'empresa' && !nombre_empresa) {
            return res.status(400).json({ error: 'El nombre de la empresa es requerido para el cliente de tipo empresa' });
        }

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

            // Inserta los teléfonos asociados, si existen
            if (Array.isArray(telefonos) && telefonos.length > 0) {
                try {
                    await insertTelefonos(clienteId, telefonos);
                    console.log('Teléfonos registrados correctamente');
                } catch (error) {
                    console.error("Error al registrar teléfonos:", error);
                    // Aquí puedes decidir si quieres abortar toda la operación o continuar
                    return res.status(500).json({ error: 'Error al registrar teléfonos' });
                }
            }

            // Inserta los documentos asociados, si existen
            if (Array.isArray(documentos) && documentos.length > 0) {
                try {
                    await insertDocumentos(clienteId, documentos);
                    console.log('Documentos registrados correctamente');
                } catch (error) {
                    console.error("Error al registrar documentos:", error);
                    return res.status(500).json({ error: 'Error al registrar documentos' });
                }
            }

            // Inserta las direcciones asociadas, si existen
            if (Array.isArray(direcciones) && direcciones.length > 0) {
                try {
                    await insertDirecciones(clienteId, direcciones);
                    console.log('Direcciones registradas correctamente');
                } catch (error) {
                    console.error("Error al registrar direcciones:", error);
                    return res.status(500).json({ error: 'Error al registrar direcciones' });
                }
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
