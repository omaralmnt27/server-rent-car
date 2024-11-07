const express = require('express');
const router = express.Router();
const { getPais } = require('../bd/tablas/pais');

router.get('/', getPais);

module.exports = router;
