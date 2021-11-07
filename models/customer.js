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
        unique: true
      }
});

// Modelo que define a la entidad del cliente 
const Customer = mongoose.model('Customer', customerSchema);

// Se disponibiliza la exportación del esquema y modelo del cliente 
exports.customerSchema = customerSchema;
exports.Customer = Customer;