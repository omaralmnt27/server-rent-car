const db = require('../conexion');

// Función para insertar un vehículo en la tabla `vehiculo`
const insertVehiculo = async ({
    matricula,
    placa,
    anio,
    consumo,
    cantidad_puerta,
    cantidad_pasajero,
    id_color,
    id_version,
    id_tipo_vehiculo,
    id_estado_vehiculo,
    id_tipo_traccion
}) => {
    try {
        const query = `
            INSERT INTO vehiculo (
                matricula,
                placa,
                anio,
                consumo,
                cantidad_puerta,
                cantidad_pasajero,
                id_color,
                id_version,
                id_tipo_vehiculo,
                id_estado_vehiculo,
                id_tipo_traccion
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id_vehiculo;
        `;
        const values = [
            matricula,
            placa,
            anio,
            consumo,
            cantidad_puerta,
            cantidad_pasajero,
            id_color,
            id_version,
            id_tipo_vehiculo,
            id_estado_vehiculo,
            id_tipo_traccion
        ];
      
        const result = await db.query(query, values);
        return result.rows[0].id_vehiculo;

    } catch (err) {
        console.error("Error al registrar vehículo:", err);
        throw err;
    }
};

const getVehiculo = async () => {
    try {
        const result = await pool.query(`
            SELECT 
                v.id_vehiculo AS id, 
                v.matricula, 
                v.placa, 
                v.anio,
                v.consumo, 
                v.cantidad_puerta, 
                v.cantidad_pasajero, 
                c.descripcion AS color,
                ve.descripcion AS version,
                mo.descripcion AS modelo, 
                m.descripcion AS marca,
                tv.descripcion AS tipo_vehiculo,
                ev.descripcion AS estado_vehiculo, 
                tt.descripcion AS tipo_traccion
            FROM vehiculo v
            INNER JOIN color c ON v.id_color = c.id_color
            INNER JOIN version ve ON v.id_version = ve.id_version,
            INNER JOIN modelo mo ON mo.id_modelo = ve.id_modelo,
            INNER JOIN marca m ON mo.id_marca = m.id_marca,
            INNER JOIN tipo_vehiculo tv ON v.id_tipo_vehiculo = tv.id_tipo_vehiculo
            INNER JOIN estado_vehiculo ev ON v.id_estado_vehiculo = ev.id_estado_vehiculo
            INNER JOIN tipo_traccion tt ON v.id_tipo_traccion = tt.id_tipo_traccion
        `);
        return result.rows;
    } catch (error) {
        console.error("Error al obtener vehículos:", error);
        throw error;
    }
};



module.exports = {
    insertVehiculo,
    getVehiculo,
};
