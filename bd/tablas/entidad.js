const pool = require('../conexion');

const getTipoCliente = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_tipo_entidad AS id, descripcion FROM tipo_entidad');
    res.status(200).json(result.rows); 
  } catch (error) {
    console.error("Error al obtener tipos de cliente:", error);
    res.status(500).json({ error: 'Error al obtener tipos de cliente' });
  }
};

module.exports = {
  getTipoCliente
};
