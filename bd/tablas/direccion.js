const pool = require('../conexion');

const getTipoDireccionEntidad = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_tipo_direccion_entidad AS id, descripcion FROM tipo_direccion_entidad');
    res.status(200).json(result.rows); 
  } catch (error) {
    console.error("Error al obtener tipos de direccion:", error);
    res.status(500).json({ error: 'Error al obtener tipos de direccion' });
  }
};

module.exports = {
    getTipoDireccionEntidad
};
