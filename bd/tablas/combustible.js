const pool = require('../conexion');

const getCombustible = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_combustible AS id, descripcion FROM combustible');
    res.status(200).json(result.rows); // Enviar el resultado como JSON
  } catch (error) {
    console.error("Error al obtener combustibles:", error);
    res.status(500).json({ error: 'Error al obtener combustibles' });
  }
};

module.exports = {
  getCombustible
};
