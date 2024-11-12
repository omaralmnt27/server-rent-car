const express = require('express');
const router = express.Router();
const { getModelo } = require('../bd/tablas/modelo');

router.get('/', getModelo);

module.exports = router;
