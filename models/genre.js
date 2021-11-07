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

// Se disponibiliza la exportación del esquema y modelo del género cinematográfico 
exports.genreSchema = genreSchema;
exports.Genre = Genre;