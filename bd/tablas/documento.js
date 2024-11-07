const pool = require('../conexion');

const getTipoDocumento = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_tipo_documento AS id, descripcion FROM tipo_documento');
    res.status(200).json(result.rows); // Enviar el resultado como JSON
  } catch (error) {
    console.error("Error al obtener tipos de documento:", error);
    res.status(500).json({ error: 'Error al obtener tipos de documento' });
  }
};

module.exports = {
  getTipoDocumento
};
