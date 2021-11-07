const Joi = require('joi');
const mongoose = require('mongoose');

// Esquema del cliente    
const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50
      },
      email: {
        type: String,
        required: true,
        minlength: 7,
        maxlength: 255,
      }
});

// Modelo que define a la entidad del cliente 
const Customer = mongoose.model('Customer', customerSchema);

// Método para validar los datos del cliente que se ingresa 
function validateCustomer(customer) {
  const validSchema = Joi.object({
    name: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(7).max(255).required().email()
  });

  return validSchema.validate({ name: customer.name, email: customer.email });
}

/** 
 * Se disponibiliza la exportación del modelo del cliente 
 * y el método de validación de los datos ingresados 
 */
exports.Customer = Customer;
exports.validate = validateCustomer;