// En este módulo se almacena la variable de entorno que utilizamos para la autenticación con JWTs
const config = require('config');

const jwt = require('jsonwebtoken');
const Joi = require('joi');
const mongoose = require('mongoose');

// Esquema del usuario 
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: Boolean
});

// Método para generar un JWT en el momento que el usuario se autentique en la aplicación  
userSchema.methods.generateAuthToken = function() { 
  const token = jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get('jwtPrivateKey'));
  return token;
}

// Modelo que define a la entidad del usuario 
const User = mongoose.model('User', userSchema);

// Método para validar los datos del usuario que se ingresa 
function validateUser(user) {
  const validSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required()
  });

  return validSchema.validate({ name: user.name, email: user.email, password: user.password });
}

/** 
 * Se disponibiliza la exportación del modelo del usuario 
 * y el método de validación de los datos ingresados 
 */
exports.User = User; 
exports.validate = validateUser;