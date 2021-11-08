const winston = require('winston');
require('express-async-errors');

// Se disponibiliza el método para manejar los logs de excepciones 
// Los logs se muestran por consola y se registran por separado
module.exports = function() {
  winston.exceptions.handle(
    new winston.transports.Console({ colorize: true, prettyPrint: true }),
    new winston.transports.File({ filename: 'uncaughtExceptions.log' }));
  
  process.on('unhandledRejection', (ex) => {
    throw ex;
  });
  
  winston.add(new winston.transports.File({ filename: 'logfile.log', handleExceptions: true }));
}