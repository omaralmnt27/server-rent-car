const pool = require('../conexion');

const getTipoVehiculo = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_tipo_vehiculo AS id, descripcion FROM tipo_vehiculo');
    res.status(200).json(result.rows); // Enviar el resultado como JSON
  } catch (error) {
    console.error("Error al obtener tipos de vehiculos:", error);
    res.status(500).json({ error: 'Error al tipos de vehiculos' });
  }
};

module.exports = {
  getTipoVehiculo
};
