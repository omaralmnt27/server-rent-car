const express = require('express');
const router = express.Router();
const { getCombustible } = require('../bd/tablas/combustible');

router.get('/', getCombustible);

module.exports = router;
