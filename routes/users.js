const auth = require('../middleware/auth');
const bcrypt = require('bcrypt');

// Utilizamos el módulo lodash, en lugar de underscore, para manipular objetos 
const _ = require('lodash');

const express = require('express');
const router = express.Router();

// Se importan el modelo del usuario y el método de validación de los datos ingresados
const {User, validate} = require('../models/user');

// Mensaje 
const USUARIO_YA_REGISTRADO = 'El usuario ya está registrado';

// Endpoint para método GET de HTTP (lista al usuario que está actualmente autenticado) 
router.get('/me', auth, async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
});

// Endpoint para método POST de HTTP (registra un usuario)
router.post('/', async (req, res) => {
  const { error } = validate(req.body); 
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send(USUARIO_YA_REGISTRADO);

  user = new User(_.pick(req.body, ['name', 'email', 'password', 'isAdmin']));
  // Creamos un String random de 10 carácteres, para agregar a la contraseña
  const salt = await bcrypt.genSalt(10);
  // Encriptamos la contraseña 
  user.password = await bcrypt.hash(user.password, salt);
  await user.save();

  // Generamos el jwt, el cual luego deberá ser pasado en el header 'x-auth-token'
  const token = user.generateAuthToken();
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
});

module.exports = router; 