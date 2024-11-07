const pool = require('../conexion');

const insertCliente = async (usuario, clave) => {
    try {
      const result = await pool.query('INSERT INTO usuario (usuario, clave) VALUES ($1, $2)', [usuario, clave]);
      return result.rowCount;
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  module.exports = {
    InsertCliente,
  
  };
  