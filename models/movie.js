const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

/**
 * Se importa el esquema de la película 
 * El género es parte de la definición del modelo de la película 
 */
const {genreSchema} = require('./genre');

// Esquema de la película  
const movieSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      genre: { 
        type: genreSchema,  
        required: true
      },
});

// Modelo que define a la entidad de la película 
const Movie = mongoose.model('Movie', movieSchema);

// Método para validar los datos de la película que se ingresa 
function validateMovie(movie) {
  const validSchema = Joi.object({
    title: Joi.string().min(5).max(50).required(),
    genreId: Joi.objectId().required()
  });

  return validSchema.validate({ title: movie.title, genreId: movie.genreId });
}

/** 
 * Se disponibiliza la exportación del esquema y modelo de la película 
 * y el método de validación de los datos ingresados 
 */  
exports.movieSchema = movieSchema;
exports.Movie = Movie;
exports.validate = validateMovie;