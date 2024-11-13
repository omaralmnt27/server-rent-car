const express = require('express');
const router = express.Router();
const { insertClientePersona,insertDatosAdicionales, insertClienteEmpresa, updateClienteEmpresa, updateClientePersona, updateDatosAdicionales, insertTelefonos, insertDocumentos, insertDirecciones, getClientes, getClienteById } = require('../bd/tablas/cliente');

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
        let entidadId;

        // Insertar según el tipo de entidad
        if (id_tipo_entidad === 1) { // Cliente persona
            entidadId = await insertClientePersona(nombre, apellido, fecha_nacimiento, sexo, id_tipo_entidad, pais_origen);
        } else if (id_tipo_entidad === 2) { // Cliente empresa
            entidadId = await insertClienteEmpresa(nombre_empresa, id_tipo_entidad, pais_origen);
        } else {
            return res.status(400).json({ error: 'Tipo de entidad no válido' });
        }

        // Inserta los datos adicionales
        await insertDatosAdicionales(entidadId, telefonos, documentos, direcciones);

        return res.status(200).json({ message: 'Cliente registrado correctamente', id_entidad: entidadId });
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

router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const cliente = await getClienteById(id);
        if (!cliente) {
            return res.status(404).json({ error: 'Cliente no encontrado' });
        }
        return res.status(200).json(cliente);
    } catch (error) {
        console.error("Error al obtener cliente:", error);
        return res.status(500).json({ error: 'Error al obtener cliente' });
    }
});

// Ruta para actualizar un cliente
router.put('/:id', async (req, res) => {
    const { id } = req.params;
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
        pais_origen,
        correo
    } = req.body;

    try {
        // Actualizar según el tipo de entidad
        if (id_tipo_entidad === 1) { // Cliente persona
            await updateClientePersona(id, nombre, apellido, fecha_nacimiento, sexo, pais_origen, correo);
        } else if (id_tipo_entidad === 2) { // Cliente empresa
            await updateClienteEmpresa(id, nombre_empresa, pais_origen, correo);
        } else {
            return res.status(400).json({ error: 'Tipo de entidad no válido' });
        }

        // Actualizar datos adicionales (teléfonos, documentos, direcciones)
        await updateDatosAdicionales(id, telefonos, documentos, direcciones);

        return res.status(200).json({ message: 'Cliente actualizado correctamente' });
    } catch (error) {
        console.error("Error al actualizar cliente:", error);
        return res.status(500).json({ error: `Error en el servidor: ${error.message}` });
    }
});


module.exports = router;
