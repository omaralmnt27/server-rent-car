const express = require('express');
const router = express.Router();
const { insertCliente, insertTelefonos, insertDocumentos, insertDirecciones, getClientes } = require('../bd/tablas/cliente');

// Ruta para registrar cliente
router.post('/', async (req, res) => {
    const {
        tipo_cliente,
        nombre,
        apellido,
        fecha_nacimiento,
        sexo,
        nombre_empresa,
        telefonos,
        documentos,
        direcciones,
        id_tipo_entidad,
        pais_origen
    } = req.body;

    console.log("Datos recibidos en el servidor:", req.body);

    try {
        // Validar datos básicos
        if (!tipo_cliente || !id_tipo_entidad) {
            return res.status(400).json({ error: 'El tipo de cliente y el tipo de entidad son requeridos' });
        }

        // Validación en función del tipo de entidad
        if (id_tipo_entidad === 1 && (!nombre || !apellido || !fecha_nacimiento || !sexo)) {
            return res.status(400).json({ error: 'Faltan datos requeridos para el cliente de tipo persona' });
        } else if (id_tipo_entidad === 2 && !nombre_empresa) {
            return res.status(400).json({ error: 'El nombre de la empresa es requerido para el cliente de tipo empresa' });
        }

        let entidadId;

        // Insertar según el tipo de entidad
        if (id_tipo_entidad === 1) { 
            entidadId = await insertCliente(
                nombre, apellido, fecha_nacimiento, sexo, id_tipo_entidad, pais_origen
            );
        } else if (id_tipo_entidad === 2) { 
            entidadId = await insertEmpresa(
                nombre_empresa, id_tipo_entidad, pais_origen
            );
        }

        if (entidadId > 0) {
            console.log(`Cliente registrado con ID: ${entidadId}`);

            // Inserta los teléfonos
            if (Array.isArray(telefonos) && telefonos.length > 0) {
                await insertTelefonos(entidadId, telefonos);
                console.log('Teléfonos registrados correctamente');
            }

            // Inserta los documentos
            if (Array.isArray(documentos) && documentos.length > 0) {
                await insertDocumentos(entidadId, documentos);
                console.log('Documentos registrados correctamente');
            }

            // Inserta las direcciones
            if (Array.isArray(direcciones) && direcciones.length > 0) {
                await insertDirecciones(entidadId, direcciones);
                console.log('Direcciones registradas correctamente');
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

router.get('/', async (req, res) => {
    try {
        const clientes = await getClientes();
        return res.status(200).json(clientes);
    } catch (error) {
        console.error("Error al obtener clientes:", error);
        return res.status(500).json({ error: 'Error al obtener clientes' });
    }
});


module.exports = router;
