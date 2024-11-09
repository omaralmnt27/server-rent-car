const express = require('express');
const router = express.Router();
const { getEstado } = require('../bd/tablas/estado');

router.get('/', getEstado);

module.exports = router;
