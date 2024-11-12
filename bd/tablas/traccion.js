const pool = require('../conexion');

const getTraccion = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_tipo_traccion AS id, descripcion FROM tipo_traccion');
    res.status(200).json(result.rows); // Enviar el resultado como JSON
  } catch (error) {
    console.error("Error al obtener tracciones:", error);
    res.status(500).json({ error: 'Error al obtener tracciones' });
  }
};

module.exports = {
  getTraccion
};
