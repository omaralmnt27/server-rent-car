const pool = require('../conexion');


const getTelefonoOrder = async (idPersona, idTipoTelefono) => {
    const result = await pool.query(
        `SELECT COALESCE(MAX(orden), 0) + 1 AS next_order 
         FROM telefono 
         WHERE id_persona = $1 AND id_tipo_telefono = $2`,
        [idPersona, idTipoTelefono]
    );
    return result.rows[0].next_order;
};


const insertDatosAdicionales = async (personaId, telefonos, documentos, direcciones) => {
    console.log('------------------------------------');
    console.log(documentos);
    try {
        // Insertar teléfonos
        if (Array.isArray(telefonos) && telefonos.length > 0) {
            for (const telefono of telefonos) {
                try {
                    // Obtener el próximo valor de orden para la combinación actual de id_persona y id_tipo_telefono
                    const orden = await getTelefonoOrder(personaId, telefono.tipo.id);
        
                    // Insertar el teléfono con el orden calculado
                    await pool.query(
                        'INSERT INTO telefono (id_persona, id_tipo_telefono, telefono, orden) VALUES ($1, $2, $3, $4)',
                        [personaId, telefono.tipo.id, telefono.valor, orden]
                    );
        
                } catch (error) {
                    console.error("Error al insertar teléfono:", error);
                }
            }
        }
        

        // Insertar documentos
        if (Array.isArray(documentos) && documentos.length > 0) {
            for (const doc of documentos) {
                await pool.query(
                    'INSERT INTO documento (id_persona, id_tipo_documento, numeracion, id_pais,fecha_emision,fecha_vencimiento) VALUES ($1, $2, $3, $4, $5, $6)',
                    [personaId, doc.tipo.id, doc.valor, doc.pais,doc.fechaEmision,doc.fechaVencimiento]
                );
            }
        }

        // Insertar direcciones
        if (Array.isArray(direcciones) && direcciones.length > 0) {
            for (const dir of direcciones) {
                // Insertar en la tabla 'direccion' para obtener el id_direccion
                const direccionResult = await pool.query(
                    `INSERT INTO direccion (lineauno, lineados, id_estado) 
                     VALUES ($1, $2, $3) RETURNING id_direccion`,
                    [dir.direccion, dir.direccion2, dir.estado]
                );
                const idDireccion = direccionResult.rows[0].id_direccion;
                await pool.query(
                    `INSERT INTO persona_direccion (id_persona, id_direccion, id_tipo_direccion_persona) 
                     VALUES ($1, $2, $3)`,
                    [personaId, idDireccion, dir.tipoDireccion]
                );
            }
        }
    } catch (err) {
        console.error("Error al insertar datos adicionales:", err);
        throw err;
    }
};

// Función para insertar un cliente

const insertClientePersona = async (nombre, apellido, fecha_nacimiento, sexo, correo, id_pais) => {

    console.log("Cliente:")
    console.log(nombre)
    console.log(apellido)
    console.log(fecha_nacimiento)
    console.log(sexo)
    console.log(correo)
    console.log(id_pais)
    try {
        // Crear una variable para almacenar el ID devuelto por el procedimiento
        const result = await pool.query(
            `CALL sp_insert_cliente($1, $2, $3, $4, $5, $6, $7, $8)`,
            [nombre, apellido, fecha_nacimiento, sexo, correo, id_pais, null, null]
        );
    
        // El `id_persona` se devolverá en la última posición del resultado
        const personaId = result.rows[0]?.p_id_persona;
        console.log("Cliente insertado con id_persona:", personaId);
    
        return personaId;
    } catch (err) {
        console.error("Error al registrar cliente persona usando el SP:", err);
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
          p.id_persona AS id,
          p.nombre,
          p.apellido,
          p.fecha_nacimiento,
          p.correo,
          p.sexo,
          p.pais_descripcion,
  
          COALESCE(
            string_agg(DISTINCT vt.telefono || ' (' || vt.tipo_telefono || ')', ', '), 
            '-') AS telefonos,
  
          COALESCE(
            string_agg(
              DISTINCT vd.numeracion || ' (' || 
              COALESCE(vd.tipo_documento, 'Desconocido') || ', ' || 
              COALESCE(vd.fecha_emision::text, 'Desconocida') || ', ' ||
              COALESCE(vd.fecha_vencimiento::text, 'Desconocida') || ', ' ||
              COALESCE(vd.pais_descripcion, 'Desconocido') || ')', 
            ', '), 
            '-') AS documentos,
  
          COALESCE(
            string_agg(
              DISTINCT vd.lineauno || ' ' || 
              COALESCE(vd.lineados, '') || ' (' || 
              COALESCE(vd.tipo_direccion, 'Desconocido') || ', ' ||
              COALESCE(vd.estado, 'Desconocido') || ', ' ||
              COALESCE(vd.pais_descripcion, 'Desconocido') || ')', 
            ', '), 
            '-') AS direcciones
  
        FROM vw_personas_clientes p
        LEFT JOIN vw_telefonos_persona vt ON vt.id_persona = p.id_persona
        LEFT JOIN vw_documentos_persona vd ON vd.id_persona = p.id_persona
        LEFT JOIN vw_direcciones_persona vd ON vd.id_persona = p.id_persona
  
        GROUP BY 
          p.id_persona, 
          p.nombre, 
          p.apellido, 
          p.fecha_nacimiento,
          p.correo,
          p.sexo,
          p.pais_descripcion
        ORDER BY p.id_persona;
      `);
  
      return result.rows;
    } catch (error) {
      console.error("Error al obtener clientes:", error);
      throw error;
    }
  };
  

// Obtener un cliente por su ID
const getClienteById = async (id) => {
    console.log("Obteniendo datos para el cliente con id:", id);

    // Query para obtener los detalles del cliente
    const clienteQuery = `
        SELECT * 
        FROM vw_cliente_detalle 
        WHERE id = $1;
    `;

    // Query para obtener los teléfonos del cliente
    const telefonosQuery = `
        SELECT telefono, tipo_telefono, id_tipo_telefono 
        FROM vw_telefonos_cliente 
        WHERE id = $1;
    `;

    // Query para obtener los documentos del cliente
    const documentosQuery = `
        SELECT * 
        FROM vw_documentos_cliente 
        WHERE id_entidad = $1;
    `;

    // Query para obtener las direcciones del cliente
    const direccionesQuery = `
        SELECT *
        FROM vw_direcciones_cliente 
        WHERE id_entidad = $1;
    `;

    try {
        // Ejecutar todas las consultas en paralelo
        const [clienteResult, telefonosResult, documentosResult, direccionesResult] = await Promise.all([
            pool.query(clienteQuery, [id]),
            pool.query(telefonosQuery, [id]),
            pool.query(documentosQuery, [id]),
            pool.query(direccionesQuery, [id])
        ]);

        // Logging para depuración
        console.log("Resultados de cliente:", clienteResult.rows);
        console.log("Resultados de teléfonos:", telefonosResult.rows);
        console.log("Resultados de documentos:", documentosResult.rows);
        console.log("Resultados de direcciones:", direccionesResult.rows);

        // Validar si se obtuvieron resultados
        if (!clienteResult.rows.length) {
            console.error(`No se encontró cliente con id ${id}`);
            return null;
        }

        const cliente = clienteResult.rows[0];

        // Mapear los teléfonos
        const telefonos = telefonosResult.rows.map(row => ({
            telefono: row.telefono,
            tipo: row.tipo_telefono,
            id_tipo_telefono: row.id_tipo_telefono
        }));

        // Mapear los documentos
        const documentos = documentosResult.rows.map(row => ({
            documento: row.documento,
            tipo: row.tipo_documento,
            id_tipo_documento: row.id_tipo_documento,
            fecha_emision: row.fecha_emision ? row.fecha_emision.toISOString().split('T')[0] : null,
            fecha_vencimiento: row.fecha_vencimiento ? row.fecha_vencimiento.toISOString().split('T')[0] : null,
            id_pais: row.id_pais,
            pais: row.pais,
            id_documento: row.id_documento
        }));

        // Mapear las direcciones
        const direcciones = direccionesResult.rows.map(row => ({
            id_direccion: row.id_direccion,
            lineauno: row.lineauno,
            lineados: row.lineados,
            id_estado: row.id_estado,
            estado: row.estado,
            id_tipo_direccion_entidad: row.id_tipo_direccion_entidad,
            tipo_direccion: row.tipo_direccion,
            id_pais: row.id_pais,
            pais: row.pais
        }));
        console.log("Direcciones mapeadas desde el backend:", direcciones);


        // Retornar el cliente con los teléfonos, documentos y direcciones
        const result = { ...cliente, telefonos, documentos, direcciones };
        console.log("Resultado final:", result);
        return result;
    } catch (error) {
        console.error("Error al obtener el cliente:", error);
        throw error;
    }
};


// Actualizar cliente persona
async function updateClientePersona(id, nombre, apellido, fecha_nacimiento, sexo, pais_origen, correo) {
    try {
        const query = `
            CALL sp_update_cliente($1, $2, $3, $4, $5, $6, NULL, $7, $8)
        `;
        await pool.query(query, [
            id,              // id_entidad
            1,               // tipo_cliente (1 = Persona)
            nombre,
            apellido,
            fecha_nacimiento,
            sexo,
            pais_origen,
            correo           // Correo electrónico
        ]);
    } catch (err) {
        console.error("Error al actualizar cliente persona:", err);
        throw err;
    }
}

// Actualizar cliente empresa
async function updateClienteEmpresa(id, nombre_empresa, pais_origen, correo) {
    try {
        const query = `
            CALL sp_update_cliente($1, $2, NULL, NULL, NULL, NULL, $3, $4, $5)
        `;
        await pool.query(query, [
            id,               // id_entidad
            2,                // tipo_cliente (2 = Empresa)
            nombre_empresa,
            pais_origen,
            correo            // Correo electrónico
        ]);
    } catch (err) {
        console.error("Error al actualizar cliente empresa:", err);
        throw err;
    }
}

// Actualizar datos adicionales (teléfonos, documentos, direcciones)
async function getTiposTelefono() {
    // Obtener los tipos de teléfono y crear un mapa
    const result = await pool.query('SELECT id_tipo_telefono, descripcion FROM tipo_telefono');
    const tiposTelefonoMap = {};
    result.rows.forEach(row => {
        tiposTelefonoMap[row.descripcion.toLowerCase()] = row.id_tipo_telefono;
    });
    return tiposTelefonoMap;
}

async function getTiposDocumento() {
    const query = `SELECT id_tipo_documento, descripcion FROM tipo_documento`;
    const result = await pool.query(query);
    
    // Convertir los resultados en un mapa con la descripción como clave y el id como valor
    const tiposDocumentoMap = {};
    result.rows.forEach((row) => {
        tiposDocumentoMap[row.descripcion.toLowerCase()] = row.id_tipo_documento;
    });
    return tiposDocumentoMap;
}


async function updateDatosAdicionales(entidadId, telefonos, documentos, direcciones) {
    // Obtener los tipos de teléfono y crear un mapa
    const tiposTelefonoMap = await getTiposTelefono();
    const tiposDocumentoMap = await getTiposDocumento(); // Asumo que esta función existe para obtener tipos de documentos

    // Actualizar teléfonos usando el stored procedure
    if (telefonos && telefonos.length > 0) {
        for (const telefono of telefonos) {
            // Convertir la descripción del tipo de teléfono en su ID
            const tipoId = tiposTelefonoMap[telefono.tipo.toLowerCase()];

            // Validar que exista el tipo de teléfono
            if (!tipoId) {
                console.error(`Tipo de teléfono no encontrado: ${telefono.tipo}`);
                continue;
            }

            // Llamar al stored procedure para actualizar/insertar el teléfono
            try {
                await pool.query(
                    `CALL sp_update_telefono($1, $2, $3)`,
                    [entidadId, tipoId, telefono.telefono]
                );
            } catch (error) {
                console.error(`Error al actualizar teléfono para entidad ${entidadId}:`, error);
            }
        }
    }

    // Actualizar documentos
    if (documentos && documentos.length > 0) {
        for (const documento of documentos) {
            // Convertir la descripción del tipo de documento en su ID
            const tipoDocumentoId = tiposDocumentoMap[documento.tipo.toLowerCase()];

            // Validar que exista el tipo de documento
            if (!tipoDocumentoId) {
                console.error(`Tipo de documento no encontrado: ${documento.tipo}`);
                continue;
            }

            // Llamar al stored procedure para actualizar/insertar el documento
            try {
                await pool.query(
                    `CALL sp_update_documento($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
                    [
                        documento.id_documento || null, // Pasar `NULL` si es un nuevo documento
                        entidadId,
                        tipoDocumentoId, // Usar el ID en lugar de la descripción
                        documento.id_pais,
                        documento.numero,
                        documento.fecha_emision,
                        documento.fecha_vencimiento,
                        documento.imagen_frontal,
                        documento.imagen_trasera
                    ]
                );
            } catch (error) {
                console.error(`Error al actualizar documento para entidad ${entidadId}:`, error);
            }
        }
    }

    // Actualizar direcciones (Placeholder para futura implementación)
    if (direcciones && direcciones.length > 0) {
        console.log('Direcciones recibidas, pero aún no se manejan:', direcciones);
    }
}



 
module.exports = {
    insertTelefonos,
    insertDocumentos,
    insertDirecciones,
    getClientes,
    insertDatosAdicionales,
    insertClientePersona,
    getClienteById,
    updateClientePersona,
    updateDatosAdicionales
    //updateCliente
};
