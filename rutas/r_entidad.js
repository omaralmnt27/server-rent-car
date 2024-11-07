const express = require('express');
const router = express.Router();
const { getTipoEntidad } = require('../bd/tablas/entidad');

// Ruta para obtener los tipos de cliente
router.get('/tipocliente', getTipoCliente);

module.exports = router;
