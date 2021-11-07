const jwt = require('jsonwebtoken');
const config = require('config');

// Mensajes
const ACCESO_DENEGADO = 'Acceso denegado. El token no fue generado.';
const TOKEN_INVALIDO = "Token inválido";

// Se disponibiliza el middleware para validar el jwt del usuario, durante el proceso de autenticación 
module.exports = function (req, res, next) {
  // El token generado lo guardamos en el header 'x-auth-token'
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).send(ACCESO_DENEGADO);

  try {
    const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
    req.user = decoded; 
    next();
  }
  catch (ex) {
    res.status(400).send(TOKEN_INVALIDO);
  }
}