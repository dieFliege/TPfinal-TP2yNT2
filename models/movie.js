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

// Se disponibiliza la exportación del esquema y modelo de la película 
exports.movieSchema = movieSchema;
exports.Movie = Movie;