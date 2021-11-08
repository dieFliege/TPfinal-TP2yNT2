const Joi = require('joi');

// Se disponibiliza el método para validar el id de los objetos que se pasen por request HTTP
module.exports = function() {
    Joi.objectId = require('joi-objectid')(Joi);
}