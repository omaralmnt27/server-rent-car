const pool = require('../conexion');

const getTipoEntidad = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_tipo_entidad AS id, descripcion FROM tipo_entidad');
    res.status(200).json(result.rows); 
  } catch (error) {
    console.error("Error al obtener tipos de entidad:", error);
    res.status(500).json({ error: 'Error al obtener tipos de entidad' });
  }
};

module.exports = {
    getTipoEntidad
};
