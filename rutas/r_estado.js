const express = require('express');
const router = express.Router();
const { getEstado } = require('../bd/tablas/estado');

router.post('/', getEstado);

module.exports = router;
