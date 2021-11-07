const config = require('config');

// Mensaje
const ERROR_FATAL = 'ERROR FATAL: jwtPrivateKey no está definida.';

module.exports = function() {
  if (!config.get('jwtPrivateKey')) {
    throw new Error(ERROR_FATAL);
  }
}