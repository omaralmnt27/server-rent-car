const pool = require('../conexion');

// Función para insertar un cliente
const insertCliente = async (nombre, apellido, fecha_nacimiento, sexo, id_tipo_entidad) => {
    try {
        console.log('------------------------*****',id_tipo_entidad)
        // Paso 1: Insertar en la tabla `entidad`
        const q_entidad = await pool.query(
            'INSERT INTO entidad (id_tipo_entidad) VALUES ($1) RETURNING id_entidad',
            [id_tipo_entidad]
        );
        const entidadId = q_entidad.rows[0].id_entidad;

        // Paso 2: Insertar en la tabla `persona`
        const q_persona = await pool.query(
            'INSERT INTO persona (nombre, apellido, fecha_nacimiento, sexo, id_entidad) VALUES ($1, $2, $3, $4, $5) RETURNING id_persona',
            [nombre, apellido, fecha_nacimiento, sexo, entidadId]
        );
        const personaId = q_persona.rows[0].id_persona;

        // Paso 3: Insertar en la tabla `cliente` usando el `id_persona`
        await pool.query('INSERT INTO cliente (id_persona) VALUES ($1)', [personaId]);

        return personaId; // Devuelve el `id_persona`
    } catch (err) {
        console.error("Error al insertar cliente:", err);
        throw err;
    }
};

// Función para insertar teléfonos
const insertTelefonos = async (personaId, telefonos) => {
    const query = 'INSERT INTO telefono (id_persona, tipo, numero) VALUES ($1, $2, $3)';
    try {
        for (const telefono of telefonos) {
            await pool.query(query, [personaId, telefono.tipo, telefono.numero]);
        }
    } catch (err) {
        console.error("Error al insertar teléfonos:", err);
        throw err;
    }
};

// Función para insertar documentos
const insertDocumentos = async (personaId, documentos) => {
    const query = 'INSERT INTO documento (id_persona, tipo_documento, numero, fecha_emision, fecha_vencimiento, pais) VALUES ($1, $2, $3, $4, $5, $6)';
    try {
        for (const doc of documentos) {
            await pool.query(query, [personaId, doc.tipo_documento, doc.numero, doc.fecha_emision, doc.fecha_vencimiento, doc.pais]);
        }
    } catch (err) {
        console.error("Error al insertar documentos:", err);
        throw err;
    }
};

// Función para insertar direcciones
const insertDirecciones = async (personaId, direcciones) => {
    const query = 'INSERT INTO direccion (id_persona, calle, numero, ciudad, pais, codigo_postal) VALUES ($1, $2, $3, $4, $5, $6)';
    try {
        for (const direccion of direcciones) {
            await pool.query(query, [personaId, direccion.calle, direccion.numero, direccion.ciudad, direccion.pais, direccion.codigo_postal]);
        }
    } catch (err) {
        console.error("Error al insertar direcciones:", err);
        throw err;
    }
};

module.exports = {
    insertCliente,
    insertTelefonos,
    insertDocumentos,
    insertDirecciones
};
