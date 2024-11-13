const express = require('express');
const router = express.Router();
const { insertVehiculo, getVehiculo } = require('../bd/tablas/vehiculo');

// Ruta para registrar un nuevo vehículo
router.post('/', async (req, res) => {
    const {
        matricula,
        placa,
        anio,
        consumo,
        cantidad_puertas,
        cantidad_pasajeros,
        color,
        version,
        tipoVehiculo,
        estado,
        traccion
    } = req.body;

    try {
        const vehiculoId = await insertVehiculo({
            matricula,
            placa,
            anio,
            consumo,
            cantidad_puertas,
            cantidad_pasajeros,
            id_color: color,
            id_version: version,
            id_tipo_vehiculo: tipoVehiculo,
            id_estado_vehiculo: estado,
            id_tipo_traccion: traccion
        });

        return res.status(201).json({ message: 'Vehículo registrado correctamente', id_vehiculo: vehiculoId });
    } catch (error) {
        console.error("Error al registrar vehículo:", error);
        return res.status(500).json({ error: `Error en el servidor: ${error.message}` });
    }
});


router.get('/', async (req, res) => {
    try {
        const vehiculos = await getVehiculo();
        return res.status(200).json(vehiculos);
    } catch (error) {
        console.error("Error al obtener los vehiculos:", error);
        return res.status(500).json({ error: 'Error al obtener los vehículos' });
    }
});


module.exports = router;
