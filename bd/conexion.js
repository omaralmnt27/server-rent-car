const { Pool } = require("pg");

// Cargar las variables de entorno
require("dotenv").config();

const proConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Permitir certificados no verificados (esto es común en desarrollo)
  },
};

const pool = new Pool(proConfig);

module.exports = pool;
