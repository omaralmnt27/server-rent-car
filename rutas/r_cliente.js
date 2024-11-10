const express = require('express');
const router = express.Router();
const { insertClientePersona,insertDatosAdicionales, insertClienteEmpresa, insertTelefonos, insertDocumentos, insertDirecciones, getClientes } = require('../bd/tablas/cliente');

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


module.exports = router;
