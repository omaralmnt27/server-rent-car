const express = require('express');
const router = express.Router();
const { getTipoDocumento } = require('../bd/tablas/documento');

router.get('/tipotelefono', getTipoDocumento);

module.exports = router;
