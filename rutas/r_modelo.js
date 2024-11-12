const express = require('express');
const router = express.Router();
const { getModelo } = require('../bd/tablas/modelo');

router.post('/', getModelo);

module.exports = router;
