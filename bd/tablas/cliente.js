const pool = require('../conexion');

// Función para insertar un cliente
const insertCliente = async (nombre, apellido, fecha_nacimiento, sexo, id_tipo_entidad) => {
    console.log('no limit fuck claudia',id_tipo_entidad)
    try {
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

        // Paso 3: Insertar en la tabla `cliente` usando el `id_persona`
        await pool.query('INSERT INTO cliente (id_entidad) VALUES ($1)', [entidadId]);

        return entidadId; // Devuelve el `id_persona`
    } catch (err) {
        throw err;
    }
};



// Función para insertar teléfonos
const insertTelefonos = async (entidadId, telefonos) => {
    const query = 'INSERT INTO telefono (id_entidad, id_tipo_telefono, telefono) VALUES ($1, $2, $3)';
    try {
        for (const telefono of telefonos) {
            await pool.query(query, [entidadId, telefono.tipo.id, telefono.valor]);
        }
    } catch (err) {
        console.error("Error al insertar teléfonos:", err);
        throw err;
    }
};

// Función para insertar documentos
const insertDocumentos = async (entidadId, documentos) => {
    const query = 'INSERT INTO documento (id_entidad, id_tipo_documento, numeracion, fecha_emision, fecha_vencimiento,id_pais) VALUES ($1, $2, $3, $4, $5, $6)';
    try {
        for (const doc of documentos) {
            await pool.query(query, [entidadId, doc.tipo.id, doc.valor, doc.fechaEmision, doc.fechaVencimiento,doc.pais]);
        }
    } catch (err) {
        console.error("Error al insertar documentos:", documentos);
        throw err;
    }
};

// Función para insertar direcciones
const insertDirecciones = async (entidadId, direcciones) => {
    const query = 'INSERT INTO direccion (id_entidad, calle, numero, ciudad, pais, codigo_postal) VALUES ($1, $2, $3, $4, $5, $6)';
    try {
        for (const direccion of direcciones) {
            await pool.query(query, [entidadId, direccion.calle, direccion.numero, direccion.ciudad, direccion.pais, direccion.codigo_postal]);
        }
    } catch (err) {
        console.error("Error al insertar direcciones:", err);
        throw err;
    }
};


const getClientes = async () => {
    try {
      const result = await pool.query(`
        SELECT 
          e.id_entidad AS id,
          p.nombre,
          p.apellido,
          p.fecha_nacimiento,
          -- Concatenar todos los números de teléfono junto con el tipo en una sola cadena
          COALESCE(string_agg(DISTINCT t.telefono || ' (' || tt.descripcion || ')', ', '), '-') AS telefonos
        FROM entidad e
        INNER JOIN persona p ON p.id_entidad = e.id_entidad
        LEFT JOIN telefono t ON t.id_entidad = e.id_entidad
        LEFT JOIN tipo_telefono tt ON t.id_tipo_telefono = tt.id_tipo_telefono
        GROUP BY e.id_entidad, p.nombre, p.apellido, p.fecha_nacimiento
        ORDER BY e.id_entidad;
      `);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      throw error;
    }
  };


module.exports = {
    insertCliente,
    insertTelefonos,
    insertDocumentos,
    insertDirecciones,
    getClientes,
};
