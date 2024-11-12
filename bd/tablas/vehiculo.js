const db = require('../conexion');

// Función para insertar un vehículo en la tabla `vehiculo`
const insertVehiculo = async ({
    matricula,
    placa,
    anio,
    consumo,
    cantidad_puertas,
    cantidad_pasajeros,
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
                id_tipo_trasccion
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING id_vehiculo;
        `;
        const values = [
            matricula,
            placa,
            anio,
            consumo,
            cantidad_puertas,
            cantidad_pasajeros,
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

module.exports = {
    insertVehiculo,
    // otras funciones si existen
};
