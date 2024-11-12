const db = require('../conexion');

// Función para insertar un vehículo en la tabla `vehiculo`
const insertVehiculo = async ({
    matricula,
    placa,
    consumo,
    cantidad_puertas,
    cantidad_pasajeros,
    marca,
    modelo,
    version,
    combustible,
    traccion,
    millaje,
    estado,
    tipoVehiculo
}) => {
    try {
        const query = `
            INSERT INTO vehiculo (
                matricula,
                placa,
                consumo,
                cantidad_puerta,
                cantidad_pasajero,
                marca_id,
                modelo_id,
                version_id,
                combustible_id,
                traccion_id,
                millaje,
                estado_id,
                tipo_vehiculo_id
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13) RETURNING id_vehiculo;
        `;
        const values = [
            matricula,
            placa,
            consumo,
            cantidad_puertas,
            cantidad_pasajeros,
            marca,
            modelo,
            version,
            combustible,
            traccion,
            millaje,
            estado,
            tipoVehiculo
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
    getVehiculos,
    getVehiculoById,
    // otras funciones si existen
};
