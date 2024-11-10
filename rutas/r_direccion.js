const express = require('express');
const router = express.Router();
const { getTipoDireccionEntidad } = require('../bd/tablas/direccion');

router.post('/tipos', getTipoDireccionEntidad);

module.exports = router;
