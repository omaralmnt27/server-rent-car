const pool = require('../conexion');

const getMarca = async (req, res) => {
  try {
    const result = await pool.query('SELECT id_marca AS id, descripcion FROM marca');
    res.status(200).json(result.rows); // Enviar el resultado como JSON
  } catch (error) {
    console.error("Error al obtener marcas:", error);
    res.status(500).json({ error: 'Error al obtener marcas' });
  }
};

module.exports = {
  getMarca
};
