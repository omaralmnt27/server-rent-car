const pool = require('../conexion');

const getEstadoVehiculo = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_estado_vehiculo AS id, descripcion FROM estado_vehiculo');
    res.status(200).json(result.rows); // Enviar el resultado como JSON
  } catch (error) {
    console.error("Error al obtener estados:", error);
    res.status(500).json({ error: 'Error al obtener estados' });
  }
};

module.exports = {
  getEstadoVehiculo
};
