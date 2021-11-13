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
        minlength: 1,
        maxlength: 255
      },
      genre: { 
        type: genreSchema,  
        required: true
      },
      plot: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      year: {
        type: Number,
        required: true,
        min: 1900,
        max: 2099
      },
      rated: {
        type: String,
        required: true,
        trim: true, 
        minlength: 1,
        maxlength: 10
      },
      actors: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      awards: {
        type: String,
        required: true,
        trim: true, 
        minlength: 1,
        maxlength: 255
      },
      poster: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      writer: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      imdbID: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 20
      },
      country: {
        type: String,
        required: true,
        trim: true, 
        minlength: 2,
        maxlength: 50
      },
      runtime: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 10
      },
      director: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      language: {
        type: String,
        required: true,
        trim: true, 
        minlength: 5,
        maxlength: 255
      },
      released: {
        type: String,
        required: true,
        trim: true, 
        minlength: 10,
        maxlength: 15
      },
      metascore: {
        type: Number,
        required: true,
        min: 0,
        max: 100
      },
      imdbVotes: {
        type: Number,
        required: true,
        min: 0
      },
      imdbRating: {
        type: Number,
        required: true,
        min: 0,
        max: 10
      }
});

// Modelo que define a la entidad de la película 
const Movie = mongoose.model('Movie', movieSchema);

// Método para validar los datos de la película que se ingresa 
function validateMovie(movie) {
  const validSchema = Joi.object({
    title: Joi.string().min(1).max(50).required(),
    genreId: Joi.objectId().required(),
    plot: Joi.string().min(5).max(255).required(),
    year: Joi.number().min(1900).max(2099).required(),
    rated: Joi.string().min(1).max(10).required(),
    actors: Joi.string().min(5).max(255).required(),
    awards: Joi.string().min(1).max(255).required(),
    poster: Joi.string().min(5).max(255).required(),
    writer: Joi.string().min(5).max(255).required(),
    imdbID: Joi.string().min(5).max(20).required(),
    country: Joi.string().min(2).max(50).required(),
    runtime: Joi.string().min(5).max(10).required(),
    director: Joi.string().min(5).max(255).required(),
    language: Joi.string().min(5).max(255).required(),
    released: Joi.string().min(10).max(15).required(),
    metascore: Joi.number().min(0).max(100).required(),
    imdbVotes: Joi.number().min(1900).required(),
    imdbRating: Joi.number().min(0).max(10).required()
  });

  return validSchema.validate({ 
    title: movie.title, 
    genreId: movie.genreId,
    plot: movie.plot,
    year: movie.year,
    rated: movie.rated,
    actors: movie.actors,
    awards: movie.awards,
    poster: movie.poster,
    writer: movie.writer,
    imdbID: movie.imdbID,
    country: movie.country,
    runtime: movie.runtime,
    director: movie.director,
    language: movie.language,
    released: movie.released,
    metascore: movie.metascore,
    imdbVotes: movie.imdbVotes,
    imdbRating: movie.imdbRating
   });
}

/** 
 * Se disponibiliza la exportación del modelo de la película 
 * y el método de validación de los datos ingresados 
 */
exports.Movie = Movie;
exports.validate = validateMovie;