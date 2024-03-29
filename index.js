const express = require('express');
var cors = require('cors');
const app = express();

/**
 * Se importa este paquete para la gestión de transportes 
 * Un transporte es un dispositivo donde se almacenan los logs 
 */ 
const winston = require('winston');

// Se habilita CORS para todos los endpoints
app.use(cors()) 

require('./startup/logging')();
require('./startup/routes')(app);
require('./startup/db')();
require('./startup/config')();
require('./startup/validation')();
require('./startup/prod')(app);


const port = process.env.PORT || 3000;
const server = app.listen(port, () => winston.info(`Encuchando en el puerto ${port}...`));

module.exports = server;