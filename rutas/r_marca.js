const express = require('express');
const router = express.Router();
const { getMarca } = require('../bd/tablas/marca');

router.get('/', getMarca);

module.exports = router;
