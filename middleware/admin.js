// Mensaje 
const ACCESO_DENEGADO = 'Acceso denegado.';

// Se disponibiliza el middleware para validar si el usuario es administrador o no 
module.exports = function (req, res, next) {     
  if (!req.user.isAdmin) return res.status(403).send(ACCESO_DENEGADO);
  next();
}