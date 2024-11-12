const pool = require('../conexion');

const getModelo = async (req, res) => {
  const { id_marca } = req.body; // Tomamos idpais desde el cuerpo de la solicitud
  console.log("ID del marca recibido:", id_marca);
  try {
    const result = await pool.query(
      'SELECT id_modelo AS id, descripcion FROM modelo WHERE id_marca = $1',
      [id_marca]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Error al obtener estados:", error);
    res.status(500).json({ error: 'Error al obtener estados' });
  }
};

module.exports = {
  getModelo
};
