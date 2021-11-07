const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// Mensaje
const clienteNoExiste = 'No existe ningún cliente con el ID brindado.';


// Se importa el modelo del cliente 
const {Customer} = require('../models/customer'); 

// Endpoint para método GET de HTTP (lista a todos los clientes) 
router.get('/', async (req, res) => {
    const customers = await Customer.find().sort('name');
    res.send(customers);
});

// Endpoint para método POST de HTTP (agrega un cliente)
router.post('/', async (req, res) => {
    let customer = new Customer({ 
      name: req.body.name,
      email: req.body.email
    });
    customer = await customer.save();
    
    res.send(customer);
});

// Endpoint para método PUT de HTTP (actualiza los datos del cliente cuyo ID se indique)
router.put('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndUpdate(req.params.id,
      { 
        name: req.body.name,
        email: req.body.email
      }, { new: true });
  
    if (!customer) return res.status(404).send(clienteNoExiste);
    
    res.send(customer);
});

// Endpoint para método DELETE de HTTP (remueve al cliente cuyo ID se indique)
router.delete('/:id', async (req, res) => {
    const customer = await Customer.findByIdAndRemove(req.params.id);
  
    if (!customer) return res.status(404).send(clienteNoExiste);
  
    res.send(customer);
});

// Endpoint para método GET de HTTP (lista a un solo cliente, determinado por el ID que se indique)
router.get('/:id', async (req, res) => {
    const customer = await Customer.findById(req.params.id);
  
    if (!customer) return res.status(404).send(clienteNoExiste);
  
    res.send(customer);
});

// Se disponibiliza la ruta de clientes 
module.exports = router; 