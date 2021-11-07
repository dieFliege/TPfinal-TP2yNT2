const mongoose = require('mongoose');

// Mensaje 
const ID_INVALIDO = 'ID inválido';

// Se disponibiliza el middleware para chequear la validez del objeto que se pasa en la URL de los request HTTP  
module.exports = function(req, res, next) {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) return res.status(404).send(ID_INVALIDO);
  next();
}