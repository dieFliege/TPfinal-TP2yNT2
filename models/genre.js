const Joi = require('joi');
const mongoose = require('mongoose');

// Esquema del género cinematográfico 
const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  }
});

// Modelo que define a la entidad del género cinematográfico 
const Genre = mongoose.model('Genre', genreSchema);

// Método para validar los datos del género cinematográfico que se ingresa 
function validateGenre(genre) {
  const validSchema = Joi.object({
    name: Joi.string().min(5).max(50).required()
  });

  return validSchema.validate({ name: genre.name });
}

/**
 * Se disponibiliza la exportación del esquema y modelo del género cinematográfico 
 * y el método de validación de los datos ingresados 
 */  
exports.genreSchema = genreSchema;
exports.Genre = Genre;
exports.validate = validateGenre;