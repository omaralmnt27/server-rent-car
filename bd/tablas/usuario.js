const pool = require('../conexion');

const getUsuarios = async () => {
  try {
    const result = await pool.query('SELECT usuario, clave FROM usuario');
    return result.rows;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const insertUsuario = async (usuario, clave) => {
  try {
    const result = await pool.query('INSERT INTO usuario (usuario, clave) VALUES ($1, $2)', [usuario, clave]);
    return result.rowCount;
  } catch (err) {
    console.error(err);
    throw err;
  }
};


const ValidarUsuario = async (usuario, clave) => {
  try {
    const result = await pool.query('SELECT * FROM USUARIO WHERE usuario = $1 and clave =$2', [usuario, clave]);
    return result.rowCount;
  } catch (err) {
    console.error(err);
    throw err;
  }
};

module.exports = {
  getUsuarios,
  insertUsuario,
  ValidarUsuario,
};
