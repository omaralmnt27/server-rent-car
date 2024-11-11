const pool = require('../conexion');

const insertDatosAdicionales = async (entidadId, telefonos, documentos, direcciones) => {
    try {
        // Insertar teléfonos
        if (Array.isArray(telefonos) && telefonos.length > 0) {
            for (const telefono of telefonos) {
                await pool.query(
                    'INSERT INTO telefono (id_entidad, numero) VALUES ($1, $2)',
                    [entidadId, telefono]
                );
            }
        }

        // Insertar documentos
        if (Array.isArray(documentos) && documentos.length > 0) {
            for (const doc of documentos) {
                await pool.query(
                    'INSERT INTO documento (id_entidad, tipo_documento, numero) VALUES ($1, $2, $3)',
                    [entidadId, doc.tipo_documento, doc.numero]
                );
            }
        }

        // Insertar direcciones
        if (Array.isArray(direcciones) && direcciones.length > 0) {
            for (const dir of direcciones) {
                await pool.query(
                    'INSERT INTO direccion (id_entidad, calle, ciudad, estado, pais) VALUES ($1, $2, $3, $4, $5)',
                    [entidadId, dir.calle, dir.ciudad, dir.estado, dir.pais]
                );
            }
        }
    } catch (err) {
        console.error("Error al insertar datos adicionales:", err);
        throw err;
    }
};

// Función para insertar un cliente
const insertClientePersona = async (nombre, apellido, fecha_nacimiento, sexo, id_tipo_entidad, pais_origen) => {
    try {
        // Paso 1: Insertar en la tabla `entidad`
        const q_entidad = await pool.query(
            'INSERT INTO entidad (id_tipo_entidad, id_pais) VALUES ($1, $2) RETURNING id_entidad',
            [id_tipo_entidad, pais_origen || null]
        );
        const entidadId = q_entidad.rows[0].id_entidad;

        // Paso 2: Insertar en la tabla `persona`
        await pool.query(
            'INSERT INTO persona (nombre, apellido, fecha_nacimiento, sexo, id_entidad) VALUES ($1, $2, $3, $4, $5)',
            [nombre, apellido, fecha_nacimiento, sexo, entidadId]
        );

        // Paso 3: Insertar en la tabla `cliente`
        await pool.query('INSERT INTO cliente (id_entidad) VALUES ($1)', [entidadId]);

        return entidadId;
    } catch (err) {
        console.error("Error al registrar cliente persona:", err);
        throw err;
    
    }
};
const insertClienteEmpresa = async (nombre_empresa, id_tipo_entidad, pais_origen) => {
    try {
        // Paso 1: Insertar en la tabla `entidad`
        const q_entidad = await pool.query(
            'INSERT INTO entidad (id_tipo_entidad, id_pais) VALUES ($1, $2) RETURNING id_entidad',
            [id_tipo_entidad, pais_origen || null]
        );
        const entidadId = q_entidad.rows[0].id_entidad;

        // Paso 2: Insertar en la tabla `empresa`
        await pool.query(
            'INSERT INTO empresa (nombre, id_entidad) VALUES ($1, $2)',
            [nombre_empresa, entidadId]
        );

        // Paso 3: Insertar en la tabla `cliente`
        await pool.query('INSERT INTO cliente (id_entidad) VALUES ($1)', [entidadId]);

        return entidadId;
    } catch (err) {
        console.error("Error al registrar cliente empresa:", err);
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
// Función para insertar direcciones
const insertDirecciones = async (entidadId, direcciones) => {
    const direccionQuery = `
        INSERT INTO direccion (lineauno, lineados, id_estado)
        VALUES ($1, $2, $3) RETURNING id_direccion
    `;
    const entidadDireccionQuery = `
        INSERT INTO entidad_direccion (id_direccion, id_entidad, id_tipo_direccion_entidad)
        VALUES ($1, $2, $3)
    `;
    
    try {
        for (const direccion of direcciones) {
            // Inserta la dirección en la tabla `direccion`
            const direccionResult = await pool.query(direccionQuery, [
                direccion.direccion,
                direccion.direccion2,
                direccion.estado,
            ]);
            const direccionId = direccionResult.rows[0].id_direccion;

            // Inserta la relación en la tabla `entidad_direccion`
            await pool.query(entidadDireccionQuery, [
                direccionId,
                entidadId,
                direccion.tipoDireccion // Este valor representa el tipo de la dirección (ej. "fiscal", "residencial", etc.)
            ]);
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
    pa.descripcion AS pais,
    
    -- Concatenar todos los teléfonos junto con su tipo en una sola cadena
    COALESCE(
        string_agg(DISTINCT t.telefono || ' (' || tt.descripcion || ')', ', '), 
        '-') AS telefonos,

    -- Concatenar todos los documentos en una cadena simplificada
    COALESCE(
        string_agg(
            DISTINCT d.numeracion || ' (' || 
            COALESCE(td.descripcion, 'Desconocido') || ', ' || 
            COALESCE(d.fecha_emision::text, 'Desconocida') || ', ' ||
            COALESCE(d.fecha_vencimiento::text, 'Desconocida') || ', ' ||
            COALESCE(pais.descripcion, 'Desconocido') || ')'
        , ', '), 
        '-') AS documentos

FROM entidad e
LEFT JOIN pais pa ON pa.id_pais = e.id_pais
INNER JOIN cliente c ON c.id_entidad = e.id_entidad
INNER JOIN persona p ON p.id_entidad = e.id_entidad
LEFT JOIN telefono t ON t.id_entidad = e.id_entidad
LEFT JOIN tipo_telefono tt ON t.id_tipo_telefono = tt.id_tipo_telefono
LEFT JOIN documento d ON d.id_entidad = e.id_entidad
LEFT JOIN tipo_documento td ON td.id_tipo_documento = d.id_tipo_documento
LEFT JOIN pais ON d.id_pais = pais.id_pais

-- Agrupar por los campos de entidad, persona y país de la entidad
GROUP BY 
    e.id_entidad, 
    p.nombre, 
    p.apellido, 
    p.fecha_nacimiento,
	pa.descripcion
ORDER BY 
    e.id_entidad;

      `);
      return result.rows;
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      throw error;
    }
  };


module.exports = {
    insertTelefonos,
    insertDocumentos,
    insertDirecciones,
    getClientes,
    insertClienteEmpresa,
    insertDatosAdicionales,
    insertClientePersona
};
