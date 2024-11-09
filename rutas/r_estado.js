const express = require('express');
const router = express.Router();
const { getEstado } = require('../bd/tablas/estado');

router.get('/1', getEstado);

module.exports = router;
