const express = require('express');
const router = express.Router();
const { getEstadoVehiculo } = require('../bd/tablas/estadoVehiculo');

router.get('/', getEstadoVehiculo);

module.exports = router;
