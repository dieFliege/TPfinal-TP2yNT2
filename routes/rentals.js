const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const validateObjectId = require('../middleware/validateObjectId');

/** 
 * Se importan los modelos de la renta, la película y del cliente 
 * Para la renta se importa además el método de validación de los datos ingresados 
 */   
const {Rental, validate} = require('../models/rental'); 
const {Movie} = require('../models/movie'); 
const {Customer} = require('../models/customer'); 

// Constantes para el alquiler 
const TIEMPO_ALQUILER = 300000000;
const PRECIO_ALQUILER = 200.0;

// Mensajes 
const PELICULA_INVALIDA = 'Cliente inválido.';
const RENTA_NO_EXISTE = 'No existe ninguna renta con el ID brindado.';

// Endpoint para método GET de HTTP (lista a todas las rentas) 
router.get('/', async (req, res) => {
  const rentals = await Rental.find();
  res.send(rentals);
});

// Endpoint para método POST de HTTP (agrega una renta)
router.post('/', auth, async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send(PELICULA_INVALIDA);

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send(PELICULA_INVALIDA);

  let today = new Date();
  let returnDate = new Date(Date.now() + TIEMPO_ALQUILER);
  const ddToday = String(today.getDate());
  const mmToday = String(today.getMonth());
  const yyyyToday = today.getFullYear();
  const ddreturnDate = String(returnDate.getDate());
  const mmreturnDate = String(returnDate.getMonth());
  const yyyyreturnDate = returnDate.getFullYear();
  today = `${ddToday}/${mmToday}/${yyyyToday}`;
  returnDate = `${ddreturnDate}/${mmreturnDate}/${yyyyreturnDate}`;

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
    },
    dateOut: today,
    dateReturned: returnDate,
    rentalFee: PRECIO_ALQUILER
  });
  await rental.save();
  
  res.send(rental);
});

// Endpoint para método GET de HTTP (lista a una sola renta, determinada por el ID que se indique)
router.get('/:id', validateObjectId, async (req, res) => {
  const rental = await Rental.findById(req.params.id);

  if (!rental) return res.status(404).send(RENTA_NO_EXISTE);

  res.send(rental);
});

// Se disponibiliza la ruta de películas 
module.exports = router; 