const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Se importan los modelos de la renta, la película y del cliente  
const {Rental} = require('../models/rental'); 
const {Movie} = require('../models/movie'); 
const {Customer} = require('../models/customer'); 

// Mensajes 
const peliculaInvalida = 'Cliente inválido.';
const rentaNoExiste = 'No existe ninguna renta con el ID brindado.';

// Endpoint para método GET de HTTP (lista a todas las rentas) 
router.get('/', async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

// Endpoint para método POST de HTTP (agrega una renta)
router.post('/', async (req, res) => {
  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send(peliculaInvalida);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send(peliculaInvalida);

  let rental = new Rental({ 
    customer: {
      _id: customer._id,
      name: customer.name, 
      email: customer.email
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      genre: movie.genre
    }
  });
  await rental.save();
  
  res.send(rental);
});

// Endpoint para método GET de HTTP (lista a una sola renta, determinada por el ID que se indique)
router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send(rentaNoExiste);

  res.send(rental);
});

// Se disponibiliza la ruta de películas 
module.exports = router; 