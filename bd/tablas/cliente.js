const pool = require('../conexion');

const insertCliente = async (nombre, apellido, fecha_nacimiento, sexo, tipo_entidad) => {
    try {
        const q_entidad = await pool.query('INSERT INTO entidad (tipo_entidad) VALUES ($1) RETURNING id_entidad', [tipo_entidad]);
        const entidadId = q_entidad.rows[0].id_entidad;

        const q_persona = await pool.query(
            'INSERT INTO persona (nombre, apellido, fecha_nacimiento, sexo, id_entidad) VALUES ($1, $2, $3, $4, $5) RETURNING id_persona',
            [nombre, apellido, fecha_nacimiento, sexo, entidadId]
        );

        const q_cliente = await pool.query(' INSERT INTO cliente (id_entidad) VALUES ($1)',[entidadId]);
        
        return q_cliente.rowCount;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

module.exports = {
    insertCliente
};
