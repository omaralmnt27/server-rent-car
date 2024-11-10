const pool = require('../conexion');

const getEstado = async (req, res) => {
  const { idpais } = req.body; // Tomamos idpais desde el cuerpo de la solicitud
  console.log("ID del país recibido:", idpais);
  try {
    const result = await pool.query(
      'SELECT id_estado AS id, nombre FROM estado WHERE id_pais = $1',
      [idpais]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener estados:", error);
    res.status(500).json({ error: 'Error al obtener estados' });
  }
};

module.exports = {
  getEstado
};
