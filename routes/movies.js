const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

/** 
 * Se importan los modelos de la película y del género cinematográfico 
 * Para la película se importa además el método de validación de los datos ingresados 
 */ 
const {Movie, validate} = require('../models/movie'); 
const {Genre} = require('../models/genre');

// Mensajes 
const generoInvalido = 'Género cinematográfico inválido.';
const peliculaNoExiste = 'No existe ninguna película con el ID brindado.';

// Endpoint para método GET de HTTP (lista a todas las películas) 
router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

// Endpoint para método POST de HTTP (agrega una película)
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send(generoInvalido);

  const movie = new Movie({ 
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    }
  });
  await movie.save();
  
  res.send(movie);
});

// Endpoint para método PUT de HTTP (actualiza los datos de la película cuyo ID se indique)
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send(generoInvalido);

  const movie = await Movie.findByIdAndUpdate(req.params.id,
    { 
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name
      }
    }, { new: true });

  if (!movie) return res.status(404).send(peliculaNoExiste);
  
  res.send(movie);
});

// Endpoint para método DELETE de HTTP (remueve a la película cuyo ID se indique)
router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) return res.status(404).send(peliculaNoExiste);

  res.send(movie);
});

// Endpoint para método GET de HTTP (lista a una sola película, determinada por el ID que se indique)
router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send(peliculaNoExiste);

  res.send(movie);
});

// Se disponibiliza la ruta de películas  
module.exports = router; 