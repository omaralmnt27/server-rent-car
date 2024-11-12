const pool = require('../conexion');

const getColor = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_color AS id, descripcion FROM color');
    res.status(200).json(result.rows); // Enviar el resultado como JSON
  } catch (error) {
    console.error("Error al obtener colores:", error);
    res.status(500).json({ error: 'Error al obtener colores' });
  }
};

module.exports = {
  getColor
};
