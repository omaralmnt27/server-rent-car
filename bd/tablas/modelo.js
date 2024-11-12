const pool = require('../conexion');

const getModelo = async (req, res) => {
  const { idmarca } = req.body; // Tomamos idpais desde el cuerpo de la solicitud
  console.log("ID del país recibido:", idmarca);
  try {
    const result = await pool.query(
      'SELECT id_modelo AS id, descripcion FROM modelo WHERE id_marca = $1',
      [idmarca]
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
