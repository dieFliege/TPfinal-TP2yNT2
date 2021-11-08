const winston = require('winston');

// Se disponibiliza el middleware de error ante fallos inesperados 
module.exports = function(err, req, res, next){
  winston.error(err.message, err);

  res.status(500).send('Fallo inesperado.');
}