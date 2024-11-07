const express = require('express');
const router = express.Router();
const { getTipoTelefono } = require('../bd/tablas/telefono');

router.get('/tipotelefono', getTipoTelefono);

module.exports = router;
