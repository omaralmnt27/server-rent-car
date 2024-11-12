const express = require('express');
const router = express.Router();
const { getTipoVehiculo } = require('../bd/tablas/tipoVehiculo');

router.get('/', getTipoVehiculo);

module.exports = router;
