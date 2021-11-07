const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Mensaje 
const generoNoExiste = 'No existe ningún genéro cinematográfico con el ID brindado.';

// Se importa el modelo del género cinematográfico y el método de validación de los datos ingresados 
const {Genre, validate} = require('../models/genre');

// Endpoint para método GET de HTTP (lista a todos los géneros cinematográficos) 
router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name');
  res.send(genres);
});

// Endpoint para método POST de HTTP (agrega un género cinematográfico)
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);
  
  let genre = new Genre({ name: req.body.name });
  genre = await genre.save();
  
  res.send(genre);
});

// Endpoint para método PUT de HTTP (actualiza los datos del género cinematográfico cuyo ID se indique)
router.put('/:id', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);  
  
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
    new: true
  });

  if (!genre) return res.status(404).send(generoNoExiste);
  
  res.send(genre);
});

// Endpoint para método DELETE de HTTP (remueve al género cinematográfico cuyo ID se indique)
router.delete('/:id', async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id);

  if (!genre) return res.status(404).send(generoNoExiste);

  res.send(genre);
});

// Endpoint para método GET de HTTP (lista a un solo género cinematográfico, determinado por el ID que se indique)
router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id);

  if (!genre) return res.status(404).send(generoNoExiste);

  res.send(genre);
});

// Se disponibiliza la ruta de géneros cinematográficos 
module.exports = router;