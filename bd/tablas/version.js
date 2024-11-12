const pool = require('../conexion');

const getVersion = async (req, res) => {
  const { id_modelo } = req.body; // Tomamos idpais desde el cuerpo de la solicitud
  console.log("ID del marca recibido:", id_modelo);
  try {
    const result = await pool.query(
      'SELECT id_version AS id, descripcion FROM version WHERE id_modelo= $1',
      [id_modelo]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener estados:", error);
    res.status(500).json({ error: 'Error al obtener estados' });
  }
};

module.exports = {
  getVersion
};
