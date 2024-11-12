const express = require('express');
const router = express.Router();
const { getTraccion } = require('../bd/tablas/traccion');

router.get('/', getTraccion);

module.exports = router;
