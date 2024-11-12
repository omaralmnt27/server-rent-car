const express = require('express');
const router = express.Router();
const { getVersion } = require('../bd/tablas/version');

router.post('/', getVersion);

module.exports = router;
