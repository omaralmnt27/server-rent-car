const express = require("express");
const cors = require("cors");
const usuariosRoutes = require('./rutas/r_usuario'); 
const clientesRoutes = require('./rutas/r_cliente'); 
const entidadesRoutes = require('./rutas/r_entidad'); 
const app = express();
const PORT = process.env.PORT || 4000; // Puerto en el que el servidor escuchará
app.use(express.json());

app.use(cors());

if(process.env.NODE_ENV === "production"){

}

app.use('/usuarios', usuariosRoutes);
app.use('/clientes', clientesRoutes);

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
