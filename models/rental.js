const mongoose = require('mongoose');

/**
 * Se importan los esquemas del cliente y de la película 
 * El cliente y la película son parte de la definición del modelo de la renta 
 */
const {customerSchema} = require('./customer');
const {movieSchema} = require('./movie');

// Esquema de la renta 
const rentalSchema = new mongoose.Schema({
    customer: { 
      type: customerSchema,  
      required: true
    },
    movie: {
      type: movieSchema,
      required: true
    }
});

// Modelo que define a la entidad de la renta 
const Rental = mongoose.model('Rental', rentalSchema);

// Se disponibiliza la exportación del modelo de la renta 
exports.Rental = Rental;