const express = require("express");
const cors = require("cors");
const usuariosRoutes = require('./rutas/r_usuario'); 
const clientesRoutes = require('./rutas/r_cliente'); 
const entidadesRoutes = require('./rutas/r_entidad'); 
const telefonosRoutes = require('./rutas/r_telefono'); 
const documentosRoutes = require('./rutas/r_documento.js'); 
const paisesRoutes = require('./rutas/r_pais.js'); 
const estadosRoutes = require('./rutas/r_estado.js'); 
const direccionesRoutes = require('./rutas/r_direccion.js'); 
const combustiblesRoutes = require('./rutas/r_combustible.js'); 
const traccionesRoutes = require('./rutas/r_traccion.js'); 
const marcasRoutes = require('./rutas/r_marca.js'); 
const modelosRoutes = require('./rutas/r_modelo.js'); 
const versionesRoutes = require('./rutas/r_version.js'); 
const estadosVehiculosRoutes = require('./rutas/r_estadoVehiculo.js'); 
const tiposVehiculosRoutes = require('./rutas/r_tipoVehiculo.js'); 
const coloresRoutes = require('./rutas/r_color.js');
const vehiculosRoutes = require('./rutas/r_vehiculo.js');



const app = express();
const PORT = process.env.PORT || 4000; // Puerto en el que el servidor escuchará
app.use(express.json());

app.use(cors())
app.options('*',cors());

if(process.env.NODE_ENV === "production"){

}

app.use('/usuarios', usuariosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/entidades', entidadesRoutes);
app.use('/telefonos', telefonosRoutes);
app.use('/documentos', documentosRoutes);
app.use('/paises', paisesRoutes);
app.use('/estados', estadosRoutes);
app.use('/direcciones', direccionesRoutes);
app.use('/combustibles', combustiblesRoutes);
app.use('/tracciones', traccionesRoutes);
app.use('/marcas', marcasRoutes);
app.use('/modelos', modelosRoutes);
app.use('/versiones', versionesRoutes);
app.use('/estadosVehiculos', estadosVehiculosRoutes);
app.use('/tiposVehiculos', tiposVehiculosRoutes);
app.use('/colores', coloresRoutes);
app.use('/vehiculos', vehiculosRoutes);



app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
