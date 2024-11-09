const pool = require('../conexion');

const getEstado = async (req, res) => {
  const { idpais } = req.params; // Obtener el idpais desde los parámetros de la URL
  try {
    const result = await pool.query(
      'SELECT idestado AS id, nombre FROM estado WHERE idpais = $1',
      [idpais]
    );
    res.status(200).json(result.rows); // Enviar el resultado como JSON
  } catch (error) {
    console.error("Error al obtener estados:", error);
    res.status(500).json({ error: 'Error al obtener estados' });
  }
};

module.exports = {
  getEstado
};
