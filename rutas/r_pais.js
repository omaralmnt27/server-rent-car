const express = require('express');
const router = express.Router();
const { getPais } = require('../bd/tablas/pais');

router.get('/pais', getPais);

module.exports = router;
