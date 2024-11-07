const express = require('express');
const router = express.Router();
const { getTipoEntidad } = require('../bd/tablas/entidad');

// Ruta para obtener los tipos de cliente
router.get('/tipocliente', getTipoEntidad);

module.exports = router;
