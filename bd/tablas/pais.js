const pool = require('../conexion');

const getPais = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_pais AS id, descripcion FROM pais');
    res.status(200).json(result.rows); // Enviar el resultado como JSON
  } catch (error) {
    console.error("Error al obtener paises:", error);
    res.status(500).json({ error: 'Error al obtener paises' });
  }
};

module.exports = {
  getPais
};
