const pool = require('../conexion');

const getTipoTelefono = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_tipo_telefono AS id, descripcion FROM tipo_telefono');
    res.status(200).json(result.rows); // Enviar el resultado como JSON
  } catch (error) {
    console.error("Error al obtener tipos de teléfono:", error);
    res.status(500).json({ error: 'Error al obtener tipos de teléfono' });
  }
};

module.exports = {
  getTipoTelefono
};
