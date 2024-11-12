const express = require('express');
const router = express.Router();
const {
  insertVehiculo,
  getVehiculos,
} = require('../bd/tablas/vehiculo');

// Ruta para registrar un nuevo vehículo
router.post('/', async (req, res) => {
  const {
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
  } = req.body;

  try {
    const vehiculoId = await insertVehiculo({
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
    });

    return res.status(201).json({ message: 'Vehículo registrado correctamente', id_vehiculo: vehiculoId });
  } catch (error) {
    console.error("Error al registrar vehículo:", error);
    return res.status(500).json({ error: `Error en el servidor: ${error.message}` });
  }
});

// Ruta para obtener todos los vehículos
router.get('/', async (req, res) => {
  try {
    const vehiculos = await getVehiculos();
    return res.status(200).json(vehiculos);
  } catch (error) {
    console.error("Error al obtener vehículos:", error);
    return res.status(500).json({ error: 'Error al obtener vehículos' });
  }
});



module.exports = router;
