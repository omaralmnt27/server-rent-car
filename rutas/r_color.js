const express = require('express');
const router = express.Router();
const { getColor } = require('../bd/tablas/color');

router.get('/', getColor);

module.exports = router;
