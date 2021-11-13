const Joi = require('joi');
Joi.objectId = require('joi-objectid')(Joi);
const mongoose = require('mongoose');

/*
 * Esquema de la renta 
 * Se definen campos parciales para cliente y película, 
 * de lo contrario, los esquemas completos de ambos provocarían 
 * el error "E11000 duplicate key error collection"  
 * */  
const rentalSchema = new mongoose.Schema({
    customer: { 
      type: new mongoose.Schema({
        name: {
          type: String,
          required: true,
          minlength: 5,
          maxlength: 50
        }
      }),  
      required: true
    },
    movie: {
      type: new mongoose.Schema({
        title: {
          type: String,
          required: true,
          trim: true, 
          minlength: 5,
          maxlength: 255
        }
      }),
      required: true
    },
    dateOut: { 
      type: String
    },
    dateReturned: { 
      type: String
    },
    rentalFee: { 
      type: Number
    }
});

// Modelo que define a la entidad de la renta 
const Rental = mongoose.model('Rental', rentalSchema);

// Método para validar los datos de la renta que se ingresa 
function validateRental(rental) {
  const validSchema = Joi.object({
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  });

  return validSchema.validate({ customerId: rental.customerId, movieId: rental.movieId });
}

/** 
 * Se disponibiliza la exportación del modelo de la renta 
 * y el método de validación de los datos ingresados 
 */  
exports.Rental = Rental;
exports.validate = validateRental;